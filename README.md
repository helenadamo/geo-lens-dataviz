# GeoJSON Lens Dataviz
*A small personal experiment in spatial data visualization.*

---

## Preview

![Lens dataviz preview](assets/github.png)

---

## 🇧🇷 Sobre o projeto
Este é um **projeto pessoal de experimentação em dataviz**.

A ideia foi testar uma forma diferente de explorar dados espaciais: uma **lente interativa** que permite analisar o que está acontecendo em um pequeno pedaço do mapa.

Em vez de um dashboard cheio de filtros e gráficos, o projeto usa uma lente que você pode mover pelo mapa. É um experimento simples para explorar visualização de dados geográficos, UX exploratória e análise espacial em microescala.

## Dataset atual

O dataset utilizado atualmente é de **acidentes de trânsito em Porto Alegre (RS)**.

**Fonte:**  
Prefeitura de Porto Alegre – Dados Abertos / EPTC  
https://dadosabertos.poa.br/dataset/acidentes-de-transito

Os dados foram convertidos para **GeoJSON** e estão armazenados internamente no projeto na pasta `assets/`.
---

## Como funciona

1. O mapa renderiza os pontos do dataset.  
2. Uma **lente circular** pode ser movida pelo mapa.  
3. O sistema detecta quais pontos estão dentro da lente.  
4. Os dados são agregados em tempo real.  
5. Um **gráfico radial** mostra um resumo visual daquela área.  

A ideia é responder rapidamente à pergunta:
> **"O que está acontecendo exatamente aqui?"**

---

## Stack

- React  
- Vite  
- Leaflet  
- Turf.js  
- SVG (visualização customizada)  
- CSS  

---

## Rodando localmente

~~~bash
git clone <repository_url>
cd lens_viewer
npm install
npm run dev
~~~

Depois abra:

`http://localhost:5173`

---

## 🇺🇸 About the project

This is a **small personal experiment in geospatial data visualization**.

The goal was to explore a different way of interacting with spatial datasets: an interactive **lens** that allows you to inspect what is happening in a small area of the map.

Instead of building a complex dashboard with filters and charts, the project focuses on a simple interaction: moving a lens across the map and instantly analyzing the data inside it.

It’s a lightweight experiment exploring:

- geographic data visualization  
- exploratory map interfaces  
- spatial UX  
- micro-scale spatial analysis  

---

## Current dataset

The dataset currently used in this project contains **traffic accidents in Porto Alegre, Brazil**.

**Source:**  
Porto Alegre Open Data Portal – EPTC  
https://dadosabertos.poa.br/dataset/acidentes-de-transito

The dataset was converted to **GeoJSON** and stored locally inside the project in the `assets/` folder.

The application reads this file directly, so **there is no file upload feature in the interface**.

---

## How it works

1. The map renders all dataset points.  
2. A circular **lens** can be moved across the map.  
3. The system detects which points fall inside the lens radius.  
4. Data is aggregated in real time.  
5. A **radial chart** summarizes the data inside the lens.  

The idea is to answer a simple question:

> **"What is happening exactly here?"**

---

## Future ideas

Possible improvements:

- time slider for temporal analysis  
- multiple datasets  
- heatmap layer for macro context  
- polygon dataset support  