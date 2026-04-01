export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      {/* Logo / Heading — Fredoka font */}
      <h1 className="text-6xl font-bold font-heading text-primary">
        Scribble
      </h1>
      <p className="text-xl text-text-muted font-body">
        Draw, guess, and laugh with friends!
      </p>

      {/* Color palette verification */}
      <div className="flex flex-wrap gap-3 justify-center max-w-md">
        {[
          { name: "Primary", className: "bg-primary" },
          { name: "Primary Light", className: "bg-primary-light" },
          { name: "Primary Dark", className: "bg-primary-dark" },
          { name: "Green", className: "bg-accent-green" },
          { name: "Red", className: "bg-accent-red" },
          { name: "Yellow", className: "bg-accent-yellow" },
          { name: "Blue", className: "bg-accent-blue" },
          { name: "Orange", className: "bg-accent-orange" },
        ].map((color) => (
          <div key={color.name} className="flex flex-col items-center gap-1">
            <div
              className={`w-12 h-12 rounded-xl ${color.className}`}
              style={{ boxShadow: "var(--shadow-sm)" }}
            />
            <span className="text-xs text-text-muted">{color.name}</span>
          </div>
        ))}
      </div>

      {/* Font verification */}
      <div
        className="rounded-2xl p-6 bg-surface flex flex-col gap-3 w-full max-w-md"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <h2 className="text-2xl font-heading font-bold text-text">
          Font Check
        </h2>
        <p className="font-body text-text">
          This body text uses <strong>Nunito</strong> — rounded and readable.
        </p>
        <p className="font-mono text-text-muted text-sm">
          Monospace: JetBrains Mono for timers & scores — 01:23
        </p>
      </div>

      {/* Button samples */}
      <div className="flex gap-3">
        <button className="px-6 py-3 rounded-xl bg-primary text-white font-body font-semibold hover:bg-primary-light transition-colors">
          Create Room
        </button>
        <button
          className="px-6 py-3 rounded-xl bg-surface text-primary font-body font-semibold border-2 border-border hover:border-primary transition-colors"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
