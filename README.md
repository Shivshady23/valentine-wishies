# Valentine Wishies (Multi-Page, GitHub Pages Ready)

A romantic Valentine website built with **HTML + CSS + Vanilla JavaScript** only.
This version uses separate pages for each section and deploys directly to GitHub Pages.

## Project Structure

```text
valentine-wishies/
│
├── index.html          (password + home hub)
├── letter.html         (love letter page)
├── kiss.html           (kiss interaction page)
├── proposal.html       (valentine proposal page)
├── memories.html       (memory cards page)
├── together.html       (relationship + anniversary timer page)
├── finale.html         (grand cinematic surprise ending page)
├── style.css
├── script.js
│
├── images/
│   ├── talk.jpg
│   ├── fight.jpg
│   └── date.jpg
│
├── music/
│   └── romantic.mp3
│
└── README.md
```

## Deploy to GitHub Pages

1. Create a new GitHub repository (example: `valentine-wishies`).
2. Upload all files from this folder while keeping the exact structure.
3. Open `Settings > Pages` in your repository.
4. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
5. Save and wait for deployment.
6. Open your site:
   - `https://username.github.io/repository-name/`

## How Multi-Page Access Works

- `index.html` is the entry page with the password screen.
- Password success stores unlock state in `sessionStorage`.
- `letter.html`, `kiss.html`, `proposal.html`, `memories.html`, `together.html`, and `finale.html` redirect back to `index.html` if not unlocked.

## Replace Images and Music

Replace these files with your own media (keep names the same, or update paths in HTML):

- `images/talk.jpg`
- `images/fight.jpg`
- `images/date.jpg`
- `music/romantic.mp3`

## Change Her Name and Password

Edit in `script.js`:

```js
const herName = "Honey Shivang Chauhan";
const secretPassword = "2109";
```

## Customize Text

- Password error message: `setupPasswordGate()` in `script.js`
- Love letter content: `startTypewriter()` in `script.js`
- Proposal success overlay message: `proposal.html`
- Headings and page labels: `index.html`, `letter.html`, `kiss.html`, `proposal.html`, `memories.html`, `together.html`, `finale.html`

## Notes

- All links are relative paths for GitHub Pages compatibility.
- No backend and no build tool required.
- Only external dependency: Google Fonts CDN.
- Background music starts after unlock. Some browsers may require an additional tap because of autoplay policy.
