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
- React 19 with TypeScript
- Vite for fast development and building
- react-youtube for embedding YouTube streams

## Deployment

The app is deployed to GitHub Pages at: https://jarmitage.github.io/lavaforming-webcam/

To deploy:
```bash
npm run deploy
```
