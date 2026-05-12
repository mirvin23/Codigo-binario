// Módulos pedagógicos — Código Binario
const { useState, useEffect, useMemo, useRef, useCallback } = React;

/* ——— Helpers ——— */
const toBin = (n, pad = 8) => n.toString(2).padStart(pad, '0');
const fromBin = (s) => parseInt(s, 2);
const powers = [128, 64, 32, 16, 8, 4, 2, 1];

function Eyebrow({ children }) {
  return <div className="eyebrow"><span className="dot"></span>{children}</div>;
}

function ModuleHeader({ eyebrow, title, lede, children }) {
  return (
    <header className="module-header fade-in">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </header>
  );
}

function Card({ children, style }) {
  return <div className="card" style={style}>{children}</div>;
}

/* ═══════════════ MÓDULO 1 — ¿Qué es el binario? ═══════════════ */
function ModuleIntro({ onAdvance }) {
  const [bits, setBits] = useState([0, 1, 0, 0, 0, 0, 0, 1]); // 65 = 'A'
  const decimal = bits.reduce((acc, b, i) => acc + b * powers[i], 0);
  const flip = (i) => setBits(bits.map((b, j) => j === i ? (b ? 0 : 1) : b));

  const parts = bits.map((b, i) => b ? powers[i] : null).filter(Boolean);

  return (
    <>
      <ModuleHeader
        eyebrow="Módulo 01 · Fundamentos"
        title={<>Una computadora solo sabe decir <em>sí</em> o <em>no</em>.</>}
        lede="Dentro de cada computadora hay millones de interruptores microscópicos. Cada uno está encendido (1) o apagado (0). Con solo esas dos posibilidades, podemos representar cualquier número, cualquier letra, cualquier imagen. Esto es el sistema binario."
      >
        <div className="intro-chips">
          <span className="pill on">0 = apagado</span>
          <span className="pill warm">1 = encendido</span>
          <span className="pill">8 bits = 1 byte</span>
        </div>
      </ModuleHeader>

      <Card>
        <h2>Haz clic en los interruptores</h2>
        <p style={{ marginTop: 0 }}>
          Cada columna tiene un <b>valor</b>. Si el interruptor está encendido, ese valor cuenta. Si está apagado, no.
          Suma los valores de los que están encendidos y tendrás el número decimal equivalente.
        </p>

        <div className="bit-row">
          {bits.map((b, i) => (
            <div key={i} className="bit">
              <div className="bit-weight">2<sup>{7 - i}</sup>=<b>{powers[i]}</b></div>
              <button
                className={'bit-switch ' + (b ? 'on' : '')}
                onClick={() => flip(i)}
                aria-label={`Bit ${7 - i}`}
              >
                <span className="label">{b}</span>
              </button>
            </div>
          ))}
        </div>

        <div className="display-decimal">
          <div className="d-label">Valor decimal</div>
          <div className="d-val">{decimal}</div>
          <div className="d-expr">
            {parts.length === 0 ? (
              <span>todos apagados → 0</span>
            ) : (
              <>{parts.map((p, i) => (
                <React.Fragment key={i}>
                  <b>{p}</b>{i < parts.length - 1 ? ' + ' : ''}
                </React.Fragment>
              ))} = <b>{decimal}</b></>
            )}
          </div>
          <div style={{ marginTop: 14 }}>
            <span className="pill on mono">binario · {bits.join('')}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3>Experimenta</h3>
        <h2 style={{ marginTop: -6 }}>Prueba a formar estos números</h2>
        <div className="grid-3" style={{ marginTop: 18 }}>
          {[7, 42, 170, 255, 100, 1].map(target => (
            <button key={target} className="btn ghost" onClick={() => {
              const b = toBin(target, 8).split('').map(Number);
              setBits(b);
            }}>→ formar {target}</button>
          ))}
        </div>
        <div className="callout" style={{ marginTop: 20 }}>
          <b>Observa:</b> con 8 bits el valor máximo es <span className="mono">11111111 = 255</span>.
          Por eso los colores y muchos valores en informática van de <b>0 a 255</b>: caben justo en 1 byte.
        </div>
      </Card>

      <div className="module-footer">
        <span className="pill">Módulo 1 de 8</span>
        <button className="btn" onClick={onAdvance}>Siguiente: convertir →</button>
      </div>
    </>
  );
}

/* ═══════════════ MÓDULO 2 — Decimal ↔ Binario ═══════════════ */
function ModuleConvert({ onAdvance }) {
  const [n, setN] = useState(156);
  const [userBin, setUserBin] = useState('');
  const [check, setCheck] = useState(null);

  // Compute division steps (decimal → binario)
  const steps = useMemo(() => {
    const arr = [];
    let x = n;
    if (x === 0) return [{ n: 0, q: 0, r: 0 }];
    while (x > 0) {
      arr.push({ n: x, q: Math.floor(x / 2), r: x % 2 });
      x = Math.floor(x / 2);
    }
    return arr;
  }, [n]);
  const bin = toBin(n, 8);

  const check2 = () => {
    if (userBin.replace(/\s/g, '') === toBin(n, 8).replace(/^0+/, '') || fromBin(userBin) === n) {
      setCheck('ok');
    } else {
      setCheck('bad');
    }
  };

  return (
    <>
      <ModuleHeader
        eyebrow="Módulo 02 · Conversión"
        title={<>De decimal a binario, <em>dividiendo entre 2</em>.</>}
        lede="Para convertir un número decimal a binario, dividimos entre 2 repetidamente y apuntamos los restos. Leídos de abajo hacia arriba, son la representación binaria."
      />

      <Card>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <h3>Número decimal</h3>
            <input type="number" className="input" value={n} min={0} max={255}
                   onChange={e => setN(Math.max(0, Math.min(255, +e.target.value || 0)))} />
            <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[3, 25, 99, 128, 200, 255].map(v => (
                <button key={v} className="pill" style={{ cursor: 'pointer' }}
                        onClick={() => setN(v)}>{v}</button>
              ))}
            </div>

            <h3 style={{ marginTop: 28 }}>Resultado</h3>
            <div className="huge-n" style={{ fontSize: 56, color: 'var(--on)' }}>{bin}</div>
            <div className="mono" style={{ color: 'var(--ink-3)', marginTop: 6 }}>
              {n} → <b style={{ color: 'var(--ink)' }}>{bin}</b>
            </div>
          </div>

          <div>
            <h3>División sucesiva entre 2</h3>
            <table className="btable">
              <thead>
                <tr><th>÷ 2</th><th>Cociente</th><th>Resto</th></tr>
              </thead>
              <tbody>
                {steps.map((s, i) => (
                  <tr key={i}>
                    <td>{s.n} ÷ 2</td>
                    <td>{s.q}</td>
                    <td><b>{s.r}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="callout" style={{ marginTop: 18 }}>
              Lee los restos <b>de abajo hacia arriba</b>:
              <div className="mono" style={{ marginTop: 6, fontSize: 16, color: 'var(--ink)' }}>
                {steps.map(s => s.r).reverse().join('')}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3>Camino inverso · suma de potencias</h3>
        <h2 style={{ marginTop: -6 }}>De binario a decimal</h2>
        <p style={{ marginTop: 0 }}>
          Multiplica cada bit por su potencia de 2 y súmalos.
        </p>
        <table className="btable" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Posición</th>
              {powers.map((p, i) => <th key={i}>{7 - i}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Peso 2ⁿ</td>
              {powers.map((p, i) => <td key={i}>{p}</td>)}
            </tr>
            <tr>
              <td>Bit</td>
              {bin.split('').map((b, i) => <td key={i} style={{ color: b === '1' ? 'var(--on)' : 'var(--ink-3)' }}><b style={{ color: 'inherit' }}>{b}</b></td>)}
            </tr>
            <tr>
              <td>Suma</td>
              {bin.split('').map((b, i) => <td key={i}>{b === '1' ? powers[i] : '—'}</td>)}
            </tr>
          </tbody>
        </table>
        <div className="mono" style={{ marginTop: 16, fontSize: 15 }}>
          {bin.split('').map((b, i) => b === '1' ? powers[i] : null).filter(Boolean).join(' + ') || '0'}
          {' = '}<b style={{ color: 'var(--on)' }}>{n}</b>
        </div>
      </Card>

      <Card>
        <h3>Practica</h3>
        <h2 style={{ marginTop: -6 }}>Convierte {n} a binario y escríbelo</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 8 }}>
          <input className="input" style={{ maxWidth: 260 }} value={userBin}
                 placeholder="ej. 10011100"
                 onChange={e => { setUserBin(e.target.value.replace(/[^01]/g, '')); setCheck(null); }} />
          <button className="btn" onClick={check2}>Comprobar</button>
          {check === 'ok' && <span className="feedback ok">✓ ¡Correcto!</span>}
          {check === 'bad' && <span className="feedback bad">✕ Revisa. La respuesta es {bin}</span>}
        </div>
      </Card>

      <div className="module-footer">
        <button className="btn ghost" onClick={() => window.__goto(0)}>← anterior</button>
        <button className="btn" onClick={onAdvance}>Siguiente: texto ASCII →</button>
      </div>
    </>
  );
}

/* ═══════════════ MÓDULO 3 — ASCII ═══════════════ */
function ModuleAscii({ onAdvance }) {
  const [text, setText] = useState('Hola');
  const chars = [...text].map(c => ({ c, code: c.charCodeAt(0) }));

  const [challenge] = useState({
    bin: '01001000 01101001',
    answer: 'Hi'
  });
  const [guess, setGuess] = useState('');
  const [res, setRes] = useState(null);

  return (
    <>
      <ModuleHeader
        eyebrow="Módulo 03 · Texto"
        title={<>Cada letra es <em>un número</em>, y cada número es binario.</>}
        lede="Las computadoras usan una tabla llamada ASCII para asignar un número a cada letra, signo o símbolo. Y como vimos, cualquier número puede escribirse en binario. Así es como tu teléfono envía un mensaje: como una larga cadena de ceros y unos."
      />

      <Card>
        <h3>Escribe y observa</h3>
        <input className="input" value={text} onChange={e => setText(e.target.value.slice(0, 12))}
               placeholder="Escribe hasta 12 caracteres" />
        <div className="ascii-stream">
          {chars.map((x, i) => (
            <div key={i} className="ascii-char fade-in">
              <div className="ch">{x.c === ' ' ? '␣' : x.c}</div>
              <div className="dec">{x.code}</div>
              <div className="bin">{toBin(x.code, 8)}</div>
            </div>
          ))}
        </div>
        {chars.length > 0 && (
          <div className="callout" style={{ marginTop: 20 }}>
            La palabra <b>"{text}"</b> son {chars.length} caracteres × 8 bits = <b>{chars.length * 8} bits</b> ({chars.length} bytes).
            En binario "puro" se vería así:
            <div className="mono" style={{ marginTop: 8, fontSize: 13, color: 'var(--on)', wordBreak: 'break-all' }}>
              {chars.map(x => toBin(x.code, 8)).join(' ')}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div className="grid-2">
          <div>
            <h3>Referencia rápida</h3>
            <h2 style={{ marginTop: -6 }}>ASCII esenciales</h2>
            <table className="btable">
              <thead><tr><th>Carácter</th><th>Decimal</th><th>Binario</th></tr></thead>
              <tbody>
                {['A', 'B', 'a', 'b', '0', '1', '!', ' '].map(c => (
                  <tr key={c}>
                    <td style={{ fontSize: 16 }}>{c === ' ' ? '␣ (espacio)' : c}</td>
                    <td>{c.charCodeAt(0)}</td>
                    <td><b>{toBin(c.charCodeAt(0), 8)}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3>Reto</h3>
            <h2 style={{ marginTop: -6 }}>Decodifica este mensaje</h2>
            <div className="mono" style={{ fontSize: 18, color: 'var(--on)', background: 'var(--bg-2)', padding: 16, borderRadius: 10, letterSpacing: '0.08em' }}>
              {challenge.bin}
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>
              Pista: convierte cada byte a decimal y busca la letra ASCII.
              <br/>H = 72, i = 105, espacio = 32…
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <input className="input" style={{ fontSize: 16 }} value={guess}
                     onChange={e => { setGuess(e.target.value); setRes(null); }}
                     placeholder="Escribe el mensaje" />
              <button className="btn" onClick={() => setRes(guess.trim() === challenge.answer ? 'ok' : 'bad')}>
                Verificar
              </button>
            </div>
            {res === 'ok' && <div className="feedback ok" style={{ marginTop: 12 }}>✓ ¡Lo lograste! El mensaje era "{challenge.answer}"</div>}
            {res === 'bad' && <div className="feedback bad" style={{ marginTop: 12 }}>Aún no. Revisa los bytes uno a uno.</div>}
          </div>
        </div>
      </Card>

      <div className="module-footer">
        <button className="btn ghost" onClick={() => window.__goto(1)}>← anterior</button>
        <button className="btn" onClick={onAdvance}>Siguiente: píxeles →</button>
      </div>
    </>
  );
}

/* ═══════════════ MÓDULO 4 — 1-bit pixels ═══════════════ */
function Module1Bit({ onAdvance }) {
  const SIZE = 8;
  const [grid, setGrid] = useState(() => {
    // Inicializa con una cara sonriente
    const smile = [
      '00111100',
      '01000010',
      '10100101',
      '10000001',
      '10100101',
      '10011001',
      '01000010',
      '00111100',
    ];
    return smile.map(r => r.split('').map(Number));
  });
  const paintingRef = useRef(null);

  const toggle = (r, c) => {
    setGrid(g => g.map((row, i) => row.map((v, j) =>
      (i === r && j === c) ? (v ? 0 : 1) : v)));
  };

  const onDown = (r, c) => {
    const target = grid[r][c] ? 0 : 1;
    paintingRef.current = target;
    toggle(r, c);
  };
  const onEnter = (r, c) => {
    if (paintingRef.current === null) return;
    if (grid[r][c] !== paintingRef.current) toggle(r, c);
  };

  useEffect(() => {
    const up = () => { paintingRef.current = null; };
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, []);

  return (
    <>
      <ModuleHeader
        eyebrow="Módulo 04 · Imagen"
        title={<>Una imagen es, también, <em>ceros y unos</em>.</>}
        lede="La forma más simple de imagen: cada píxel es blanco (0) o negro (1). Una imagen de 8×8 píxeles se guarda como solo 8 bytes. Dibuja arrastrando el mouse."
      />

      <Card>
        <div className="sketch-wrap">
          <div>
            <h3>Lienzo · arrastra para pintar</h3>
            <div
              className="pixel-grid"
              style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, maxWidth: 420, aspectRatio: 1 }}
              onMouseLeave={() => { paintingRef.current = null; }}
              onTouchMove={(e) => {
                e.preventDefault();
                const t = e.touches[0];
                const el = document.elementFromPoint(t.clientX, t.clientY);
                if (el?.dataset.r !== undefined) onEnter(+el.dataset.r, +el.dataset.c);
              }}
            >
              {grid.map((row, r) => row.map((v, c) => (
                <div key={`${r}-${c}`}
                     className={'pixel' + (v ? ' on' : '')}
                     data-r={r} data-c={c}
                     onMouseDown={() => onDown(r, c)}
                     onMouseEnter={() => onEnter(r, c)}
                     onTouchStart={() => onDown(r, c)}
                />
              )))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="btn ghost small" onClick={() => setGrid(Array(SIZE).fill().map(() => Array(SIZE).fill(0)))}>Borrar</button>
              <button className="btn ghost small" onClick={() => setGrid(Array(SIZE).fill().map(() => Array(SIZE).fill(1)))}>Todo negro</button>
              <button className="btn ghost small" onClick={() => setGrid(g => g.map(r => r.map(v => v ? 0 : 1)))}>Invertir</button>
            </div>
          </div>

          <div>
            <h3>Datos binarios</h3>
            <div className="bit-rows" style={{ marginBottom: 16 }}>
              {grid.map((row, i) => (
                <div className="br" key={i}>
                  <span className="idx">{i}</span>
                  <b>{row.join('')}</b>
                </div>
              ))}
            </div>
            <dl className="kv">
              <dt>Ancho</dt><dd>{SIZE} px</dd>
              <dt>Alto</dt><dd>{SIZE} px</dd>
              <dt>Bits por píxel</dt><dd>1</dd>
              <dt>Total</dt><dd><b>{SIZE * SIZE} bits</b> = {SIZE} bytes</dd>
            </dl>
            <div className="callout" style={{ marginTop: 18 }}>
              <b>Toda</b> la imagen cabe en 8 bytes. El mismo espacio que ocupa la palabra <span className="mono">"Hola :)"</span> en ASCII.
            </div>
          </div>
        </div>
      </Card>

      <div className="module-footer">
        <button className="btn ghost" onClick={() => window.__goto(2)}>← anterior</button>
        <button className="btn" onClick={onAdvance}>Siguiente: escala de grises →</button>
      </div>
    </>
  );
}

/* ═══════════════ MÓDULO 5 — Escala de grises ═══════════════ */
function ModuleGrayscale({ onAdvance }) {
  const [val, setVal] = useState(140);
  const SIZE = 6;
  const [grid, setGrid] = useState(() => {
    // gradient
    return Array(SIZE).fill().map((_, r) =>
      Array(SIZE).fill().map((_, c) => Math.floor(((r * SIZE + c) / (SIZE * SIZE - 1)) * 255))
    );
  });
  const [selected, setSelected] = useState([0, 0]);

  const setPixel = (r, c, v) => {
    setGrid(g => g.map((row, i) => row.map((x, j) =>
      (i === r && j === c) ? v : x)));
  };

  const selectedVal = grid[selected[0]][selected[1]];

  return (
    <>
      <ModuleHeader
        eyebrow="Módulo 05 · Escala de grises"
        title={<>Con 8 bits, <em>256 tonos</em> entre el blanco y el negro.</>}
        lede="Si usamos 8 bits por píxel en vez de 1, cada píxel puede tomar un valor de 0 (negro puro) a 255 (blanco puro). Eso nos da 256 niveles de gris — suficiente para que el ojo humano no note los saltos."
      />

      <Card>
        <h3>Un píxel · un byte</h3>
        <h2 style={{ marginTop: -6 }}>Ajusta el brillo de un solo píxel</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, alignItems: 'center', marginTop: 16 }}>
          <div className="swatch-big" style={{ background: `rgb(${val},${val},${val})` }}></div>
          <div>
            <input type="range" min="0" max="255" value={val}
                   onChange={e => setVal(+e.target.value)}
                   style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <div>
                <div className="eyebrow">Decimal</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 40, fontWeight: 600 }}>{val}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="eyebrow">Binario (1 byte)</div>
                <div className="mono" style={{ fontSize: 24, color: 'var(--on)', letterSpacing: '0.1em', marginTop: 4 }}>
                  {toBin(val, 8)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3>Mini-bitmap · 6×6</h3>
        <h2 style={{ marginTop: -6 }}>Haz clic en un píxel para editarlo</h2>
        <div className="grid-2" style={{ alignItems: 'start', marginTop: 14 }}>
          <div>
            <div className="pixel-grid no-gap"
                 style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, maxWidth: 360, aspectRatio: 1 }}>
              {grid.map((row, r) => row.map((v, c) => (
                <div key={`${r}-${c}`}
                     className="pixel"
                     style={{
                       background: `rgb(${v},${v},${v})`,
                       outline: selected[0] === r && selected[1] === c ? '2px solid var(--on)' : 'none',
                       outlineOffset: '-2px',
                       cursor: 'pointer'
                     }}
                     onClick={() => setSelected([r, c])}
                />
              )))}
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="eyebrow">Píxel seleccionado · fila {selected[0]}, col {selected[1]}</div>
              <input type="range" min="0" max="255" value={selectedVal}
                     onChange={e => setPixel(selected[0], selected[1], +e.target.value)}
                     style={{ width: '100%', marginTop: 10 }} />
            </div>
          </div>
          <div>
            <div className="eyebrow">Valor del píxel</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 64, fontWeight: 600, lineHeight: 1, marginTop: 4 }}>
              {selectedVal}
            </div>
            <div className="mono" style={{ fontSize: 20, color: 'var(--on)', marginTop: 4, letterSpacing: '0.1em' }}>
              {toBin(selectedVal, 8)}
            </div>

            <div className="callout" style={{ marginTop: 22 }}>
              Este mini-bitmap de 6×6 ocupa <b>{SIZE * SIZE} bytes</b> = {SIZE * SIZE * 8} bits.
              <br />Una foto real de 1920×1080 en grises ocuparía {(1920 * 1080).toLocaleString('es')} bytes ≈ <b>2 MB</b>.
            </div>

            <h3 style={{ marginTop: 24 }}>Todos los bytes</h3>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.6 }}>
              {grid.map((row, r) => (
                <div key={r}>
                  {row.map(v => toBin(v, 8)).join(' ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="module-footer">
        <button className="btn ghost" onClick={() => window.__goto(3)}>← anterior</button>
        <button className="btn" onClick={onAdvance}>Siguiente: RGB →</button>
      </div>
    </>
  );
}

/* ═══════════════ MÓDULO 6 — RGB ═══════════════ */
function ModuleRGB({ onAdvance }) {
  const [r, setR] = useState(220);
  const [g, setG] = useState(90);
  const [b, setB] = useState(40);

  const rgbHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();

  return (
    <>
      <ModuleHeader
        eyebrow="Módulo 06 · Color"
        title={<>Tres canales de 8 bits, <em>16.7 millones de colores</em>.</>}
        lede="Un píxel a color combina tres canales: rojo, verde y azul. Cada canal usa 1 byte (0–255). Juntos forman 3 bytes = 24 bits por píxel, y permiten 2²⁴ = 16.777.216 colores distintos."
      />

      <Card>
        <div className="grid-2" style={{ alignItems: 'center' }}>
          <div>
            <div className="swatch-big" style={{ background: `rgb(${r},${g},${b})`, maxWidth: 360 }}></div>
            <div style={{ marginTop: 16 }}>
              <div className="eyebrow">Color resultante</div>
              <div className="mono" style={{ fontSize: 22, marginTop: 4 }}>
                rgb({r}, {g}, {b})
              </div>
              <div className="mono" style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 4 }}>
                #{rgbHex(r)}{rgbHex(g)}{rgbHex(b)}
              </div>
            </div>
          </div>

          <div>
            <h3>Controla cada canal</h3>
            {[
              { k: 'R', val: r, set: setR, cls: 'r' },
              { k: 'G', val: g, set: setG, cls: 'g' },
              { k: 'B', val: b, set: setB, cls: 'b' },
            ].map(ch => (
              <div key={ch.k} className={`rgb-channel ${ch.cls}`}>
                <div className="name">{ch.k}={ch.val}</div>
                <input type="range" min="0" max="255" value={ch.val}
                       onChange={e => ch.set(+e.target.value)} />
                <div className="bin-val">{toBin(ch.val, 8)}</div>
              </div>
            ))}

            <div className="callout" style={{ marginTop: 18 }}>
              <b>Binario completo de este píxel (24 bits):</b>
              <div className="mono" style={{ marginTop: 6, fontSize: 14, color: 'var(--on)', letterSpacing: '0.04em' }}>
                {toBin(r, 8)} {toBin(g, 8)} {toBin(b, 8)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3>Combinaciones famosas</h3>
        <h2 style={{ marginTop: -6 }}>¿Qué pasa en los extremos?</h2>
        <div className="grid-3" style={{ marginTop: 14 }}>
          {[
            { n: 'Negro', r: 0, g: 0, b: 0 },
            { n: 'Blanco', r: 255, g: 255, b: 255 },
            { n: 'Rojo puro', r: 255, g: 0, b: 0 },
            { n: 'Verde puro', r: 0, g: 255, b: 0 },
            { n: 'Azul puro', r: 0, g: 0, b: 255 },
            { n: 'Amarillo', r: 255, g: 255, b: 0 },
          ].map(c => (
            <button key={c.n} className="card" style={{ padding: 14, textAlign: 'left', cursor: 'pointer', border: '1px solid var(--line)' }}
                    onClick={() => { setR(c.r); setG(c.g); setB(c.b); }}>
              <div style={{ width: '100%', aspectRatio: 2, background: `rgb(${c.r},${c.g},${c.b})`, borderRadius: 8, border: '1px solid var(--line)' }}></div>
              <div style={{ marginTop: 10, fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15 }}>{c.n}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                {toBin(c.r, 8)} · {toBin(c.g, 8)} · {toBin(c.b, 8)}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div className="module-footer">
        <button className="btn ghost" onClick={() => window.__goto(4)}>← anterior</button>
        <button className="btn" onClick={onAdvance}>Siguiente: pixel-art →</button>
      </div>
    </>
  );
}

/* ═══════════════ MÓDULO 7 — Pixel art creativo ═══════════════ */
function ModulePixelArt({ onAdvance }) {
  const SIZE = 12;
  const palette = [
    { k: '0', c: '#faf7f2' },
    { k: '1', c: '#121417' },
    { k: '2', c: '#e94f37' },
    { k: '3', c: '#f2b134' },
    { k: '4', c: '#5ca96b' },
    { k: '5', c: '#3a7dcb' },
    { k: '6', c: '#c75fbd' },
    { k: '7', c: '#ffffff' },
  ];
  const [grid, setGrid] = useState(() =>
    Array(SIZE).fill().map(() => Array(SIZE).fill(0)));
  const [idx, setIdx] = useState(1);
  const paintingRef = useRef(null);

  const paint = (r, c) => {
    setGrid(g => g.map((row, i) => row.map((v, j) =>
      (i === r && j === c) ? idx : v)));
  };
  const onDown = (r, c) => { paintingRef.current = idx; paint(r, c); };
  const onEnter = (r, c) => { if (paintingRef.current !== null) paint(r, c); };

  useEffect(() => {
    const up = () => { paintingRef.current = null; };
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, []);

  // With 8 colors, we need 3 bits per pixel
  const bitsPerPx = 3;
  const totalBits = SIZE * SIZE * bitsPerPx;

  return (
    <>
      <ModuleHeader
        eyebrow="Módulo 07 · Crear"
        title={<>Crea tu propio <em>pixel-art</em>.</>}
        lede="Con 8 colores en la paleta, cada píxel necesita 3 bits (2³ = 8). Vas a ver en vivo cuántos bits pesa tu dibujo."
      />

      <Card>
        <div className="sketch-wrap">
          <div>
            <h3>Lienzo · 12×12</h3>
            <div
              className="pixel-grid no-gap"
              style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, maxWidth: 480, aspectRatio: 1 }}
              onTouchMove={(e) => {
                e.preventDefault();
                const t = e.touches[0];
                const el = document.elementFromPoint(t.clientX, t.clientY);
                if (el?.dataset.r !== undefined) onEnter(+el.dataset.r, +el.dataset.c);
              }}
            >
              {grid.map((row, r) => row.map((v, c) => (
                <div key={`${r}-${c}`}
                     className="pixel"
                     data-r={r} data-c={c}
                     style={{ background: palette[v].c, cursor: 'pointer' }}
                     onMouseDown={() => onDown(r, c)}
                     onMouseEnter={() => onEnter(r, c)}
                     onTouchStart={() => onDown(r, c)}
                />
              )))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="btn ghost small"
                      onClick={() => setGrid(Array(SIZE).fill().map(() => Array(SIZE).fill(0)))}>
                Borrar todo
              </button>
              <button className="btn ghost small" onClick={() => {
                // heart preset
                const h = [
                  '000000000000',
                  '002200002200',
                  '022220022220',
                  '022222222220',
                  '022222222220',
                  '022222222220',
                  '002222222200',
                  '000222222000',
                  '000022220000',
                  '000002200000',
                  '000000000000',
                  '000000000000',
                ];
                setGrid(h.map(r => r.split('').map(Number)));
              }}>♥ plantilla</button>
            </div>
          </div>

          <div>
            <h3>Paleta · 8 colores (3 bits)</h3>
            <div className="palette" style={{ marginBottom: 32 }}>
              {palette.map((p, i) => (
                <div key={i}
                     className={'pal-swatch' + (idx === i ? ' active' : '')}
                     style={{ background: p.c }}
                     onClick={() => setIdx(i)}
                >
                  <div className="k">{toBin(i, 3)}</div>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: 16 }}>Tu archivo</h3>
            <dl className="kv">
              <dt>Ancho</dt><dd>{SIZE} px</dd>
              <dt>Alto</dt><dd>{SIZE} px</dd>
              <dt>Paleta</dt><dd>8 colores</dd>
              <dt>Bits/píxel</dt><dd>{bitsPerPx} bits</dd>
              <dt>Total</dt><dd><b>{totalBits} bits</b> ({Math.ceil(totalBits / 8)} bytes)</dd>
            </dl>

            <div className="callout" style={{ marginTop: 18 }}>
              <b>Binario de las primeras 2 filas:</b>
              <div className="mono" style={{ fontSize: 11, marginTop: 6, wordBreak: 'break-all', lineHeight: 1.5 }}>
                {grid.slice(0, 2).map((row, i) => (
                  <div key={i}>{row.map(v => toBin(v, 3)).join(' ')}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="module-footer">
        <button className="btn ghost" onClick={() => window.__goto(5)}>← anterior</button>
        <button className="btn" onClick={onAdvance}>Siguiente: reto final →</button>
      </div>
    </>
  );
}

/* ═══════════════ MÓDULO 8 — Reto final ═══════════════ */
function ModuleChallenge() {
  // El mensaje oculto: el dibujo es una llave (key)
  const hidden = [
    '00011000',
    '00111100',
    '00100100',
    '00111100',
    '00011000',
    '00011000',
    '00011100',
    '00011000',
  ];

  const [inputs, setInputs] = useState(Array(8).fill(''));
  const [revealed, setRevealed] = useState(false);
  const correct = inputs.every((v, i) => v === hidden[i]);

  // Step 2: Message decoding
  const secret = 'SI PUEDES';
  const secretBin = [...secret].map(c => toBin(c.charCodeAt(0), 8)).join(' ');
  const [msgGuess, setMsgGuess] = useState('');
  const [msgRes, setMsgRes] = useState(null);

  return (
    <>
      <ModuleHeader
        eyebrow="Módulo 08 · Reto final"
        title={<>Pon a prueba lo aprendido.</>}
        lede="Dos retos: primero decodifica una imagen oculta escribiendo sus 8 filas binarias. Luego, descifra un mensaje de texto. Si completas ambos, dominas el binario."
      />

      <Card>
        <div className="split-label">
          <h2 style={{ margin: 0 }}>Reto 1 · Imagen oculta</h2>
          <span className="hint">8 filas × 8 bits</span>
        </div>
        <p style={{ marginTop: 0 }}>
          Cada fila son 8 píxeles. Escribe los bits que quieras y verás el dibujo aparecer en tiempo real.
          Tu objetivo: descubrir la figura que está <b>escondida</b> en este código y recrearla.
        </p>

        <div className="grid-2" style={{ alignItems: 'start', marginTop: 18 }}>
          <div>
            <h3>Escribe las 8 filas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {inputs.map((v, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="mono" style={{ color: 'var(--ink-3)', width: 14 }}>{i}</span>
                  <input
                    className="input"
                    style={{ fontSize: 18, padding: '10px 14px', letterSpacing: '0.2em' }}
                    maxLength={8}
                    value={v}
                    onChange={e => {
                      const val = e.target.value.replace(/[^01]/g, '').slice(0, 8);
                      setInputs(inputs.map((x, j) => j === i ? val : x));
                    }}
                    placeholder="00000000"
                  />
                  {v === hidden[i] && <span className="pill mint">✓</span>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn ghost" onClick={() => setRevealed(r => !r)}>
                {revealed ? 'Ocultar' : 'Ver'} solución
              </button>
              <button className="btn ghost" onClick={() => setInputs(Array(8).fill(''))}>Reiniciar</button>
            </div>
          </div>

          <div>
            <h3>Tu dibujo</h3>
            <div className="pixel-grid"
                 style={{ gridTemplateColumns: 'repeat(8, 1fr)', maxWidth: 280, aspectRatio: 1 }}>
              {Array(8).fill().map((_, r) =>
                Array(8).fill().map((_, c) => {
                  const bit = (inputs[r] && inputs[r][c]) === '1';
                  return <div key={`${r}-${c}`} className={'pixel' + (bit ? ' on' : '')} />;
                })
              )}
            </div>

            {revealed && (
              <>
                <h3 style={{ marginTop: 20 }}>Solución · Una llave 🔑</h3>
                <div className="pixel-grid"
                     style={{ gridTemplateColumns: 'repeat(8, 1fr)', maxWidth: 200, aspectRatio: 1, opacity: 0.6 }}>
                  {hidden.map((row, r) => row.split('').map((b, c) => (
                    <div key={`${r}-${c}`} className={'pixel' + (b === '1' ? ' on' : '')} />
                  )))}
                </div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 12, lineHeight: 1.6 }}>
                  {hidden.map((r, i) => <div key={i}>{r}</div>)}
                </div>
              </>
            )}

            {correct && !revealed && (
              <div className="feedback ok" style={{ marginTop: 14 }}>
                ✓ ¡Perfecto! Dibujaste la llave.
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="split-label">
          <h2 style={{ margin: 0 }}>Reto 2 · Mensaje oculto</h2>
          <span className="hint">ASCII de 8 bits</span>
        </div>
        <p style={{ marginTop: 0 }}>
          Convierte este binario a texto. Cada byte (8 bits) es una letra en ASCII. Recuerda que el espacio es el número 32.
        </p>
        <div className="mono" style={{
          fontSize: 14, color: 'var(--on)', background: 'var(--bg-2)',
          padding: 16, borderRadius: 10, letterSpacing: '0.06em', lineHeight: 1.7,
          wordBreak: 'break-all'
        }}>
          {secretBin}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <input className="input" value={msgGuess}
                 onChange={e => { setMsgGuess(e.target.value.toUpperCase()); setMsgRes(null); }}
                 placeholder="Tu respuesta aquí" style={{ fontSize: 18 }} />
          <button className="btn" onClick={() => setMsgRes(msgGuess.trim() === secret ? 'ok' : 'bad')}>
            Verificar
          </button>
        </div>
        {msgRes === 'ok' && (
          <div className="feedback ok" style={{ marginTop: 14 }}>
            ✓ ¡Correcto! El mensaje era <b>"{secret}"</b>. Ya dominas la conversión ASCII↔binario.
          </div>
        )}
        {msgRes === 'bad' && (
          <div className="feedback bad" style={{ marginTop: 14 }}>
            Todavía no. Convierte cada byte a decimal y busca la letra.
          </div>
        )}
      </Card>

      <Card style={{ background: 'var(--ink)', color: 'var(--bg)', borderColor: 'var(--ink)' }}>
        <h3 style={{ color: 'var(--bg-2)' }}>Al cerrar</h3>
        <h2 style={{ color: 'white', marginTop: -6 }}>Lo que aprendiste hoy</h2>
        <ul style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--bg-2)', paddingLeft: 20 }}>
          <li>El sistema binario usa solo <b style={{ color: 'white' }}>dos símbolos</b>: 0 y 1.</li>
          <li>Cada bit representa una potencia de 2. Sumándolas obtienes cualquier número.</li>
          <li>Las letras son números (ASCII) y los números son binarios.</li>
          <li>Una imagen es una rejilla de píxeles, y cada píxel es un número.</li>
          <li>Con <b style={{ color: 'white' }}>3 bytes por píxel</b> (RGB) se describen millones de colores.</li>
        </ul>
      </Card>

      <div className="module-footer">
        <button className="btn ghost" onClick={() => window.__goto(6)}>← anterior</button>
        <button className="btn" onClick={() => window.__goto(0)}>↻ volver al inicio</button>
      </div>
    </>
  );
}

// Export
Object.assign(window, {
  ModuleIntro, ModuleConvert, ModuleAscii, Module1Bit,
  ModuleGrayscale, ModuleRGB, ModulePixelArt, ModuleChallenge,
});
