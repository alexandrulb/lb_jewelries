# WP Gutenberg Custom Blocks (Sections & Carousel)

A lightweight starter plugin that adds a few practical Gutenberg blocks for custom-designed pages:

- **Section**: A flexible wrapper with contained/full width, spacing, and color supports. Works as a layout section and accepts any InnerBlocks.
- **Hero**: Background image hero with overlay, editable title/subtitle, and adjustable min-height.
- **CTA**: Centered call-to-action with heading, paragraph, and button.
- **Carousel (Swiper)**: Simple image carousel using Swiper with pagination & arrows.

## Quick Start

1. Unzip into `wp-content/plugins/wp-gutenberg-custom-blocks` on your site.
2. In the plugin folder run:

```bash
npm install
npm run build
```
3. Activate **WP Gutenberg Custom Blocks** from **Plugins** in the WordPress admin.
4. Open the block editor and search for **Hero**, **Section**, **CTA**, or **Carousel (Swiper)** under the **Design/Media/Layout** categories.

> Note: The Carousel block enqueues Swiper from a CDN on pages where the block is used. If you prefer to bundle locally, replace the CDN URLs in `index.php` and include the library in your build.

## Development

- `npm start` for a watcher during development.
- The blocks are defined in `src/blocks/*` each with its own `block.json` and styles.
- Adjust styles to match your custom design system (CSS variables are aligned with theme.json presets if present).

## License

MIT
