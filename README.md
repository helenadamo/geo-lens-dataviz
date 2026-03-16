# GeoJSON Lens Dataviz

## Concept & Overview
**GeoJSON Lens Dataviz** is an interactive, exploratory spatial data interface designed to behave like a "magic lens" over urban datasets. Rather than overwhelming the user with a massive static dashboard, the application focuses strictly on a locally bounded area (the "lens"). As the user drags the lens across the map, dynamic radial visualizations and summary metrics instantly analyze the visible data points beneath it. 

This project explores the intersection of geographic information systems (GIS), urban technology, and high-end data journalism. The interaction model encourages curiosity, spatial pattern recognition, and micro-scale geographic analysis in a way that feels seamless and highly responsive.

## Why This Project is Interesting
From a product and portfolio perspective, the Lens pattern challenges the conventional "filter and table" approach to spatial dashboards. By strictly binding visual analytics to a geometric area that the user manually queries, the cognitive load is reduced, and the experience feels significantly more tactile. It answers the question: *"What is happening exactly right here?"* without requiring complex querying or menus. The radial chart adds a layer of aesthetic polish, reinforcing the "tool as an optical instrument" metaphor and turning raw GeoJSON points into a cohesive, beautiful spatial narrative.

## Main Features
- **Spatial Lens Filtering**: Uses Turf.js distance computations to instantly query points within a circular radius.
- **Dynamic Radial Summary Chart**: Custom SVG arc generator builds a smooth, animated circular chart immediately outside the lens borders, classifying local properties dynamically.
- **Smart Field Detection**: Automatically parsing uploaded feature properties to locate categorical data (e.g., `type`, `class`) and contextual metrics (e.g., `injured`, `deaths`, `day_night`).
- **Clean Editorial Interface**: A refined, glassy, minimalist UI layout heavily inspired by modern data journalism and high-end dataviz applications (bypassing heavy chart libraries in favor of raw SVG and D3-style manual calculations).
- **Graceful Zero-State**: Includes beautiful sample data to bootstrap the experience, alongside drag-and-drop local GeoJSON parsing without server uploads.

## Tech Stack
- **Framework**: React / Vite (TypeScript)
- **Map Engine**: Leaflet (via direct DOM manipulation for performance and precise overlay tracking)
- **Spatial Computations**: Turf.js (`@turf/turf`)
- **Data Visualization**: Plain `SVG` and raw Trigonometry for maximum rendering control and seamless animation.
- **Styling**: Standard modern CSS with CSS variables, Glassmorphism utilities, and Lucide React icons.

## How it Works
1. When a dataset is loaded (Sample or User Upload), the application renders all points onto the Leaflet map.
2. The user controls a "Lens" defined by a geographic center coordinate and a radius (in meters).
3. `turf.js` computes the distance of every point to the lens center. Only points inside the radius are rendered.
4. As the lens moves (via click or hover), point properties are aggregated on-the-fly.
5. The radial chart processes these aggregations into sweep angles and renders raw SVG paths around the boundary of the lens in screen-space, anchored accurately via Leaflet's CRS coordinate translations.

## Running Locally

To run the application locally:

```bash
# 1. Clone the repository
git clone <repository_url>
cd lens_viewer

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Visit the provided localhost port (usually `http://localhost:5173`) in your browser.

## Ideas for Future Improvements
- **Polygon/Line Features**: Extending the spatial query capabilities beyond POINT geometries using Turf's intersection modules.
- **Heatmap Layer**: Fading in a density heatmap for points outside the lens to provide macro-context while exploring micro-context.
- **Filter Inspector**: Allowing users to explicitly lock or ignore certain categories from the radial aggregation.
- **Time Slider**: Adding a temporal dimension to replay events (like accidents or crimes) underneath the active lens.
