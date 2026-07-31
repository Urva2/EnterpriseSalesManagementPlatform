# 🏢 Enterprise Sales Management Platform (Sale Entry App)

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

A robust, B2B sales and inventory management application built with **Spring Boot** and **React**. This platform streamlines the end-to-end order processing lifecycle, featuring secure Role-Based Access Control (RBAC), transactional cart management, and real-time inventory deduction.

## ✨ Key Features

### 🔐 Security & Architecture
* **Role-Based Access Control (RBAC):** Secure API endpoints using Spring Security and JWT. Strictly isolates Admin and Salesperson workflows.
* **Transactional Integrity:** Enforces ACID properties using Spring Data JPA during concurrent stock deductions and order state transitions to prevent race conditions.
* **Optimized Data Transfer:** Integrates MapStruct for efficient DTO mapping, reducing API payload size and improving response times.

### 👔 Admin Module (Inventory Management)
* Complete control over the product catalog.
* Register new products (Name, Weight, Price, Stock Quantity).
* Update existing inventory details and pricing.

### 🧑‍💼 Salesperson Module (Order Processing)
* **Customer Management:** Register and view client profiles.
* **Cart Management:** Create orders, add/remove items, and dynamically adjust quantities.
* **Automated Inventory:** Real-time stock deduction upon adding items to the cart.
* **Analytics:** Filter past orders by status, customer, or date, and calculate total salesperson revenue.

---

## 🛠️ Technology Stack

**Backend:**
* Java 17
* Spring Boot (Web, Data JPA, Security, Validation)
* JSON Web Tokens (JWT) for Authentication
* MySQL & Hibernate
* MapStruct & Lombok
* Maven

**Frontend:**
* React.js (Vite)
* React Router DOM
* Vanilla CSS (Responsive Design)

---

## 📊 Database Schema (ER Diagram)

```mermaid
erDiagram
    ADMIN {
        int id PK
        string name
        string email
        string password
        string role
    }
    SALESPERSON {
        int id PK
        string name
        string email
        string password
        string role
        string phoneno
    }
    CUSTOMER {
        int id PK
        string name
        string address
        string phoneno
    }
    PRODUCT {
        int id PK
        string name
        string itemWeight
        double price
        int stockQuantity
    }
    SALEORDER {
        int id PK
        date date
        double total
        string status
    }
    ORDERITEM {
        int id PK
        string name
        int quantity
        double price
        double subtotal
    }

    SALESPERSON ||--o{ SALEORDER : "creates"
    CUSTOMER ||--o{ SALEORDER : "places"
    SALEORDER ||--o{ ORDERITEM : "contains"
    PRODUCT ||--o{ ORDERITEM : "is added as"
