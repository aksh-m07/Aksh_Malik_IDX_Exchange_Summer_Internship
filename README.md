# IDX MLS Real Estate Platform

A full-stack real estate listings platform built during the IDX Exchange internship. Users can search, filter, and page through MLS property listings, view individual property details with photo galleries and a map, and see scheduled open houses for a listing.

[App screenshot](./docs/screenshot.png) 

## Tech Stack

| Layer     | Technology        | Version |
|-----------|--------------------|---------|
| Frontend  | React              |^19.2.7|
| Frontend  | React Router DOM   | 6.21.3  |
| Backend   | Node.js            | v24.12.0|
| Backend   | Express            | ^4.22.2|
| Database  | MySQL              | 8 (Docker) |
| DB Driver | mysql2             | ^3.22.5|
| Testing   | Jest               | ^30.4.2|
| Testing   | Supertest          |^7.2.2|
| Testing   | React Testing Library | jest|



## Project Structure

```
.
├── backend/
│   ├── App.js              # Express app setup (middleware, routes) 
│   ├── server.js            # Starts the server (imports App.js, calls .listen)
│   ├── db.js                 # MySQL connection pool (mysql2)
│   └── routes/
│       ├── properties.js     # All /api/properties route handlers
│       └── properties.test.js
└── frontend/
    └── src/
        ├── api/               # API client (fetch wrapper)
        ├── components/        # PropertyCard, PropertyFilters, Pagination, etc.
        ├── pages/             # ListingsPage, PropertyDetailPage
        └── utils/
```

## Local Setup (from a fresh machine)

### Prerequisites
- Node.js and npm installed
- Docker installed (for MySQL) — or a local MySQL 8 install

### 1. Clone the repository
```bash
git clone https://github.com/aksh-m07/Aksh_Malik_IDX_Exchange_Summer_Internship.git
cd Aksh_Malik_IDX_Exchange_Summer_Internship
```

### 2. Set up the database
Start a MySQL 8 container (adjust credentials as needed):
```bash
docker run --name idx-mysql -e MYSQL_ROOT_PASSWORD=yourpassword -e MYSQL_DATABASE=idx -p 3306:3306 -v idx-mysql-data:/var/lib/mysql -d mysql:8
```
Import the schema:
```bash
mysql -h 127.0.0.1 -u root -p idx < rets_property.sql
mysql -h 127.0.0.1 -u root -p idx < rets_openhouse.sql
```

### 3. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` with:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=idx
PORT=8000
```
Start the backend:
```bash
npm run dev
```
Confirm it's running by visiting `http://localhost:8000/api/health` — you should see `{"status":"ok","database":"connected"}`.

### 4. Frontend setup
```bash
cd frontend
npm install
```
Create a `.env` file in `frontend/` if the app expects an API base URL (e.g. `REACT_APP_API_URL=http://localhost:8000`).

Start the frontend:
```bash
npm start
```
The app will open at `http://localhost:3000`.

### 5. Run the tests
```bash
cd backend && npm test
cd frontend && npm test -- --watchAll=false
```

## API Reference

All endpoints are prefixed with `/api/properties`. All responses are JSON.

### `GET /api/properties`
Returns a paginated, filterable list of properties.

**Query parameters** (all optional):

| Param      | Type    | Notes |
|------------|---------|-------|
| `city`     | string  | Case-insensitive, whitespace-trimmed exact match |
| `zipcode`  | string  | Exact match |
| `minPrice` | number  | Inclusive lower bound |
| `maxPrice` | number  | Inclusive upper bound; must be greater than `minPrice` |
| `beds`     | integer | Exact match, must be a positive integer |
| `baths`    | integer | Exact match, must be a positive integer |
| `limit`    | integer | 1–100, default 10 |
| `offset`   | integer | ≥ 0, default 0 |
| `sortBy`   | string  | One of: `price`, `date`, `sqft`, `beds`, `baths` |
| `sortOrder`| string  | `ASC` or `DESC` (default `ASC` if `sortBy` given) |

**Example request:**
```
GET /api/properties?city=San Diego&minPrice=400000&maxPrice=800000&limit=10&offset=0
```

**Example response (200):**
```json
{
  "total": 42,
  "limit": 10,
  "offset": 0,
  "results": [
    {
      "L_ListingID": "123456",
      "L_Address": "123 Main St",
      "L_City": "San Diego",
      "L_State": "CA",
      "L_SystemPrice": 750000,
      "L_Keyword2": 3,
      "LM_Dec_3": "2",
      "LM_Int2_3": 1800,
      "L_Photos": "photo1.jpg,photo2.jpg"
    }
  ]
}
```

**Error response (400) — invalid input:**
```json
{ "error": "limit must be an integer between 1 and 100" }
```

### `GET /api/properties/:id`
Returns a single property by its MLS listing ID.

**Example request:**
```
GET /api/properties/123456
```

**Example response (200):**
```json
{
  "L_ListingID": "123456",
  "L_Address": "123 Main St",
  "L_City": "San Diego",
  "L_State": "CA",
  "L_SystemPrice": 750000
}
```

**Error response (404):**
```json
{ "error": "Property not found" }
```

**Error response (400) — invalid ID format:**
```json
{ "error": "Invalid listing ID" }
```

### `GET /api/properties/:id/openhouses`
Returns all scheduled open houses for a property, ordered by date and start time.

**Example request:**
```
GET /api/properties/123456/openhouses
```

**Example response (200):**
```json
[
  { "L_ListingID": "123456", "OpenHouseDate": "2026-09-01", "OH_StartTime": "10:00:00" }
]
```
Returns `[]` if the property exists but has no open houses scheduled.

**Error response (404):** same shape as above — property not found.

### `GET /api/health`
Health check. Confirms the server is running and the database is reachable.

**Example response (200):**
```json
{ "status": "ok", "database": "connected" }
```

## Database Schema

<!-- TODO: verify against your actual DESCRIBE output / .sql files and fill in any missing columns -->

### `rets_property`
Primary table for MLS listings. Key columns:

| Column           | Notes |
|-------------------|-------|
| `id`               | Internal auto-increment primary key |
| `L_ListingID`       | Public MLS listing ID — used in API URLs and joins to `rets_openhouse` |
| `L_Address`         | Street address |
| `L_City`, `L_State`, `L_Zip` | Location fields |
| `L_SystemPrice`     | Listing price |
| `L_Keyword2`        | Number of bedrooms |
| `LM_Dec_3`           | Number of bathrooms |
| `LM_Int2_3`          | Square footage |
| `L_Photos`           | Delimited string of photo filenames/URLs |
| `ListingContractDate`| Used for date sorting |

### `rets_openhouse`
Open house schedule, one row per scheduled showing.

| Column          | Notes |
|------------------|-------|
| `L_ListingID`     | Foreign key (logical) to `rets_property.L_ListingID` |
| `OpenHouseDate`   | Date of the open house |
| `OH_StartTime`    | Start time |

**Relationship:** `rets_openhouse.L_ListingID` → `rets_property.L_ListingID` (one property can have many open houses).

## Known Issues & Future Improvements

- **Price formatting is locale-dependent.** `PropertyCard` calls `price.toLocaleString()` with no explicit locale argument, so the displayed price format depends on the server/browser's default locale (e.g. `750,000` vs `7,50,000`). Should be pinned to `toLocaleString("en-US")` for consistency.
- **Sorting** only supports a fixed whitelist of columns (`price`, `date`, `sqft`, `beds`, `baths`) — no multi-column sort.
