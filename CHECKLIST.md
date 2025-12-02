# Project Setup & Verification Checklist

This checklist helps you set up, run, and verify the frontend React + JSON-Server project described in the PRE-REQUISITES. Follow each section and mark items as you complete them.

---

## 1) Prerequisites (install + verify)

- [ ] Node.js (LTS) installed - verify with `node --version`.
- [ ] npm (comes with Node.js) - verify with `npm --version`.
- [ ] Git installed and configured - `git --version` and `git config --list`.
- [ ] Visual Studio Code or other editor installed.

## 2) Create / run the React app (Vite)

- [ ] Create app with Vite (if starting new):
  - `npm create vite@latest` → choose React + JSX/TS as needed.
- [ ] Install dependencies: `npm install`.
- [ ] Start dev server: `npm run dev` — open at the URL printed (usually http://localhost:5173).

## 3) Project-specific required packages

- [ ] Tailwind CSS configured for styling (check tailwind config files and package.json deps).
- [ ] Axios present for API calls (`axios` in package.json).
- [ ] React Router DOM installed (`react-router-dom`).
- [ ] JSON-Server set up for backend (`json-server` in server package.json or dev deps).

## 4) JSON-Server (backend) setup & sanity checks

- [ ] Start the JSON-server (or custom server.js) — typical command: `node server/server.js` or `npm run server`.
- [ ] Confirm server listening output e.g. `Server is running on http://localhost:3001`.
- [ ] Confirm API base path: `http://localhost:3001/api` (server.js in this repo mounts router on `/api`).

## 5) Ensure DB has required collections

- [ ] `server/db.json` contains required top-level arrays used by the app (e.g., `users`, `movies`, `resumes`, `profiles`, etc.).
  - If your app expects `users` but `db.json` contains only `movies`, add an empty array: `"users": []`.

## 6) Full-CRUD verification (how to check data is being stored)

These checks verify that the app can Create, Read, Update, Delete user/resume data with JSON-Server.

1. Confirm GET (Read):

   - Browser or curl: `GET http://localhost:3001/api/users` — should return an array (possibly empty) of user objects.

2. Create (POST) — from frontend or using curl/Postman:

   - Example curl:
     ```powershell
     curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d '{ "email": "you@example.com", "name": "Tester" }'
     ```
   - Successful response returns created object (with `id`, `createdAt`, etc.).
   - Check the server log for the incoming payload — server.js includes a debug log: `[POST /users] incoming body:`.
   - Confirm entry written to `server/db.json` under `users`.

3. Update (PUT / PATCH):

   - Example curl (replace 123 with real id):
     ```powershell
     curl -X PATCH http://localhost:3001/api/users/123 -H "Content-Type: application/json" -d '{ "name": "Updated Name" }'
     ```
   - Confirm GET returns the updated record and `db.json` reflects the change.

4. Delete (DELETE):
   - Example curl: `curl -X DELETE http://localhost:3001/api/users/123`.
   - Confirm the record no longer appears in GET results and `db.json` is updated.

## 7) Debugging: How to check exactly where details are stored

- [ ] Look in `server/server.js` to see custom middleware (e.g., POST /users adds id and createdAt) and logging. The repository includes a console log which prints incoming POST bodies.
- [ ] Check `server/db.json` — JSON-Server persists created records in that file.
- [ ] If using a browser UI, check network tab -> XHR/Fetch requests for POST to `/api/users` and inspect response.
- [ ] Use Postman or curl (examples above) for repeatable tests.

## 8) Extra helpful checks (developer tooling)

- [ ] Add/enable server logging or a debug GET endpoint to list contents (helpful during development).
- [ ] Validate that the app handles duplicate email correctly — server middleware rejects duplicates with 400.

## 9) Required tests & acceptance

- [ ] Manual test: sign up or create a user in the frontend; confirm record exists in `server/db.json` and is returned by GET.
- [ ] Manual test: update and delete flows work end-to-end.
- [ ] UI checks: forms show success/error and toast notifications where applicable.

## 10) Commands summary (quick reference)

- Start frontend dev server
  ```powershell
  npm run dev
  ```
- Start JSON server (if project uses custom server):
  ```powershell
  node server/server.js
  ```
- Run tests or lint (if present): `npm run test` / `npm run lint` (check package.json)

---

If you want, I can also add automated endpoints for debugging (admin GET) or provide Postman/Insomnia collection + sample curl scripts to make verification easier.

---

Last updated: 2025-12-02
