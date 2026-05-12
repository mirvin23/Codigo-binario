# Código Binario — Clase interactiva

Aplicación web educativa de 8 módulos para aprender el sistema binario desde cero. Diseñada para alumnos de 7mo grado en la materia Tecnología.

**→ [Ver la app en vivo](#)** *(reemplazá con tu URL de GitHub Pages o Netlify)*

---

## Módulos

| # | Módulo | Contenido |
|---|--------|-----------|
| 01 | El binario | Interruptores de bits, suma de potencias de 2 |
| 02 | Decimal ↔ Binario | Conversión por divisiones sucesivas y suma de pesos |
| 03 | Texto · ASCII | Codificación de letras a números y a binario |
| 04 | Píxeles 1-bit | Dibujo en grilla 8×8, imagen como bytes |
| 05 | Escala de grises | 256 tonos con 1 byte por píxel |
| 06 | Color RGB | Tres canales de 8 bits, 16.7 millones de colores |
| 07 | Pixel-art | Lienzo creativo 12×12 con paleta de 8 colores (3 bits) |
| 08 | Reto final | Decodificar imagen oculta + mensaje ASCII cifrado |

## Características

- Navegación lateral con progreso guardado en `localStorage`
- Interactores en tiempo real: switches de bits, grillas de píxeles arrastrables, sliders RGB
- Drag-painting con mouse y táctil (touch)
- Versión imprimible (`Codigo Binario-print.html`)
- Sin dependencias de build — solo HTML, CSS y JSX transpilado en el browser

## Tecnologías

- **React 18.3.1** (production build, via CDN)
- **Babel Standalone 7.29.0** (transpilación JSX en browser)
- CSS puro con variables, Grid, Flexbox y OKLCH
- Google Fonts: Inter, JetBrains Mono, Space Grotesk

## Uso local

Simplemente abrí `index.html` en el browser. Requiere conexión a internet para cargar React y las tipografías desde CDN.

Para usarla **sin internet**, abrí `Codigo Binario - Standalone.html` — tiene todo inlinado en un solo archivo.

## Deploy

### GitHub Pages

```bash
git init
git add .
git commit -m "inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

En el repo: **Settings → Pages → Source: `main` / `/ (root)`** → Guardar.

### Netlify

Arrastrá la carpeta al dashboard en [netlify.com/drop](https://app.netlify.com/drop).

## Archivos

```
index.html                      ← Entrada principal (producción)
app.jsx                         ← Componente App y navegación
modules.jsx                     ← Los 8 módulos pedagógicos
styles.css                      ← Sistema de diseño
Codigo Binario-print.html       ← Versión imprimible
app-print.jsx                   ← App de impresión
styles-print.css                ← Estilos de impresión
Codigo Binario - Standalone.html ← Versión sin dependencias externas
.nojekyll                       ← Desactiva Jekyll en GitHub Pages
```

---

**Prof. Erwin Cortez** · Tecnología · 7mo grado · 2026  
[profe.erwin.cortez@gmail.com](mailto:profe.erwin.cortez@gmail.com)
