# GeoJSON Lens Dataviz
*A small personal experiment in spatial data visualization / Um experimento em dataviz espacial.*

![Lens dataviz preview](assets/github.png)

## 🇧🇷 Sobre / 🇺🇸 About

**PT:** Uma lente interativa que permite analisar dados espaciais em microescala. Arraste a lente pelo mapa para agregar dados em tempo real através de um gráfico radial construído com SVG puro. Uma forma mais focada e exploratória de visualizar dados geográficos, em vez dos dashboards tradicionais com filtros e tabelas.

**EN:** An interactive lens for micro-scale spatial data analysis. Drag the lens across the map to aggregate data in real-time through a custom SVG radial chart. A more focused, exploratory way to visualize geographic data compared to traditional filter-heavy dashboards.

## 📊 Dataset

Currently using **Traffic Accidents in Porto Alegre, Brazil**.
*(Acidentes de Trânsito em Porto Alegre/RS)*

**Source / Fonte:** [Prefeitura de Porto Alegre – Dados Abertos (EPTC)](https://dadosabertos.poa.br/dataset/acidentes-de-transito)

## 🛠 Tech Stack

- React & Vite
- Leaflet
- Raw SVG (for custom radial charts)
- Turf.js & Fast Native Math Approximations

## 🚀 Running Locally / Rodando Localmente

```bash
git clone https://github.com/helenadamo/geo-lens-dataviz.git
cd geo-lens-dataviz
npm install
npm run dev
```
Open `http://localhost:5173`