# Maisonia — Premium Real Estate Rental Platform

A modern, production-ready rental platform built with **HTML5, CSS3, vanilla JavaScript and Firebase** (Auth, Firestore, Storage).

## Live preview

This site is served as static files from `public/maisonia/` and is accessible at:

- **User app:** `/maisonia/index.html`
- **Admin login:** `/maisonia/login.html`

Visiting the project root (`/`) automatically redirects to the user app.

## Structure

```
public/maisonia/
├── index.html              # Hero + featured + map + stats + testimonials
├── properties.html         # All listings with filters & pagination
├── property-details.html   # Gallery, specs, map, contact form, similar
├── favorites.html          # Local-storage based favorites
├── contact.html            # Contact form (stores to Firestore)
├── login.html              # Firebase Auth admin login
├── admin/
│   ├── admin-dashboard.html    # Stats, charts, recent properties
│   ├── add-property.html       # Multi-image upload + map picker (also edit)
│   ├── edit-property.html      # Redirects to add-property.html?id=…
│   ├── properties-manager.html # Real-time table with sort/search/delete
│   ├── messages.html           # Inbox with read/delete
│   └── admin.css
├── css/
│   ├── variables.css       # Design tokens (colors, typography, spacing)
│   ├── style.css           # Components & layout
│   ├── animations.css      # Keyframes & reveal animations
│   └── responsive.css      # Mobile-first breakpoints
└── js/
    ├── firebase-config.js  # SDK init + re-exports
    ├── auth.js             # login / logout / requireAdmin guard
    ├── properties.js       # CRUD + real-time subscriptions + card render
    ├── property-details.js # Details page logic
    ├── favorites.js        # localStorage favorites
    ├── map.js              # Leaflet helpers
    ├── ui.js               # Toasts, navbar, reveal, counters
    ├── animations.js
    └── app.js              # Home bootstrap
```

## Tech

- **Firebase Auth** — admin sign-in & route protection
- **Firestore** — `properties` and `messages` collections with `onSnapshot` realtime updates
- **Storage** — multi-image uploads with progress + URL persistence
- **Leaflet.js** — interactive maps & click-to-place pin
- **Swiper.js** — image sliders (cards + details gallery)
- **Chart.js** — dashboard analytics

## Getting started

1. **Create an admin user** in Firebase Console → Authentication → Add user.
2. **Open** `/maisonia/login.html` and sign in with that account.
3. **Add properties** from the admin → Add property page.
4. New properties appear on the public site in real time.

## Firestore rules (recommended)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /properties/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /messages/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

## Storage rules

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /properties/{file=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---
© 2026 Maisonia.
