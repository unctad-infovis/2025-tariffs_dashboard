# 2025-tariffs_dashboard

**Live demo** https://unctad-infovis.github.io/2025-tariffs_dashboard/

## About

"How much have US tariffs really changed?" is the question this dashboard helps answer. It lets users explore how US tariffs on imports compare across three points in time — before January 2025, February 2026, and the current rates — broken down by product category (manufacturing, agriculture, fuels & mining) and by trading partner.

Content is authored in MDX and rendered as a standalone React application embeddable within UNCTAD's Drupal platform. The dashboard pairs a world map with a beeswarm chart, both driven by trade-weighted average tariff data based on USITC figures and US presidential actions, with economies selectable via a searchable dropdown and colour-coded by development status (developed, developing, least developed).

## Embedding

```html
<script type="module" crossorigin="" src="https://storage.unctad.org/2025-tariffs_dashboard/js/2025-tariffs_dashboard.min.js?v=1"></script>
<link rel="stylesheet" crossorigin="" href="https://storage.unctad.org/2025-tariffs_dashboard/css/2025-tariffs_dashboard.min.css?v=1">
<div class="app-root-2025-tariffs_dashboard" id="app-root-2025-tariffs_dashboard">
  Loading...
</div>
<noscript>Your browser does not support Javascript!</noscript>
```

Update the `?v=` query parameter to match the current build version to bust the cache.

## Used in

* [Tariff Dashboard](https://unctad.org/topic/trade-analysis/tariffs/tariff-dashboard)

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install`
* `npm run start`

Project should start at: http://localhost:8080

For developing please refer to `package.json`

## How to update data

1. Replace the data file at `./public/assets/data/data.json`
2. Check in browser that everything works with `npm run start`
3. Update the meta data at `./src/meta.json`
4. Create a new production build `npm run build` 
5. Syncronize project to Azure Storage `npm run sync-prod` 
6. Push changes to remote Git.

## Packages

The following packages are used in this project by default.

### Project specific

* **d3** — is used to create the swarm
* **highcharts** — is used to create the map
* **react-is-visible** — is used to check if the visualisation is in viewport
* **react-select** — is used to create the select menu
* **react-tooltip** — is used to create the tooltips
* **uuid** — is used to create unique keys

### Build & Dev Server

* **vite** — development server with hot module replacement and production bundler, replaces webpack
* **@vitejs/plugin-react** — adds React and JSX support to Vite

### React

* **react** — UI component library
* **react-dom** — renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** — formats and lints JS, JSX and CSS files on save, replaces ESLint + Prettier

### Minification

* **terser** — minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** — Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** — provides React context for MDX components