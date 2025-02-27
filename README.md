# Lavaforming Webcam Multiview

> Lavaforming is a proposal on how the brutal force of lava can be turned into a valuable resource, capable of lowering atmospheric emissions through its future use as a sustainable building material. The idea springs from Iceland's exceptional geological location on a rift between two tectonic plates, which causes frequent seismic activity on the island, including the creation of majestic lava fields. Throughout history, Iceland's volcanic activity has been perceived as a local disturbance and even as an otherworldly event.

This project will be displayed on one of many screens as part of the Lavaforming exhibition, at Iceland´s Pavilion for the 19th International Architecture Exhibition – La Biennale di Venezia.

It displays a live webcam multiview with four video livestreams of Reykjanes peninsula in a 2x2 grid, with data visualisation overlaid about seismic activity, climate, etc.

## Progress

### Completed
- [x] Simple React web app boilerplate using Vite + TypeScript
- [x] `sources.json` file where the user can input YouTube live stream IDs
- [x] Displaying the four YouTube video players in a grid filling the entire screen

### Todo
- [ ] Additional layer on top of the videos where data viz and graphics can be overlaid
- [ ] Scraping earthquake data https://github.com/topics/scraper

## Setup and Usage

1. Install dependencies:
  ```bash
  npm install
  ```

2. Configure your streams:
  Edit `src/data/sources.json` to add your YouTube live stream IDs. The file structure is:
  ```json
  {
    "streams": [
      {
        "id": "youtube_stream_id",
        "title": "Stream Title",
        "description": "Stream Description",
        "position": 0
      }
    ]
  }
  ```

3. Run the development server:
  ```bash
  npm run dev
  ```

## Development

The project uses:
- React 18 with TypeScript
- Vite for fast development and building
- react-youtube for embedding YouTube streams

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

*Note: this README will be updated as the project progresses.*
