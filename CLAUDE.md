# Claude Notes

## Project Overview

Wedding website for Sarah Kobos & Nick Cox (September 19, 2026).

- **Tech stack**: Vanilla HTML/CSS/JS, single-page site
- **Hosting**: GitHub Pages with custom domain (see CNAME)
- **Repo**: https://github.com/nicholas-cox/wedding-site.git

## Key Systems

- **RSVP**: Custom guest lookup system backed by Google Sheets. Guest data in `guests.js`, backend logic in `google-apps-script.js`, frontend in `script.js`.
- **Sections**: Hero, Photobooth, Our Story, Venue, Lodging, Schedule, What to Wear, Registry, RSVP

## Notes

- Site has active traffic (invites are out) - always test locally before pushing
- CSS for registry cards already exists in `styles.css` (`.registry-card`, `.registry-links`)
