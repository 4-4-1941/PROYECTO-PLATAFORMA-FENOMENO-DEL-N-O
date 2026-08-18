# Anticipación El Niño · Gestión de riesgo y acción comunitaria

Plataforma web para la prevención de desastres asociados al Fenómeno El Niño en el Perú.
Cubre las **25 regiones** del país y cruza **lluvia pronosticada en tiempo real** con la
**vulnerabilidad de cada región** para emitir avisos de riesgo y **acciones preventivas
concretas para la comunidad**.

> No es una app meteorológica: es una herramienta de **gestión de riesgo**.
> Los umbrales y acciones son criterios de preparación de esta herramienta y **no
> sustituyen** los comunicados oficiales de ENFEN, SENAMHI, CENEPRED o INDECI.

## Estructura del proyecto

```
FENOMENO-DEL-N-O/
├── index.html        # Página principal (carga leaflet + data.js + app.js)
├── styles.css        # Estilos (diseño aprobado, responsive)
├── data.js           # Catálogo de 25 regiones + fuentes oficiales (datos locales)
├── app.js            # Lógica: mapa, riesgo en vivo, ONI, búsqueda, capas
├── departamentos.geojson  # Límites oficiales (24 deptos + Callao) — base cartográfica
└── antecedentes-historicos-el-nino-peru.md  # Contexto histórico
```

## Funcionalidades

- **Estado del fenómeno El Niño (ONI/NOAA):** fase actual (El Niño / Neutral / La Niña)
  con el índice oceánico, con lectura en vivo (proxy) y respaldo a valor documentado.
- **Riesgo por lluvia en vivo:** pronóstico a 72 h (Open-Meteo) para cada una de las
  25 regiones, con **umbral por tipo de región** (costa desértica, costa norte,
  altiplano, selva alta, amazonía).
- **Acción preventiva comunitaria** por región (ej. Ayacucho: alertar por huaicos en
  quebradas; Loreto: monitorear crecida de ríos amazónicos).
- **Búsqueda** por región (ej. "Puno", "Ayacucho", "Amazonas") — salta en el mapa.
- **Capas** en vivo (riesgo, TSM costa) con toggles ON/OFF.
- **Fuentes oficiales** enlazadas (ENFEN, SENAMHI, CENEPRED/SIGRID, INDECI, NOAA, CHIRPS, GloFAS, INEI).

## Cómo usar

1. Sube los 5 archivos del proyecto a la raíz del repositorio (GitHub Pages).
2. Abre la URL del sitio (`https://TU-USUARIO.github.io/FENOMENO-DEL-N-O/`).
3. Usa el buscador para ir a una región o toca los puntos del mapa para ver su
   lluvia, nivel y acción preventiva.

## Datos y fuentes

- **Lluvia en vivo:** Open-Meteo (pronóstico 72 h, CORS abierto).
- **TSM en vivo:** Open-Meteo Marine.
- **Índice ONI:** NOAA/CPC (ERSST v6).
- **Límites:** GeoJSON (INEI) — `departamentos.geojson`.
- **Contexto:** IGP, ENFEN, INDECI (ver `antecedentes-historicos-el-nino-peru.md`).

## Despliegue

Se publica como sitio estático en **GitHub Pages** (los 5 archivos en la raíz).
Para datos oficiales más pesados (SIGRID raster, SENAMHI estaciones) se requiere
un backend (FastAPI + PostGIS) fuera de GitHub Pages — fase futura anotada.

