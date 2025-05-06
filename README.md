# 🦷 Basic Patient Booking System

A simple full-stack application for managing dental appointments, built with **Spring Boot** and **Vite + React**. The system allows users to **Create, Read, Update, and Delete (CRUD)** patient appointments, with access and permissions depending on the user's role.

This project simulates a dental clinic appointment system set in **Mandaue City, Philippines**.

---

## 📌 Features
- Role-based appointment management (CRUD)
- Responsive front-end using Vite + React
- Secure REST API powered by Spring Boot
- MySQL database integration
- Realistic simulation of a local dental clinic service

---

## ⚙️ Dependencies

### 🔙 Backend
- **Spring Web** – For building REST APIs  
- **Spring Data JPA** – For database interaction  
- **Spring Security** – For authentication and authorization  
- **MySQL Driver** – For MySQL database connectivity  
- **Lombok** *(optional)* – For reducing boilerplate code  
- **Validation** *(optional)* – For request input validation  

### 🔜 Frontend
- **axios** – For making HTTP requests to the backend  
- **react-router-dom** – For client-side routing/navigation  
- **react-datepicker** – For selecting appointment dates  
- **date-fns** – For date formatting and manipulation (a lightweight alternative to Moment.js)  

---

## 💻 Running the App Locally

### NOTE: THERE IS NO INITIALIZED DATA FOR THE DOCTORS
YOU HAVE TO REGISTER AS A DOCTOR FIRST BEFORE YOU REGISTER AS A PATIENT (WILL ADD FAKE DATA SOON)

### 1. 🛠 Backend Setup (Spring Boot)
> Make sure MySQL is installed and running on your machine.

1. Open the project in **IntelliJ** (or your preferred IDE).
2. Make sure your `application.properties` (or `application.yml`) file has the correct MySQL configuration.
3. Locate the `DentalApplication.java` file (usually in `src/main/java/com/dentalHCI/dental/DentalApplication.java`).
4. Right-click the file and choose `Run 'DentalApplication.main()'` to start the backend API server.

The backend should now be running on `http://localhost:9080`.

---

### 2. 🎨 Frontend Setup (Vite + React)

> Make sure you have the latest version of node installed
1. Open a terminal in the frontend project folder.
2. Install dependencies:

```poweshell
npm install
```

3. Start the development server:

```poweshell
npm run dev
```

The frontend should now be running on http://localhost:5173 

## 👥 Project Members
- **Robert Bamba**
- **Shifra Garcia**
- **Farrah Manalegro**
- **Hannah A. Hontiveros**
- **Ken Mandrinan**