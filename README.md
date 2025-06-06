# ClinicApp Fullstack

This repository contains both the front-end and back-end of **Clinica**, an educational project for managing a simple online medical clinic. It includes appointment scheduling, user authentication, doctor management, and role-based access control.

## Technologies

### Back-End (Ruby on Rails)
- Ruby 3.2+
- Rails 8
- PostgreSQL
- RESTful API with JWT authentication

### Front-End (React)
- React 19 + TypeScript
- Vite
- Material UI (MUI)
- React Router
- Context API for state and role management

---

## Project Structure

```
clinica/
├── clinica-api/         # Ruby on Rails API (back-end)
├── clinica-front/       # React front-end using Vite
└── README.md            # This file
```

---

## How to Run the Fullstack App

### 1. Back-End Setup

Make sure 

```bash
cd clinic-api
bundle install
rails db:create db:migrate
rails server
```

The API will be available at `http://localhost:3000`.

### 2. Front-End Setup

```bash
cd clinic-front
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

Make sure the base API URL is set in `src/services/api.ts`:
```ts
export const API_BASE_URL = 'http://localhost:3000';
```

---

## Features

### Authentication
- `POST /login`: Authenticate user and return JWT
- `POST /signup`: Register a new patient (default role)
- Role-based routing: Only admins can access the admin dashboard

### Patient Area
- View doctors
- Book and cancel appointments
- View active appointments
- Realtime availability checks

### Admin Area
- Manage doctors (CRUD)
- Manage all appointments (cancel any)
- Manage users (change roles, delete users)

---

## Notes

- JWT is used for secure communication between front-end and back-end.
- Patients can only access and cancel their own appointments.
- Admins have access to all system records and management functionality.
- All business logic (e.g., appointment times, available days) is handled according to rules defined in the API.

---

## License

This project is intended for educational purposes only.