# 🔐 Login System with Express, Bcrypt, and JWT

A simple authentication system built with **Node.js**, **Express.js**, **bcrypt**, and **JSON Web Tokens (JWT)**. This project demonstrates how modern applications handle user registration, password hashing, login, and protected routes.

---

## 🚀 Features

- User Registration
- Password Hashing using bcrypt
- User Login
- JWT Token Generation
- Protected Routes
- Authentication Middleware
- Token Verification
- In-memory User Storage
- Error Handling

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- bcrypt
- jsonwebtoken

---

## 📂 Project Structure

```
Login System
│
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/4bhimxnyu/Everything-I-Need-To-Learn.git
```

### Navigate to the project folder

```bash
cd "Everything-I-Need-To-Learn/Login System"
```

### Install dependencies

```bash
npm install
```

### Start the server

```bash
node server.js
```

Server will run on:

```text
http://localhost:3000
```

---

## 📌 API Endpoints

### Home Route

#### GET /

Returns:

```json
{
    "message": "Welcome to the login system"
}
```

---

## Register User

### POST /register

Request Body:

```json
{
    "username": "abhimanyu",
    "password": "password123"
}
```

Response:

```json
{
    "message": "User has been registered successfully"
}
```

---

## Login User

### POST /login

Request Body:

```json
{
    "username": "abhimanyu",
    "password": "password123"
}
```

Response:

```json
{
    "message": "Login successful",
    "token": "<JWT_TOKEN>"
}
```

---

## Protected Routes

These routes require a valid JWT token.

### GET /profile

### GET /settings

### GET /dashboard

Add the token in Postman:

```
Authorization: Bearer <JWT_TOKEN>
```

Response:

```json
{
    "message": "Welcome to your profile",
    "user": {
        "username": "abhimanyu"
    }
}
```

---

## Authentication Flow

```
Register
    ↓
Password gets hashed using bcrypt
    ↓
User logs in
    ↓
JWT token generated
    ↓
Client sends token
    ↓
Middleware verifies token
    ↓
Access granted to protected routes
```

---

## Dependencies

Install manually:

```bash
npm install express
npm install bcrypt
npm install jsonwebtoken
```

Or:

```bash
npm install express bcrypt jsonwebtoken
```

---

## Future Improvements

- [ ] MongoDB Integration
- [ ] Mongoose Models
- [ ] Refresh Tokens
- [ ] Role-Based Authorization
- [ ] Environment Variables using dotenv
- [ ] Password Reset Feature
- [ ] Email Verification
- [ ] Logout Functionality
- [ ] User Profile Update
- [ ] Rate Limiting
- [ ] Session Management

---

## Learning Objectives

This project helped in understanding:

- Express Routing
- Middleware
- REST APIs
- Password Hashing
- JWT Authentication
- Authorization
- Request Headers
- Async/Await
- Error Handling

---

## Author

**Abhimanyu**

GitHub: https://github.com/4bhimxnyu

---

⭐ If you found this project useful, consider giving it a star.