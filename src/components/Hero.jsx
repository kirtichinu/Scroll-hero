import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Car from './Car.jsx'
import { HEADLINE, STATS } from '../data/content.js'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    // gsap.context scopes selectors to `root` and lets us revert everything on unmount
    // (important with React StrictMode, which mounts effects twice in dev).
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // ---------- Full motion ----------
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const letters = gsap.utils.toArray('.letter')
        const letterScroll = gsap.utils.toArray('.letter-scroll')
        const stats = gsap.utils.toArray('.stat')

        /* 1. INTRO (time-based, runs once on load) ------------------------- */
        gsap.set(['.letter', '.stat', '.car-fade', '.hint'], { autoAlpha: 0 })
        gsap.set('.letter', { yPercent: 60 })
        gsap.set('.stat', { y: 32 })

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
        intro
          .to('.letter', {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.1,
            stagger: 0.05,
          })
          .to('.car-fade', { autoAlpha: 1, duration: 1 }, 0.3)
          .addLabel('stats', '-=0.5')
          .to(
            '.stat',
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.18 },
            'stats',
          )
          .to('.hint', { autoAlpha: 1, duration: 0.8 }, '-=0.3')

        // count the numbers up as each stat appears
        stats.forEach((el, i) => {
          const num = el.querySelector('.stat-num')
          const target = Number(num.dataset.value)
          const counter = { v: 0 }
          num.textContent = '0'
          intro.to(
            counter,
            {
              v: target,
              duration: 1.4,
              ease: 'power2.out',
              onUpdate: () => (num.textContent = Math.round(counter.v)),
            },
            `stats+=${i * 0.18}`, // same start time as stat i
          )
        })

        /* 2. SCROLL (progress-based, scrubbed) ------------------------------ */
        // Every tween sits at position 0 with duration 1, so the whole timeline
        // maps 1:1 onto scroll progress. `scrub: 1.2` adds the smoothing lag.
        const scrollTl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true, // re-evaluate function-based values on resize
          },
        })

        // Car drives from fully off-screen left to fully off-screen right.
        scrollTl.fromTo(
          '.car-drive',
          { x: () => -root.current.querySelector('.car-drive').offsetWidth * 1.1 },
          {
            x: () => window.innerWidth + root.current.querySelector('.car-drive').offsetWidth * 0.1,
            ease: 'sine.inOut',
            duration: 1,
          },
          0,
        )

        // Gentle yaw + lane drift so it reads as steering, not sliding.
        scrollTl.to(
          '.car-steer',
          {
            keyframes: [
              { rotation: 2.5, y: -14, duration: 0.3 },
              { rotation: -2.5, y: 16, duration: 0.4 },
              { rotation: 0, y: 0, duration: 0.3 },
            ],
            ease: 'sine.inOut',
          },
          0,
        )

        // Headlights come on once it is rolling.
        scrollTl.to('.car-beams', { opacity: 1, duration: 0.12 }, 0.02)

        // Road dashes slide the opposite way for parallax speed.
        scrollTl.fromTo('.road-dashes', { xPercent: 0 }, { xPercent: -50, duration: 1 }, 0)

        // Letters ripple up as the car passes beneath them.
        letterScroll.forEach((el, i) => {
          scrollTl.to(
            el,
            { yPercent: -22, duration: 0.07, yoyo: true, repeat: 1, ease: 'sine.inOut' },
            0.1 + (i / (letterScroll.length - 1)) * 0.62,
          )
        })

        // Scroll hint disappears; progress bar fills.
        scrollTl.to('.hint', { opacity: 0, duration: 0.06 }, 0)
        scrollTl.fromTo('.progress', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)

        return () => {
          intro.kill()
          scrollTl.kill()
        }
      })

      // ---------- Reduced motion: static layout, car parked mid-screen ----------
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.car-drive', { x: () => window.innerWidth / 2 - 180 })
        gsap.set('.car-beams', { opacity: 1 })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-ink"
      aria-label="Hero"
    >
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(255,90,31,0.14),transparent_70%)]" />

      {/* Headline */}
      <h1
        aria-label={HEADLINE.join(' ')}
        className="absolute inset-x-0 top-[14vh] z-10 flex flex-wrap justify-center gap-x-[1.2em] px-4 text-[clamp(1.6rem,5.2vw,5rem)] font-bold leading-none"
      >
        {HEADLINE.map((word) => (
          <span key={word} aria-hidden="true" className="flex">
            {[...word].map((ch, i) => (
              // outer span = intro tween, inner span = scroll tween (never animate the same prop on one node twice)
              <span key={i} className="letter inline-block overflow-visible px-[0.14em]">
                <span className="letter-scroll inline-block will-transform">{ch}</span>
              </span>
            ))}
          </span>
        ))}
      </h1>

      {/* Road + car */}
      <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
        <div className="relative h-[clamp(120px,24vw,260px)]">
          <div className="absolute inset-x-0 top-1/2 h-[clamp(110px,20vw,220px)] -translate-y-1/2 bg-white/[0.04]">
            <div className="road-dashes will-transform absolute inset-y-0 left-0 w-[200%]" />
          </div>

          <div className="car-fade absolute inset-0">
            <div className="car-drive will-transform absolute left-0 top-1/2 w-[clamp(260px,38vw,560px)] -translate-y-1/2">
              <div className="car-steer will-transform">
                <Car className="block w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <ul className="absolute inset-x-0 bottom-[9vh] z-10 mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-6 md:grid-cols-4">
        {STATS.map((s, i) => (
          <li key={i} className="stat border-t border-white/15 pt-4">
            <div className="text-[clamp(2rem,5vw,4rem)] font-bold leading-none text-accent">
              <span className="stat-num" data-value={s.value}>
                {s.value}
              </span>
              %
            </div>
            <p className="mt-2 max-w-[18ch] text-sm text-white/60 md:text-base">{s.label}</p>
          </li>
        ))}
      </ul>

      {/* Scroll hint + progress */}
      <div className="hint absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-white/40">
        Scroll
      </div>
      <div className="progress will-transform absolute bottom-0 left-0 z-30 h-[3px] w-full origin-left scale-x-0 bg-accent" />
    </section>
  )
}
