# Restaurant Website

A Vue.js restaurant client and administration panel.

## Run the project

Requirements:
- Node.js 22.18 or newer
- npm

```powershell
npm install
npm start
```

URLs:
- Website: http://127.0.0.1:5173
- HR panel: http://127.0.0.1:5174/admin/

## Display preferences

The website and HR panel each have their own language and light/dark theme controls. The website supports English, Russian, and Uzbek. Preferences are saved separately in the browser for each app.

## Database

The shared API stores orders, reservations, employees, and menu data in MongoDB when `MONGODB_URI` is configured. Without it, the API uses SQLite locally. Node.js 22.18 or newer is required.

### MongoDB Atlas

1. Create a database user in Atlas and allow your hosting provider to connect in **Network Access**.
2. Copy the application connection string from Atlas. Keep it private; do not commit it or send it in chat.
3. In Render, open the service's **Environment** settings and add:

   ```text
   MONGODB_URI=<your-private-Atlas-connection-string>
   MONGODB_DB=<optional-database-name>
   ```

   `MONGODB_DB` is optional; when omitted, the database name in the connection string is used.
4. Save the settings and redeploy. The server connects before accepting requests and logs the database name after a successful connection. If the connection fails, startup fails instead of silently switching back to SQLite.

Hosted deployments refuse to start without `MONGODB_URI`, so production data cannot silently fall back to an ephemeral local SQLite file. After startup, `https://<your-service>/api/health` reports `"database":"mongodb"` when Atlas is active.

When Atlas is first configured, existing SQLite orders, reservations, employees, and menu entries are imported without replacing documents already present in Atlas. The SQLite database is retained as a local copy.

### SQLite fallback

Without `MONGODB_URI`, the local database is `restaurant-data.sqlite` in the project root. To keep SQLite data across Render deploys, attach a persistent disk and set:

```text
RESTAURANT_DATABASE_PATH=/var/data/restaurant-data.sqlite
```

If `RESTAURANT_DATA_FILE` points to an existing legacy JSON file, the server imports its data into SQLite on first start. The JSON file is left intact as a backup.

## Build

```powershell
npm run build
```

This installs the shared API dependencies as well as the client and admin dependencies, then builds both frontends.
