// App de impresión — renderiza TODOS los módulos en secuencia
const { useEffect } = React;

const PRINT_MODULES = [
  { label: 'El binario',         eyebrow: '01', Comp: ModuleIntro },
  { label: 'Decimal ↔ Binario',  eyebrow: '02', Comp: ModuleConvert },
  { label: 'Texto · ASCII',      eyebrow: '03', Comp: ModuleAscii },
  { label: 'Píxeles 1-bit',      eyebrow: '04', Comp: Module1Bit },
  { label: 'Escala de grises',   eyebrow: '05', Comp: ModuleGrayscale },
  { label: 'Color RGB',          eyebrow: '06', Comp: ModuleRGB },
  { label: 'Pixel-art',          eyebrow: '07', Comp: ModulePixelArt },
  { label: 'Reto final',         eyebrow: '08', Comp: ModuleChallenge },
];

// stub goto to avoid crashes
window.__goto = () => {};

function PrintApp() {
  return (
    <div className="print-doc">
      <section className="print-cover">
        <div className="brand">
          <div className="brand-mark">
            <i></i><i className="off"></i><i className="off"></i><i></i>
          </div>
          <div className="brand-name">
            Código Binario
            <small>0 · 1 · clase interactiva</small>
          </div>
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 64, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.02, marginTop: 60, maxWidth: '18ch' }}>
          Entiende y aplica el <em style={{ fontStyle: 'normal', color: 'var(--on)' }}>código binario</em>.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: '55ch', marginTop: 20 }}>
          Un cuaderno de 8 módulos para secundaria: desde entender qué son los bits, pasando por ASCII, hasta crear y decodificar imágenes en binario.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 30 }}>
          {PRINT_MODULES.map((m, i) => (
            <span key={i} className="pill"><b style={{ color: 'var(--ink)' }}>{m.eyebrow}</b>&nbsp;&nbsp;{m.label}</span>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: 56, right: 56, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
          <span>Material pedagógico</span>
          <span>8 módulos interactivos</span>
        </div>
      </section>

      {PRINT_MODULES.map((m, i) => (
        <section className="print-page" key={i}>
          <div className="print-page-header">
            <span>{m.eyebrow} · {m.label}</span>
            <span>Página {i + 2} de {PRINT_MODULES.length + 1}</span>
          </div>
          <main className="main print-main">
            <m.Comp onAdvance={() => {}} />
          </main>
        </section>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PrintApp />);
