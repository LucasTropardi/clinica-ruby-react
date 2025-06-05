
# Clinic API

This is a Ruby on Rails RESTful API for managing a medical clinic, built for educational purposes. It includes authentication, user roles, doctor management, and appointment scheduling logic.

## Requirements

- Ruby 3.2+
- Rails 8
- PostgreSQL
- Bundler

## Getting Started

Clone the repository and set up the environment:

```bash
bundle install
rails db:create db:migrate
rails server
```

The API will be available at `http://localhost:3000`.

## Authentication

- `POST /login`: Authenticates a user and returns a JWT token.
- `POST /signup`: Creates a new patient user (default role).

Use the returned JWT token in the `Authorization` header as `Bearer <token>` for protected routes.

## User Endpoints

- `GET /users`: (Admin only) List all users
- `GET /users/:id`: (Self or admin) Show user details
- `PUT /users/:id`: (Self or admin) Update user data
- `DELETE /users/:id`: (Admin only) Delete user (hard delete)

## Doctor Endpoints

- `GET /doctors`: Public list of doctors
- `GET /doctors/:id`: Public show doctor details
- `POST /doctors`: (Admin only) Create a doctor
- `PUT /doctors/:id`: (Admin only) Update a doctor
- `DELETE /doctors/:id`: (Admin only) Delete a doctor

Doctors have the following attributes:

- `name`
- `specialty`
- `crm` (must be unique)
- `available_days`: string (e.g., `"mon,tue,wed"`)

## Appointment Endpoints

- `GET /appointments`: (Authenticated user) List their own active appointments
- `GET /appointments/:id`: (Authenticated user) Show their own appointment
- `POST /appointments`: Create a new appointment
- `DELETE /appointments/:id`: Cancel an appointment with at least 1-day notice
- `GET /appointments/all`: (Admin only) List all appointments

Appointments must follow these rules:

- Scheduled only Monday to Friday
- Time must be between 08:00–12:00 or 14:00–18:00
- Duration is fixed at 30 minutes (handled externally)
- A doctor cannot have overlapping appointments
- A patient cannot book two appointments at the same time
- Cancellations are only allowed 24h in advance (logical deletion via status)

Appointment model fields:

- `doctor_id`
- `user_id`
- `date` (YYYY-MM-DD)
- `time` (HH:MM)
- `status` (e.g., "active", "cancelled")

## Notes

- Authentication is done via JWT, validated in `ApplicationController`.
- Patients can only access their own records.
- Admins have full control over users, doctors, and appointment visibility.
