# Anticipación El Niño · Gestión de riesgo y acción comunitaria

Plataforma web para la prevención de desastres asociados al Fenómeno El Niño en el Perú.
Cubre las **25 regiones** (departamento → provincia → distrito, con UBIGEO INEI) y cruza
**lluvia pronosticada en tiempo real** con la vulnerabilidad territorial para emitir
avisos de riesgo y **acciones preventivas** para la comunidad.

> Herramienta de **gestión de riesgo**, no una app meteorológica.
> Umbrales y acciones son criterios de esta herramienta y **no sustituyen** los
> comunicados oficiales de ENFEN, SENAMHI, CENEPRED o INDECI.

## Estructura del proyecto (modular)

```
FENOMENO-DEL-N-O/
├── index.html              # Punto de entrada ligero (carga módulos)
├── css/
│   └── styles.css          # Estilos (diseño aprobado, responsive)
├── js/
│   ├── app.js              # Orquestador principal
│   ├── map.js              # Mapa base y capas
│   ├── search.js           # Búsqueda jerárquica (árbol INEI)
│   ├── weather.js          # Lluvia en vivo (results + fallback localStorage)
│   ├── oni.js              # Estado El Niño (honesto: en vivo vs referencia)
│   ├── alerts.js           # Panel de alertas
│   └── ui.js               # Panel lateral y tarjetas
├── data/                   # Datos territoriales INEI (con UBIGEO)
│   ├── departamentos.js    # 25 departamentos
│   ├── provincias.js       # 197 provincias
│   ├── distritos.js        # 1834 distritos
│   ├── centros_poblados.js # pendiente dato oficial (vacío)
│   └── caserios.js         # pendiente dato oficial (vacío)
├── geo/
│   └── departamentos.geojson  # Capa territorial (24 deptos + Callao)
├── docs/
│   └── README.md           # Documentación de arquitectura
├── .gitignore
└── antecedentes-historicos-el-nino-peru.md  # Contexto histórico
```

## Funcionalidades

- **Estado del fenómeno El Niño (ONI/NOAA):** fase actual con lectura en vivo (proxy) y
  respaldo a valor documentado, etiquetado con claridad (en vivo vs referencia).
- **Riesgo por lluvia en vivo:** pronóstico 72 h (Open-Meteo) por región, con niveles
  escalonados (verde / naranja / rojo). Procesa respuesta `results` de la API y usa
  `localStorage` como fallback si falla.
- **Búsqueda jerárquica:** departamento → provincia → distrito (árbol INEI), con UBIGEO.
- **Mapa a pantalla completa** (`100dvh`) estilo Google Maps, base CartoDB (rápida, no se rompe en red lenta).
- **Fuentes oficiales** enlazadas (ENFEN, SENAMHI, CENEPRED/SIGRID, INDECI, NOAA, CHIRPS, GloFAS, INEI).

## Cómo usar

1. Sube la **estructura completa** (index.html, css/, js/, data/, geo/, docs/) a la raíz del repositorio.
2. Abre `https://TU-USUARIO.github.io/FENOMENO-DEL-N-O/`.
3. Usa el buscador para ir a un distrito/provincia/región o toca el mapa.

## Datos y fuentes

- **Lluvia en vivo:** Open-Meteo (pronóstico 72 h, CORS abierto) — no validado por SENAMHI.
- **Índice ONI:** NOAA/CPC (ERSST v6).
- **Territorio:** INEI (UBIGEO) — departamentos, provincias, distritos.
- **Contexto:** IGP, ENFEN, INDECI.

## Despliegue

Sitio estático en **GitHub Pages**. Para datos oficiales pesados (SIGRID raster, SENAMHI
estaciones) o centros poblados/caseríos completos se requiere backend (FastAPI + PostGIS)
o el shapefile oficial de Centros Poblados del INEI (fase futura).

