# Portfolio — Ahmad Zuliansyah Putra

Portfolio interaktif dengan React, Three.js, GSAP, dan Lenis — terinspirasi dari [david-hckh.com](https://david-hckh.com/).

## Menjalankan secara lokal

```bash
cd portfolio
npm install
npm run dev
```

Buka **http://localhost:5173** di browser.

## Tech Stack

- React + TypeScript + Vite
- Three.js (`@react-three/fiber`, `@react-three/drei`)
- GSAP + ScrollTrigger
- Lenis (smooth scroll)
- SCSS

## Struktur

- `src/data/` — profil & daftar project
- `src/components/three/` — scene 3D & karakter
- `src/components/` — section halaman

## Kustomisasi

Edit `src/data/profile.ts` dan `src/data/projects.ts` untuk mengubah konten.

Untuk mengganti karakter 3D, ubah URL model di `src/components/three/Character.tsx` (format GLTF/GLB dengan animasi idle).
