## School Management APIs (Express + MySQL)

APIs to add schools and list schools sorted by distance to a user location. Includes a small responsive frontend and SQL schema.

### Quick start

1. Create MySQL database and table:
   - Update `.env` with your MySQL credentials
   - Run the SQL in `sql/schema.sql`

2. Install and run:

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000` and serves the UI from `public/`.

### API

- POST `/addSchool`
  - body: `{ name, address, latitude, longitude }`
- GET `/listSchools?latitude=12.3&longitude=45.6&page=1&limit=50`
  - response: `{ items: [...], page, limit, total }`

### Features

- **Validation**: Zod schema validation for all inputs
- **Pagination**: Page-based pagination with configurable limits
- **Distance Sorting**: Haversine formula for accurate distance calculation
- **Duplicate Protection**: Unique constraint on (name, address)
- **Database Indexes**: Optimized queries with lat/lon indexes
- **Responsive UI**: Mobile-friendly interface with pagination controls
- **Geolocation**: "Use My Current Location" button
- **API Documentation**: Swagger UI at `/docs`

### Testing

```bash
npm test
```

Tests cover:
- POST /addSchool validation and success cases
- GET /listSchools pagination and error handling
- Database error scenarios

### Docs

- Swagger UI: `/docs`

### Environment

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_db
```

Also see `.env.example` for a template.

### Postman

Import `postman_collection.json` and try both endpoints.

### Docker

```bash
docker compose up -d
```

Includes MySQL and Adminer for database management.



