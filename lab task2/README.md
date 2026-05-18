# Ralph Lauren Pakistan — Express + EJS

A server-side rendered version of the Ralph Lauren Pakistan landing page
built with **Express.js** and **EJS** templating.

---

## Project Structure

```
ralph-lauren/
│
├── server.js               ← Express entry point
├── package.json
│
├── views/                  ← EJS templates (server renders these)
│   ├── index.ejs           ← Home page
│   ├── 404.ejs             ← 404 error page
│   └── partials/
│       ├── head.ejs        ← <head> tag + CSS links
│       ├── navbar.ejs      ← Top bar + nav + mobile menu
│       └── footer.ejs      ← Footer + social icons + <script> tag
│
└── public/                 ← Static files served at root (/)
    ├── css/
    │   └── style.css       ← All styles
    ├── js/
    │   └── script.js       ← Hamburger + scroll behaviour
    ├── images/             ← Drop your .avif / .jpg images here
    │   ├── worldOfPolo.avif
    │   ├── Spring2026.avif
    │   ├── HeritageIcons.avif
    │   ├── Spring.avif
    │   ├── SpecialOccasions.avif
    │   ├── CandyStore.avif
    │   ├── Luxury1.avif
    │   ├── Lux2.avif
    │   ├── HomeAccents.avif
    │   └── Newarrivals.avif
    └── videos/             ← Drop your hero video here
        └── HP_VIDEO_1440x900_DSK_LOGO.webm
```

---

## Quick Start

### 1. Install dependencies
```bash
cd ralph-lauren
npm install
```

### 2. Add your media files
Copy your images into `public/images/` and your hero video into `public/videos/`.

### 3. Run (production)
```bash
npm start
# → http://localhost:3000
```

### 4. Run (development — auto-restart on file save)
```bash
npm run dev
# → http://localhost:3000
```

---

## Routes

| Method | Path | Description        |
|--------|------|--------------------|
| GET    | `/`  | Home page          |
| *      | `*`  | 404 fallback page  |

---

## How EJS partials work here

Each page view uses three includes:

```ejs
<%- include('partials/head')   %>   ← opens <html> + links CSS
<%- include('partials/navbar') %>   ← top bar + nav + mobile menu
  ... page content here ...
<%- include('partials/footer') %>   ← footer + links script.js + closes </html>
```

The `title` variable is passed from `server.js` via `res.render()` and
printed inside `head.ejs` as `<%= title %>`.

---

## Adding a new page

1. Create `views/my-page.ejs`:

```ejs
<%- include('partials/head')   %>
<%- include('partials/navbar') %>

<main>
  <h1>My New Page</h1>
</main>

<%- include('partials/footer') %>
```

2. Add a route in `server.js`:

```js
app.get("/my-page", (req, res) => {
  res.render("my-page", { title: "My Page | Ralph Lauren" });
});
```

That's it — visit `http://localhost:3000/my-page`.
