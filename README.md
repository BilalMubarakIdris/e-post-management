# Web-Based E-Post Management System

A web-based correspondence management system built with Node.js, Express.js, EJS, MongoDB, and Tailwind CSS v4. This system helps organizations manage incoming and outgoing correspondence electronically with features for registration, routing, tracking, notifications, and reporting.

## Features

- **User Authentication & Authorization** - Role-based access control (Admin, Registry Officer, Department Officer, Management)
- **Incoming Correspondence** - Register, track, and manage incoming mail/documents
- **Outgoing Correspondence** - Register and manage outgoing mail/documents
- **Correspondence Routing** - Assign and forward correspondence to users/departments
- **Tracking System** - Complete audit trail of correspondence movement
- **Notifications** - Real-time notifications for assignments and updates
- **Search & Reports** - Generate reports with filtering by type, date, department, status
- **Document Management** - Upload and attach documents to correspondence
- **Audit Logs** - Track all system activities
- **Department & User Management** - Admin controls for users and departments

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **View Engine:** EJS with express-ejs-layouts
- **Styling:** Tailwind CSS v4
- **Authentication:** express-session, bcryptjs
- **File Upload:** Multer
- **Other:** Helmet, Morgan, connect-flash, method-override

## Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

### Setup

1. **Clone/Navigate to project directory**
```bash
cd "Idris Project"
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
copy .env.example .env
```
Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/epost_management
SESSION_SECRET=your_secure_random_string_here
BASE_URL=http://localhost:3000
```

4. **Build CSS**
```bash
npm run build:css
```

5. **Seed admin user / Make first user admin**
```bash
npm run seed:admin
```

**Admin Login Details:**
- **Username:** `admin`
- **Password:** `admin123`

*Note:* If users already exist in the database, running `seed:admin` will automatically make the **first registered user** an administrator.

6. **Run the application**

Development mode (with auto-reload using nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

7. **Access the application**
Open your browser and navigate to `http://localhost:3000` and login with the admin credentials above

## User Roles

| Role | Permissions |
|---|---|
| **Admin** | Full system access - manage users, departments, all correspondence, audit logs, reports |
| **Registry Officer** | Register incoming/outgoing correspondence, assign/forward, generate reports |
| **Department Officer** | View assigned correspondence, update status, forward, process documents |
| **Management** | View correspondence and generate reports |

## Project Structure

```
Idris Project/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth, audit, upload middleware
│   ├── models/         # Mongoose models
│   ├── public/         # Static files (CSS, JS, uploads)
│   ├── routes/         # Express routes
│   ├── scripts/        # Utility scripts (seed)
│   ├── utils/          # Helper functions
│   └── views/          # EJS templates
├── server.js           # Application entry point
└── package.json
```

## Usage

1. Login with admin credentials
2. Create departments
3. Add users with appropriate roles
4. Start registering incoming/outgoing correspondence
5. Assign/forward correspondence as needed
6. Track progress through the system
7. Generate reports as required

## Notes

- File uploads are stored in `src/public/uploads/`
- All passwords are hashed using bcryptjs
- Sessions are managed with express-session
- Audit logs track user activities

## License

ISC
