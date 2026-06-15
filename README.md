# 🩸 Apheresis — Smart Blood Bank & Donation Management System

Apheresis is an intelligent, secure web application designed to streamline blood donation tracking, inventory management, urgent request routing, and donation camp organization. It features a React-based frontend and a Spring Boot backend, utilizing role-based access control and AI assistant integration to provide structured workflows for donors, healthcare workers, and administrators.

---

## 🛠️ Tech Stack

*   **Frontend:** React 18, React Router DOM, Axios, Recharts, Lucide React, OpenStreetMap Embed
*   **Backend:** Spring Boot 4.x, Spring Security (JWT), Spring Data JPA, Hibernate, Dotenv Java, Spring Mail
*   **Database:** MySQL
*   **Reverse Proxy:** Nginx configuration support for reverse proxy routing

---

## ✨ Features

1.  **🤖 Gemini AI Chatbot**
    *   Powered by Google Gemini API (`gemini-2.5-flash-lite`).
    *   Provides conversational answers on donation eligibility, guidelines, and blood group compatibility.
    *   Enforces prompt templates to keep guidance medically safe.

2.  **⚡ Smart Match & Emergency Alerts**
    *   Scans database inventory immediately upon request submission to verify blood group and component availability.
    *   Prints a log alert in console logs when inventory is insufficient for Urgent/Critical requests, checking for registered Emergency Donors.

3.  **⏱️ Component-Specific Cooldowns**
    *   Manages health-safeguard donation cooldown periods depending on the component type logged:
        *   **Platelets:** 7 days
        *   **Plasma:** 28 days
        *   **Whole Blood & RBC (Default):** 56 days
        *   **Super Red:** 112 days
    *   Updates donor profile eligibility automatically.

4.  **🔒 Security & Encryption**
    *   **AES-128 Encryption:** Securely encrypts sensitive user Government IDs before database insertion.
    *   **JWT Security:** Implements stateless role-based authentication (`ROLE_ADMIN`, `ROLE_WORKER`, `ROLE_USER`).
    *   **Forgot Password:** Generates a temporary reset token that expires in 2 minutes, rate-limited to 5 attempts per user per day. Sending is done using JavaMailSender.
    *   **Account Constraints:** Prevents creating more than 10 administrators and blocks admins from deleting their own accounts.

5.  **📊 Role-Based Dashboards**
    *   **Admin Dashboard:** Charts showing live stock and request analytics (auto-refreshes every 30 seconds via Recharts). Enables managing user roles and camp requests.
    *   **Worker Dashboard:** Tools for request approvals/rejections, inventory status filtering, and cleanup of expired units (42 days shelf life).
    *   **Donor Dashboard:** Tracking of user donation logs, eligibility dates, and previous blood requests.

6.  **🗺️ OpenStreetMap Map Embed**
    *   Embedded map coordinates centered around local center (`26.8006`, `81.0253`) to find blood donation camp drives.

7.  **⏱️ Automated Notification Scheduler**
    *   Includes a background cron job scheduled to run daily to check which donors have passed their cooldown threshold.

8.  **🏷️ Government Officer Incentive**
    *   Checks if the user profile is marked as a government officer (`isGovtOfficer`) and logs a special 20% discount on final blood requests once fulfilled.

---

## 📂 Folder Structure

```
Apheresis/
├── backend/                  # Spring Boot Java Application
│   ├── pom.xml               # Maven configuration & dependencies
│   └── src/main/java/com/bloodbank/
│       ├── controller/       # API endpoints (Auth, Inventory, Requests, Camps, Chatbot)
│       ├── entity/           # JPA Entities (User, Donation, BloodUnit, BloodRequest, CampRequest)
│       ├── repository/       # Database query interfaces
│       ├── service/          # Core Business logic (Auth, Email, Gemini AI)
│       ├── scheduler/        # Background cron jobs (NotificationScheduler)
│       ├── security/         # JWT parsing and Spring Security configurations
│       └── util/             # Helpers (AES EncryptionUtil)
├── frontend/                 # React UI Application
│   ├── package.json          # Node scripts & dependency definitions
│   └── src/
│       ├── components/       # Reusable components (Chatbot, OpenStreetMap, Layouts)
│       ├── pages/            # View components (Admin, Worker, User, Auth, Public)
│       └── services/         # Axios API interceptor configurations
├── nginx.conf                # Local reverse proxy settings
└── .env                      # Global environment configurations
```

---

## ⚙️ Configuration & Setup

### Prerequisites
*   **Java SDK:** JDK 21 installed.
*   **Node.js:** v18+ installed.
*   **MySQL Server:** Running on port `3306`.
*   **Gemini API Key:** Obtained from Google AI Studio.

### Step 1: Environment Variables
Create a `.env` file in the root workspace directory with the following variables:
```env
JWT_SECRET=your_long_secure_jwt_secret_key_here
ENCRYPTION_KEY=MySuperSecretKey  # Must be exactly 16 characters!
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
DB_PASSWORD=your_mysql_root_password
GEMINI_API_KEY=your_gemini_api_key
```

### Step 2: Database Initialization
Run the following SQL statement in your MySQL client to prepare the database schema:
```sql
CREATE DATABASE blood_bank_db;
```

---

## 🚀 Running the Application

### Running the Backend
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Launch the Spring Boot development server:
    ```bash
    ./mvnw spring-boot:run
    ```
    The server starts on port `8080`. Hibernate will build/update the tables inside the database automatically.

### Running the Frontend
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the required packages:
    ```bash
    npm install
    ```
3.  Start the local dev environment:
    ```bash
    npm start
    ```
    The application will automatically launch on `http://localhost:3000`.
