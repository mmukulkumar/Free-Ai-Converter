
import React, { useEffect, useRef } from 'react';

const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853']; // Google Brand Colors

interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    originalX: number;
    originalY: number;
}

const PixelAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: 0, y: 0 });
    const isMouseActive = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            initParticles(canvas.width, canvas.height);
        };

        const initParticles = (width: number, height: number) => {
            particles.current = [];
            const particleCount = Math.floor((width * height) / 4000); // Density control

            for (let i = 0; i < particleCount; i++) {
                // Create a spiral/vortex distribution initially
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * Math.min(width, height) * 0.4;
                const x = width / 2 + Math.cos(angle) * radius;
                const y = height / 2 + Math.sin(angle) * radius;

                particles.current.push({
                    x,
                    y,
                    originalX: x,
                    originalY: y,
                    size: Math.random() * 2 + 1,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current.forEach(p => {
                // Base movement
                p.x += p.vx;
                p.y += p.vy;

                // Mouse interaction (Repel)
                if (isMouseActive.current) {
                    const dx = mouse.current.x - p.x;
                    const dy = mouse.current.y - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 150;

                    if (distance < maxDist) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (maxDist - distance) / maxDist;
                        const repelStrength = 2; // Strength of repulsion

                        p.vx -= forceDirectionX * force * repelStrength;
                        p.vy -= forceDirectionY * force * repelStrength;
                    }
                }

                // Return to original position (Slow elastic effect)
                const dx = p.originalX - p.x;
                const dy = p.originalY - p.y;
                p.vx += dx * 0.005;
                p.vy += dy * 0.005;

                // Friction
                p.vx *= 0.95;
                p.vy *= 0.95;

                // Draw
                ctx.fillStyle = p.color;
                ctx.beginPath();
                // Drawing squares for "pixel" look, or circles. Reference seems to be small squares or dots.
                // Let's use squares for "pixel" feel
                ctx.fillRect(p.x, p.y, p.size, p.size);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            isMouseActive.current = true;
        };

        const handleMouseLeave = () => {
            isMouseActive.current = false;
        };

        window.addEventListener('resize', resize);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};

export default React.memo(PixelAnimation);
