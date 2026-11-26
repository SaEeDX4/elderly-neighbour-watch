# Elderly Neighbour Watch

A static website for **Elderly Neighbour Watch (ENW)** — a community program
that connects seniors who need assistance with caring volunteers in their
neighbourhood.

![License](https://img.shields.io/badge/License-MIT-green)

**Live site (GitHub Pages):** https://saeedx4.github.io/elderly-neighbour-watch/

> This repository is the lightweight static showcase site. The full-stack
> application (React + Express + MongoDB, with volunteer/senior management)
> lives in the companion repo
> [enw-website](https://github.com/SaEeDX4/enw-website).

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home — impact stats, how it works, community stories |
| `seniors.html` | Information and help requests for seniors |
| `volunteers.html` | Volunteer sign-up and information |
| `about.html` | About the program |
| `donate.html` | Support the program |
| `contact.html` | Contact |
| `admin.html` | Admin overview page |
| `privacy.html` / `terms.html` | Privacy policy / terms |

## Project structure

```
elderly-neighbour-watch/
├── public/          # The website (HTML pages, assets/css/js/images)
│   ├── *.html
│   └── assets/
├── server.js        # Tiny Express static server for local preview
└── package.json
```

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000 (or just open `public/index.html` in a
browser — the site is fully static).

## Deployment

Published with **GitHub Pages** from this repository. The full-stack ENW
platform is deployed separately on Render (see the `enw-website` repo).

## Author

**Saeed Sharifzadeh** (Vancouver, BC)

## License

[MIT](LICENSE)
