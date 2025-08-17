# Hostel Management System (Node + Express)

- Auth: admin + student via JWT
- Admin dashboard, student dashboard
- Rooms CRUD, assign/unassign students
- Complaints: submit (student), update status (admin)
- Announcements: list, create/delete (admin)
- Payments: list (both), create due + mark paid (admin)
- In-memory store (no DB) and simple frontend in `public/`

## Quick start

1. Install deps: `npm install`
2. Run dev: `npm run dev`
3. Open: `http://localhost:3000/`

Seed users:
- admin: admin@hostel.com / admin123
- student: student@hostel.com / student123
