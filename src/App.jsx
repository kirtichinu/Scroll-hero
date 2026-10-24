import Hero from './components/Hero.jsx'

export default function App() {
  return (
    <main>
      <Hero />
      {/* Content after the pinned hero so the page ends naturally */}
      <section className="flex min-h-[70vh] items-center justify-center px-6 text-center">
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.4em] text-white/40">End of the road</p>
          <h2 className="mt-4 text-3xl font-medium sm:text-4xl">
            Motion tied to scroll, not to a timer.
          </h2>
          <p className="mt-4 text-white/60">
            Scroll back up and the car reverses along the exact same path.
          </p>
        </div>
      </section>
    </main>
  )
}
