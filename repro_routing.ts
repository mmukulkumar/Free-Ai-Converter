
import { MENU_CATEGORIES } from './utils/formats';
import { ToolType } from './types';

// From App.tsx / Header.tsx
const getToolSlug = (tool: ToolType): string => {
    if (tool === 'image-compressor') return 'compress-image';
    if (tool === 'bg-remover') return 'remove-background';
    if (tool === 'optimizer') return 'svg-optimizer';
    return tool.replace('-', '-to-');
};

const getToolFromSlug = (slug: string): ToolType | null => {
    if (slug === 'compress-image') return 'image-compressor';
    if (slug === 'remove-background') return 'bg-remover';
    if (slug === 'svg-optimizer') return 'optimizer';
    // Attempt to maintain original behavior (using replace which only replaces first instance)
    if (slug.includes('-to-')) return slug.replace('-to-', '-') as ToolType;
    return null;
};

console.log('Checking Menu Navigation...');

let hasError = false;

MENU_CATEGORIES.forEach(category => {
    console.log(`\nCategory: ${category.title}`);
    category.items.forEach(item => {
        const id = item.id;
        const slug = getToolSlug(id);
        const resolvedId = getToolFromSlug(slug);

        const status = id === resolvedId ? 'OK' : 'FAIL';
        if (status === 'FAIL') hasError = true;

        console.log(`  [${status}] ID: ${id} -> Slug: ${slug} -> Resolved: ${resolvedId}`);
    });
});

if (hasError) {
    console.log('\n❌ Errors found in routing logic!');
} else {
    console.log('\n✅ All tools route correctly!');
}
