# GeoJSON Lens Dataviz
*a small personal experiment in spatial data visualization *

![Lens dataviz preview](assets/github.png)


**PT:** Uma lente interativa que permite analisar dados espaciais em microescala. Arraste a lente pelo mapa para agregar dados em tempo real através de um gráfico radial construído com SVG puro. 

**EN:** An interactive lens for micro-scale spatial data analysis. Drag the lens across the map to aggregate data in real-time through a custom SVG radial chart.

## dataset

Currently using **Traffic Accidents in Porto Alegre, Brazil**.
*(Acidentes de Trânsito em Porto Alegre/RS)*

**source** [Prefeitura de Porto Alegre – Dados Abertos (EPTC)](https://dadosabertos.poa.br/dataset/acidentes-de-transito)

## stack

- React & Vite
- Leaflet
- Raw SVG (for custom radial charts)
- Turf.js & Fast Native Math Approximations

## run locally

```bash
git clone https://github.com/helenadamo/geo-lens-dataviz.git
cd geo-lens-dataviz
npm install
npm run dev
```
Open `http://localhost:5173`