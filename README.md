# Scroll-Driven Hero Section

A hero section where a car drives across the screen **as you scroll**, built with React, Tailwind CSS v4 and GSAP (ScrollTrigger).

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Deploy to GitHub Pages

1. Create a GitHub repo and push this project to the `main` branch.
2. In the repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push again (or run the workflow manually). The site goes live at `https://<username>.github.io/<repo>/`.

`vite.config.js` uses `base: './'`, so it works under any repo name with no changes.

## How it works

| Requirement | Implementation |
| --- | --- |
| Intro animation | One GSAP timeline: letters stagger in (fade + `yPercent`), stats stagger in one by one and count up. |
| Scroll-tied motion | A second timeline with `ScrollTrigger` (`pin`, `scrub: 1.2`). Progress comes from scroll position, never from a timer. |
| Easing / smoothness | `scrub: 1.2` interpolates toward the scroll position (smooth catch-up), plus `sine.inOut` on the car's travel. |
| Performance | Only `transform` and `opacity` are animated. `will-change: transform` on moving layers. No layout reads inside scroll handlers (GSAP batches them). |
| Responsive | Car travel distance uses function-based values + `invalidateOnRefresh`, so it recalculates on resize. |
| Accessibility | `prefers-reduced-motion` gets a static layout; the headline has an `aria-label`. |

### Design decisions worth knowing

- **One property, one tween per element.** Letters use an outer span (intro) and an inner span (scroll) so the two timelines never fight over the same `transform`.
- **`gsap.context` + `matchMedia`** scope selectors to the component and revert cleanly on unmount (needed with React StrictMode).
- **The car is an original inline SVG**, so there are no image assets to load or license.

## Structure

```
src/
  components/Hero.jsx   # layout + both animation timelines
  components/Car.jsx    # SVG car
  data/content.js       # headline and stats copy
```
