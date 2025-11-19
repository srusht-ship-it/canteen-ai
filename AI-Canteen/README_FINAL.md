# AI Canteen — Final Delivery README

This README contains everything your friend will need to run the AI Canteen project locally, and how you should package and share the project with the database dump.

---

## What is included

- backend/ — Express + Mongoose API (Node.js)
- my-frontend/ — React frontend app
- backend/createAdmin.js, backend/upgradeToAdmin.js — convenience scripts for creating/upgrading admin users
- backend/export_db.ps1 — PowerShell script to export MongoDB using `mongodump` (created in this delivery)
- README_FINAL.md (this file)

> Note: The actual MongoDB dump (archive) is not included by default in the repository. Use `export_db.ps1` to create the dump file and include it when you package.

---

## Features implemented (summary)

Core user features:

- User registration and login (JWT)
- Cart: add, remove, view, persistent per user
- Checkout: create orders, price calculation, safe numeric handling
- Order history: view past orders with details
- Order detail and confirmation pages

Admin features:

- Admin Dashboard (`/admin`) with role-based protection
- Order Management: view all orders, status updates, filters
- Sales Analytics: charts (Line/Pie/Bar) with revenue, status distribution, popular items
- Scripts to create default admin and upgrade existing users to admin

Other:

- Responsive UI with improved desktop layout for login/register
- RBAC (role-based access control) enforced on admin routes

---

## Prerequisites (on both machines)

- Node.js (v18+ recommended)
- npm (comes with Node)
- MongoDB server (community) installed and running (or use a hosted MongoDB URI)
- `mongodump` and `mongorestore` utilities available via MongoDB Tools (for DB export/import)

Windows-specific: open PowerShell as Administrator for service start or use Services UI.

---

## Files you should include when sending the project to a friend

When packaging to send, include:

1. The entire project folder (backend/ and my-frontend/) — or a zip of the repository
2. `.env` or `.env.example` — Do NOT include secrets in public copies; prefer `.env.example` and send real `.env` securely
3. The MongoDB dump archive (e.g., `canteen_dump.archive` produced by `mongodump --archive`)
4. The `README_FINAL.md` (this file)
5. The `backend/export_db.ps1` script (created here) to help with exports

Tip: If you can't send the DB archive due to size, upload it to a cloud drive and share a private link.

---

## How to export the database (on your machine before packaging)

This repository includes `backend/export_db.ps1` which tries to read `MONGODB_URI` from the backend `.env` and run `mongodump`.

Steps (Windows, PowerShell):

1. Make sure MongoDB server is running and `mongodump` is on your PATH (install MongoDB Database Tools if needed).
2. Open a PowerShell window in `backend/` directory.
3. Run (example):

```powershell
# change directory to backend
cd "D:\VIT(24-27)\Year 3\AI-Canteen\backend"
# run the script, optionally pass output filename
.\export_db.ps1 -OutFile "..\canteen_dump.archive"
```

The script will create an archive file (gzip-compressed by default) which you can include in the package.

Manual mongodump example (cross-platform):

```bash
mongodump --uri "mongodb://localhost:27017/ai-canteen" --archive=./canteen_dump.archive --gzip
```

---

## How to restore the DB on the recipient machine

1. Put the DB archive (e.g., `canteen_dump.archive`) into the `backend/` folder.
2. Ensure MongoDB server is running on the recipient machine.
3. Restore with `mongorestore`:

```bash
# restore to local mongod default
mongorestore --uri "mongodb://localhost:27017" --archive=./canteen_dump.archive --gzip --nsFrom "ai-canteen.*" --nsTo "ai-canteen.*"
```

If the dump was created with a single DB name baked in, mongorestore will restore that DB; adjust `--nsFrom/--nsTo` if you want renames.

Windows PowerShell example:

```powershell
cd "D:\path\to\backend"
mongorestore --archive=.\\canteen_dump.archive --gzip
```

---

## How the recipient runs the project (recommended quick steps)

1. Install Node + MongoDB on their machine.
2. Place `.env` in `backend/` folder. At minimum, the `.env` must contain:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-canteen
JWT_SECRET=someVerySecretString
JWT_EXPIRE=7d
```

3. Restore the DB archive as shown in the previous section (or run `npm run seed` if you supply a seeding script).
4. Start backend (from `backend/`):

```powershell
cd backend
npm install
npm run dev   # uses nodemon server.js
```

5. Start frontend (from `my-frontend/`):

```powershell
cd my-frontend
npm install
npm start
```

6. Visit frontend at `http://localhost:3000`. Login with an admin user to access `/admin`.

---

## Admin account & access

If you include the DB dump that contains an admin, use those credentials. Otherwise use the `createAdmin.js` script on the recipient machine:

```powershell
cd backend
node createAdmin.js
# this will create admin@canteen.com / admin123 (then change password immediately)
```

Or upgrade an existing user to admin:

```powershell
cd backend
node upgradeToAdmin.js user@example.com
```

Security note: Change the default password immediately. Do not use the default in production.

---

## Packaging checklist before sending

- [ ] Run `backend/export_db.ps1` (or mongodump) and verify `canteen_dump.archive` exists
- [ ] Run `npm ci` / `npm install` locally to ensure package-lock is current (optional)
- [ ] Remove any local-only big files (node_modules) — let recipient run `npm install`
- [ ] Include `.env` securely or provide `.env.example` and share real secrets privately
- [ ] Zip the repository root (include backend, my-frontend, README_FINAL.md, canteen_dump.archive)

Example (PowerShell):

```powershell
# from parent folder
Compress-Archive -Path .\backend, .\my-frontend, README_FINAL.md, .\canteen_dump.archive -DestinationPath AI-Canteen-for-friend.zip -CompressionLevel Optimal
```

---

## Troubleshooting

- MongoDB connection refused: ensure MongoDB service is running. On Windows run `services.msc` and start MongoDB or run `net start MongoDB` in an elevated PowerShell.
- `mongodump` or `mongorestore` not found: install MongoDB Database Tools and add them to PATH.
- Port conflicts: change `PORT` in `.env` or stop other services running on that port.
- Frontend compile errors (missing packages): run `npm install` inside `my-frontend/`.

---

## Notes & Security

- Do not publish or share `.env` containing secrets publicly. Use secure channels (encrypted cloud share or password-protected zip) to share the `.env` and DB archive.
- If this repo will be used beyond testing, rotate any default credentials and JWT secret.

---

## Contact

If your friend (recipient) hits issues, they can:

- Reopen this README and follow the troubleshoot steps
- Ask you for the `.env` or DB link if missing

---

Good luck — you now have everything needed to package and send the project with a database dump. If you want, I can:

- Create a ZIP of the repo (if you provide permission for me to run zipping commands in your workspace)
- Produce a Linux/macOS export script as well
- Add a `restore_db.ps1` script to automate the mongorestore step for Windows

Tell me which of these extras you'd like me to add next.
