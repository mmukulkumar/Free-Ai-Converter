/**
 * Media Converter Utility
 * Uses FFmpeg.wasm for client-side video/audio conversion
 * All processing done locally - files never leave the device
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

// Singleton FFmpeg instance
let ffmpeg: FFmpeg | null = null;
let isLoading = false;
let loadPromise: Promise<FFmpeg> | null = null;

// Progress callback type
type ProgressCallback = (progress: number) => void;

/**
 * Load FFmpeg WASM module (lazy-loaded on first use)
 * Uses CDN for core files to reduce bundle size
 */
export const loadFFmpeg = async (onProgress?: ProgressCallback): Promise<FFmpeg> => {
    // Return existing instance if already loaded
    if (ffmpeg && ffmpeg.loaded) {
        return ffmpeg;
    }

    // Return existing loading promise if in progress
    if (loadPromise) {
        return loadPromise;
    }

    isLoading = true;

    loadPromise = (async () => {
        try {
            ffmpeg = new FFmpeg();

            // Set up progress tracking
            if (onProgress) {
                ffmpeg.on('progress', ({ progress }) => {
                    onProgress(Math.round(progress * 100));
                });
            }

            // Load from CDN (reduces bundle size significantly)
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            isLoading = false;
            return ffmpeg;
        } catch (error) {
            isLoading = false;
            loadPromise = null;
            console.error('Failed to load FFmpeg:', error);
            throw new Error('Failed to load video/audio processing engine. Please refresh and try again.');
        }
    })();

    return loadPromise;
};

/**
 * Check if FFmpeg is loaded
 */
export const isFFmpegLoaded = (): boolean => {
    return ffmpeg !== null && ffmpeg.loaded;
};

/**
 * Check if FFmpeg is currently loading
 */
export const isFFmpegLoading = (): boolean => {
    return isLoading;
};

// ===== VIDEO CONVERSION =====

export interface VideoConversionOptions {
    fps?: number;           // Frames per second (for GIF)
    scale?: number;         // Max width in pixels
    quality?: 'low' | 'medium' | 'high';
    startTime?: number;     // Start time in seconds
    duration?: number;      // Duration in seconds
}

/**
 * Convert video to different format
 * Supports: MP4, GIF, WEBM, MOV
 */
export const convertVideo = async (
    file: File,
    outputFormat: 'mp4' | 'gif' | 'webm' | 'avi',
    options: VideoConversionOptions = {},
    onProgress?: ProgressCallback
): Promise<Blob> => {
    const ff = await loadFFmpeg(onProgress);

    const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const inputName = `input.${inputExt}`;
    const outputName = `output.${outputFormat}`;

    try {
        // Write input file to virtual filesystem
        await ff.writeFile(inputName, await fetchFile(file));

        let args: string[] = ['-i', inputName];

        // Add time trimming if specified
        if (options.startTime !== undefined) {
            args.push('-ss', options.startTime.toString());
        }
        if (options.duration !== undefined) {
            args.push('-t', options.duration.toString());
        }

        // Format-specific encoding
        switch (outputFormat) {
            case 'gif':
                const fps = options.fps || 15;
                const scale = options.scale || 480;
                // High quality GIF with palette generation
                args.push(
                    '-vf', `fps=${fps},scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=single[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5`,
                    '-loop', '0'
                );
                break;

            case 'mp4':
                // H.264 encoding with quality preset
                const crf = options.quality === 'high' ? 18 : options.quality === 'low' ? 28 : 23;
                args.push(
                    '-c:v', 'libx264',
                    '-preset', 'medium',
                    '-crf', crf.toString(),
                    '-c:a', 'aac',
                    '-b:a', '128k',
                    '-movflags', '+faststart'
                );
                if (options.scale) {
                    args.push('-vf', `scale=${options.scale}:-2`);
                }
                break;

            case 'webm':
                // VP9 encoding
                const webmCrf = options.quality === 'high' ? 20 : options.quality === 'low' ? 35 : 30;
                args.push(
                    '-c:v', 'libvpx-vp9',
                    '-crf', webmCrf.toString(),
                    '-b:v', '0',
                    '-c:a', 'libopus',
                    '-b:a', '128k'
                );
                if (options.scale) {
                    args.push('-vf', `scale=${options.scale}:-2`);
                }
                break;

            case 'avi':
                args.push(
                    '-c:v', 'mpeg4',
                    '-q:v', '5',
                    '-c:a', 'mp3',
                    '-b:a', '192k'
                );
                break;
        }

        args.push(outputName);

        // Execute conversion
        await ff.exec(args);

        // Read output file
        const data = await ff.readFile(outputName);

        // Clean up
        await ff.deleteFile(inputName);
        await ff.deleteFile(outputName);

        const mimeTypes: Record<string, string> = {
            mp4: 'video/mp4',
            gif: 'image/gif',
            webm: 'video/webm',
            avi: 'video/x-msvideo'
        };

        return new Blob([data], { type: mimeTypes[outputFormat] });
    } catch (error) {
        console.error('Video conversion failed:', error);
        throw new Error(`Failed to convert video to ${outputFormat.toUpperCase()}`);
    }
};

// ===== AUDIO CONVERSION =====

export interface AudioConversionOptions {
    bitrate?: number;       // kbps (e.g., 128, 192, 320)
    sampleRate?: number;    // Hz (e.g., 44100, 48000)
    channels?: 1 | 2;       // Mono or Stereo
    startTime?: number;     // Start time in seconds
    duration?: number;      // Duration in seconds
}

/**
 * Extract audio from video or convert audio format
 * Supports: MP3, WAV, OGG, AAC, FLAC
 */
export const convertAudio = async (
    file: File,
    outputFormat: 'mp3' | 'wav' | 'ogg' | 'aac' | 'flac',
    options: AudioConversionOptions = {},
    onProgress?: ProgressCallback
): Promise<Blob> => {
    const ff = await loadFFmpeg(onProgress);

    const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp3';
    const inputName = `input.${inputExt}`;
    const outputName = `output.${outputFormat}`;

    try {
        await ff.writeFile(inputName, await fetchFile(file));

        let args: string[] = ['-i', inputName];

        // Add time trimming
        if (options.startTime !== undefined) {
            args.push('-ss', options.startTime.toString());
        }
        if (options.duration !== undefined) {
            args.push('-t', options.duration.toString());
        }

        // Remove video stream (for video-to-audio extraction)
        args.push('-vn');

        // Format-specific encoding
        switch (outputFormat) {
            case 'mp3':
                const mp3Bitrate = options.bitrate || 192;
                args.push(
                    '-c:a', 'libmp3lame',
                    '-b:a', `${mp3Bitrate}k`
                );
                break;

            case 'wav':
                args.push(
                    '-c:a', 'pcm_s16le',
                    '-ar', (options.sampleRate || 44100).toString()
                );
                break;

            case 'ogg':
                args.push(
                    '-c:a', 'libvorbis',
                    '-q:a', '6'  // Quality scale 0-10
                );
                break;

            case 'aac':
                const aacBitrate = options.bitrate || 192;
                args.push(
                    '-c:a', 'aac',
                    '-b:a', `${aacBitrate}k`
                );
                break;

            case 'flac':
                args.push(
                    '-c:a', 'flac',
                    '-compression_level', '8'
                );
                break;
        }

        // Channel configuration
        if (options.channels) {
            args.push('-ac', options.channels.toString());
        }

        // Sample rate
        if (options.sampleRate && outputFormat !== 'wav') {
            args.push('-ar', options.sampleRate.toString());
        }

        args.push(outputName);

        await ff.exec(args);
        const data = await ff.readFile(outputName);

        // Clean up
        await ff.deleteFile(inputName);
        await ff.deleteFile(outputName);

        const mimeTypes: Record<string, string> = {
            mp3: 'audio/mpeg',
            wav: 'audio/wav',
            ogg: 'audio/ogg',
            aac: 'audio/aac',
            flac: 'audio/flac'
        };

        return new Blob([data], { type: mimeTypes[outputFormat] });
    } catch (error) {
        console.error('Audio conversion failed:', error);
        throw new Error(`Failed to convert audio to ${outputFormat.toUpperCase()}`);
    }
};

// ===== GIF TO VIDEO =====

/**
 * Convert GIF to video format
 */
export const gifToVideo = async (
    file: File,
    outputFormat: 'mp4' | 'webm' = 'mp4',
    options: VideoConversionOptions = {},
    onProgress?: ProgressCallback
): Promise<Blob> => {
    const ff = await loadFFmpeg(onProgress);

    try {
        await ff.writeFile('input.gif', await fetchFile(file));

        let args: string[] = ['-i', 'input.gif'];

        if (outputFormat === 'mp4') {
            args.push(
                '-movflags', 'faststart',
                '-pix_fmt', 'yuv420p',
                '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',  // Ensure even dimensions
                '-c:v', 'libx264',
                '-preset', 'medium',
                '-crf', '23'
            );
        } else {
            args.push(
                '-c:v', 'libvpx-vp9',
                '-crf', '30',
                '-b:v', '0'
            );
        }

        const outputName = `output.${outputFormat}`;
        args.push(outputName);

        await ff.exec(args);
        const data = await ff.readFile(outputName);

        await ff.deleteFile('input.gif');
        await ff.deleteFile(outputName);

        return new Blob([data], { type: outputFormat === 'mp4' ? 'video/mp4' : 'video/webm' });
    } catch (error) {
        console.error('GIF to video conversion failed:', error);
        throw new Error('Failed to convert GIF to video');
    }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get media file information (duration, resolution, etc.)
 */
export const getMediaInfo = async (file: File): Promise<{
    duration?: number;
    width?: number;
    height?: number;
    hasAudio: boolean;
    hasVideo: boolean;
}> => {
    // Use HTML5 media elements for quick info extraction
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith('video/');

        if (isVideo) {
            const video = document.createElement('video');
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                resolve({
                    duration: video.duration,
                    width: video.videoWidth,
                    height: video.videoHeight,
                    hasAudio: true,  // Assume true for videos
                    hasVideo: true
                });
            };
            video.onerror = () => {
                URL.revokeObjectURL(url);
                resolve({ hasAudio: false, hasVideo: false });
            };
            video.src = url;
        } else {
            const audio = document.createElement('audio');
            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                resolve({
                    duration: audio.duration,
                    hasAudio: true,
                    hasVideo: false
                });
            };
            audio.onerror = () => {
                URL.revokeObjectURL(url);
                resolve({ hasAudio: false, hasVideo: false });
            };
            audio.src = url;
        }
    });
};
