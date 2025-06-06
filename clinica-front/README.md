# ClinicApp Front-End

This is the front-end application for **Clinica**, a simple online medical scheduling system built using **React**, **TypeScript**, and **Material UI**. It interacts with a Ruby on Rails back-end API and provides distinct interfaces for patients and administrators.

## Features

### General
- Developed with **Vite**, using React 19 and TypeScript.
- Styled with **Material UI (MUI)** components and responsive design.
- Routes managed with `react-router-dom`.
- Centralized authentication using JWT tokens.
- Context API for authentication and role-based access control.

### Patient Area
- View list of doctors with details like specialty, CRM, and available days.
- Book appointments selecting date and time.
- Check slot availability in real-time.
- View active appointments.
- Cancel appointments with confirmation dialog.

### Admin Area
Accessible only by users with the `admin` role.

#### Doctors Management
- List of all registered doctors.
- Create, update, and delete doctors.
- Select working days via checkbox mapped to weekdays (Monday to Friday).

#### Appointments Management
- Full list of scheduled appointments.
- Cancel any appointment with a confirmation dialog.

#### Users Management
- List of all registered users.
- Delete user with confirmation.

## Project Structure

```
src/
├── components/           // Reusable components
├── context/              // Auth context
├── models/               // TypeScript interfaces
├── pages/                // Main views: Login, Doctors, Appointments, Admin
├── services/             // API communication (GET, POST, PUT, DELETE)
├── styles/               // CSS and global styles
├── utils/                // Helper functions (e.g., authUtils)
└── main.tsx              // App bootstrap
```

## How to Run

1. Clone the repository:
```bash
git clone https://github.com/LucasTropardi/clinica-ruby-react.git
cd clinica-front
```

2. Install dependencies:
```bash
npm install
```

3. Run the app:
```bash
npm run dev
```

4. The app will be available at `http://localhost:5173`.

## Environment Variables

Configure the backend API base URL in `src/services/api.ts`:
```ts
export const API_BASE_URL = 'http://localhost:3000';
```

## Authentication

- Login returns a JWT token stored in `localStorage`.
- The token is automatically added to authenticated requests.
- Role-based access determines route visibility and action permissions.

## License

This project is licensed for educational purposes only.