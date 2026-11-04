# HYVEOUT

Portfolio site for **Hyveout**, the creative identity of Sameer Alam: music videos, creative direction, websites, album rollouts and games for music artists.

Live at **[hyveout.com](https://hyveout.com)**.

## The design

A console-dashboard style homepage inspired by the Xbox 360 / Wii menus: the Hyveout emblem floats in the middle, each section orbits it, and selecting one flies you into that page. Retro CRT scanlines and a scrolling world map sit behind everything.

- **Media** – music videos (YouTube), visualizers, graphics & photos
- **Mind** – creative direction case studies (Slayr, Vax, Aquasocks) and collaborated artists
- **Games** – interactive websites and games built for artists
- **About / Contact**

Works with mouse, touch and keyboard (arrow keys + Enter, Esc to go back).

## Structure

```
index.html        page shell
css/style.css     all styling
js/app.js         navigation, screens, players
data/site.json    every piece of content (videos, artists, projects, copy)
assets/           fonts, icons, images, game clips, videos
```

No build step: it's plain HTML, CSS and JavaScript. To change content, edit `data/site.json`.

Run locally with any static server, e.g. `npx serve .`

