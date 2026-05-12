// App principal — Código Binario
const { useState, useEffect } = React;

const MODULES = [
  { id: 0, label: 'El binario', eyebrow: '01', Comp: () => ModuleIntro({ onAdvance: () => window.__goto(1) }) },
  { id: 1, label: 'Decimal ↔ Binario', eyebrow: '02', Comp: () => ModuleConvert({ onAdvance: () => window.__goto(2) }) },
  { id: 2, label: 'Texto · ASCII', eyebrow: '03', Comp: () => ModuleAscii({ onAdvance: () => window.__goto(3) }) },
  { id: 3, label: 'Píxeles 1-bit', eyebrow: '04', Comp: () => Module1Bit({ onAdvance: () => window.__goto(4) }) },
  { id: 4, label: 'Escala de grises', eyebrow: '05', Comp: () => ModuleGrayscale({ onAdvance: () => window.__goto(5) }) },
  { id: 5, label: 'Color RGB', eyebrow: '06', Comp: () => ModuleRGB({ onAdvance: () => window.__goto(6) }) },
  { id: 6, label: 'Pixel-art', eyebrow: '07', Comp: () => ModulePixelArt({ onAdvance: () => window.__goto(7) }) },
  { id: 7, label: 'Reto final', eyebrow: '08', Comp: () => ModuleChallenge() },
];

function App() {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('cb_visited') || '[]'));
    } catch { return new Set(); }
  });

  useEffect(() => {
    window.__goto = (i) => {
      setActive(i);
      setVisited(v => {
        const nv = new Set(v);
        nv.add(i);
        try { localStorage.setItem('cb_visited', JSON.stringify([...nv])); } catch {}
        return nv;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }, []);

  useEffect(() => {
    setVisited(v => {
      const nv = new Set(v);
      nv.add(active);
      try { localStorage.setItem('cb_visited', JSON.stringify([...nv])); } catch {}
      return nv;
    });
  }, [active]);

  const Current = MODULES[active];
  const pct = Math.round((visited.size / MODULES.length) * 100);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <i></i>
            <i className="off"></i>
            <i className="off"></i>
            <i></i>
          </div>
          <div className="brand-name">
            Código Binario
            <small>0 · 1 · clase interactiva</small>
          </div>
        </div>

        <nav className="nav" data-screen-label="Nav sidebar">
          {MODULES.map((m, i) => (
            <button
              key={m.id}
              className={'nav-item' + (active === i ? ' active' : '') + (visited.has(i) ? ' done' : '')}
              onClick={() => window.__goto(i)}
            >
              <span className="nav-num">{m.eyebrow}</span>
              <span>{m.label}</span>
              <span className="nav-check">✓</span>
            </button>
          ))}
        </nav>

        <div className="progress-card">
          <div className="label">Tu progreso</div>
          <div className="val">{visited.size}/{MODULES.length}</div>
          <div className="progress-bar"><i style={{ width: pct + '%' }}></i></div>
        </div>
      </aside>

      <main className="main" data-screen-label={`${MODULES[active].eyebrow} ${MODULES[active].label}`}>
        <Current.Comp key={active} />
        <footer className="site-footer">
          <span>Prof. Erwin Cortez</span>
          <span className="sep">·</span>
          <span>Tecnología · 7mo grado</span>
          <span className="sep">·</span>
          <span>2026</span>
          <span className="sep">·</span>
          <a href="mailto:profe.erwin.cortez@gmail.com">profe.erwin.cortez@gmail.com</a>
        </footer>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
