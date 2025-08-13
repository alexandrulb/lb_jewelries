# luxurybazaar_jewelry

Blocks: **LBJ - Section** (`lb-jewelry/simple-section`), **LBJ - Hero** (`lb-jewelry/hero`), **LBJ - CTA** (`lb-jewelry/cta`), **LBJ - Carousel** (`lb-jewelry/carousel`).

## Build
```bash
npm install
npm run build
```

## Notes
- Block names are hyphenated (`lb-jewelry/*`) per Gutenberg rules.
- Carousel loads Swiper from a CDN only on pages using the block.
- Init script lives at `assets/carousel-init.js` (no build required).
