# PicPath

Rebuild pictures one piece at a time. An offline-capable, mobile-first picture-puzzle PWA with a winding level path.

**Play:** https://mahdimohebbi.github.io/picpath-web/

- 30 levels in 5 units: jigsaw, swap and sliding puzzles, with rotation, hidden references and limits later on
- Stars, XP, daily streak, hearts and hints. Progress is saved on your device
- Works offline and can be installed to your home screen

## Develop

```sh
npm install
npm run dev        # local dev server
npm test -- --run  # engine unit tests
npm run build      # production build to dist/
```

Pushes to `main` are tested, built and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

Photo credits: [CREDITS.md](CREDITS.md).
