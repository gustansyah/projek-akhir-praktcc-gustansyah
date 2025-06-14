# Fullstack E-commerce Application
**Projek Akhir Praktikum Cloud Computing - Gustansyah Dwi Putra**

## 🚀 Live Demo
- **Frontend**: https://fullstack-frontend-462458321784.us-central1.run.app
- **Backend API**: https://fullstack-backend-ibwvmdtr7q-uc.a.run.app

## 📋 Assignment Requirements Completed

### ✅ Backend & Frontend with REST API
- **Backend**: Express.js API deployed on Google Cloud Run
- **Frontend**: React.js application deployed on Google Cloud Run
- **Connection**: REST API communication between frontend and backend

### ✅ Database with 3 Tables
1. **Users Table**: Authentication (login, register, logout)
2. **Categories Table**: CRUD operations for product categories
3. **Products Table**: CRUD operations for products

### ✅ JWT Authentication
- User registration and login system
- JWT token-based authentication
- Protected routes for CRUD operations

### ✅ ORM Implementation
- **Sequelize ORM** for database operations
- Model definitions and associations
- Database migrations and synchronization

### ✅ Technology Stack
- **Backend**: ExpressJS (as required)
- **Frontend**: React.js (web-based as required)
- **Database**: MySQL (SQL database as required)

### ✅ Cloud Deployment
- **Backend**: Deployed on Google Cloud Run
- **Frontend**: Deployed on Google Cloud Run
- **Database**: Cloud SQL ready (currently using local MySQL)

### ✅ CI/CD Pipeline
- **Cloud Build** configuration for automated deployment
- Dockerfile for containerization
- Build triggers for continuous deployment

### ✅ Cloud Storage
- Google Cloud Storage bucket configured
- Ready for image uploads and file storage

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Cloud Platform**: Google Cloud Run
- **CI/CD**: Google Cloud Build

### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: Custom CSS with responsive design
- **Deployment**: Google Cloud Run

### Database Schema
```sql
-- Users Table (Authentication)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table (CRUD)
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table (CRUD)
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  imageUrl VARCHAR(500),
  categoryId INT NOT NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);