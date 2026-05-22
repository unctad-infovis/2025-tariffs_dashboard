# 2025-tariffs_dashboard

**Live demo** https://unctad-infovis.github.io/2025-tariffs_dashboard/

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm run install`
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

* **d3** - is used to create the swarm
* **highcharts** - is used to create the map
* **react-is-visible** - is used to check if the visualisation is in viewport
* **react-select** - is used to create the select menu
* **react-tooltip** - is used to create the tooltips
* **uuid** - is used to create unique keys

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