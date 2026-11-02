# AGENTS.md

- New full pages go in `src/pages/` and are registered in `src/App.tsx` above the catch-all `*` route; add them without deleting or rewriting existing routes or home sections.
- App images are imported from `src/assets/` through Vite, never from CDN/asset pointers, because CDN pointers failed on the published site.
- Shared UI uses shadcn tokens (`primary`, `muted`, `border`, `background`) instead of hardcoded colors so new pages match the existing theme.
