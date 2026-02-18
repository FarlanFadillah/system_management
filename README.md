## 🏛️ System Management Law Office

**System Management Law Office** is a backend-focused REST API designed to manage law office operations such as client data, legal cases, land ownership (Alas Hak), and administrative regional hierarchy.

This project is built using a **feature-based architecture**, where each business domain is modularized into its own isolated feature module, improving scalability, maintainability, and clarity.

---

### 🧱 Architecture: Feature-Based

Instead of separating by technical layer globally (controllers, services, routes, etc.), this project organizes code by **feature/domain**:

```
/modules
  /clients
    client.controller.js
    client.service.js
    client.repository.js
    client.route.js
  /alas-hak
  /address
  /auth
```

Each feature encapsulates:

* Controller layer (HTTP handling)
* Service layer (business logic)
* Repository layer (database abstraction)
* Routes definition

This approach:

* Makes the system scalable as features grow
* Reduces tight coupling between domains
* Improves maintainability
* Encourages clean domain boundaries

---

### 🚀 Features

* 🔐 Authentication & authorization using JWT
* 👤 Client management (CRUD)
* 📂 Case management #TODO
* 🏞️ Land ownership (Alas Hak) management
* 🗺️ Administrative region hierarchy (Province → Regency → District → Village)
* 🔎 Case-insensitive search
* 🧾 Validation & centralized error handling

---

### 🛠️ Tech Stack

* Node.js
* Express.js
* Knex.js
* SQLite
* RESTful API

---

### 🎯 What This Project Demonstrates

* Feature-based modular backend architecture
* Proper async handling
* Repository & service layer separation
* Clean error propagation pattern
* Real-world relational database modeling


## ⚙️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/feature_base_architecture.git
cd feature_base_architecture
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_CLIENT=sqlite3
DB_FILENAME=./main.sqlite3
JWT_SECRET=your_secret_key
```

Make sure to adjust the values based on your environment.

---

### 4️⃣ Run Database Migration

```bash
npx knex migrate:latest
or
npm run migrate
```

If using seeds:

```bash
npx knex seed:run
```

---

### 5️⃣ Start the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

---

### 6️⃣ API Testing

You can test the API using:

* Postman
* Insomnia
* Thunder Client (VS Code extension)

Default base URL:

```
http://localhost:3000
```

---

## 🗂️ Project Structure (Feature-Based)

```
/modules
  /clients
  /auth
  /alas-hak
  /address
/dbs
```


# 🌐 How to Use the REST API

## 📌 Base URL

```bash
http://localhost:3000/api/v1****
```

---

## 🔐 1. Authentication

Before accessing protected routes, you need to authenticate.

### Register

**POST** `/auth/register`

```json
{
  "username": "admin",
  "password": "password123"
}
```

---

### Login

**POST** `/auth/login`

```json
{
  "username": "admin",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "your_jwt_token_here"
}
```

---

## 🔑 Using Protected Routes

For endpoints that require authentication, include the JWT token in the header:

```
Authorization: Bearer your_jwt_token_here
```

---

## 👤 2. Clients

### Create Client

**POST** `/clients`

```json
{
    "first_name": "Farlan",
    "last_name" : "Fadillah",
    "nik": 1305xxxxxxxxxxxx,
    "birth_date": "2001-08-29",
    "birth_place" : "Duri",
    "job_name" : "Pelajar/Mahasiswa",
    "address_code" : "13.07.05.2007",
    "marriage_status" : "belum kawin",
    "gender" : "pria"
}
```

---

### Get All Clients

**GET** `/clients?currentpage=0`

Optional query:

```
/clients?search=farlan
```

---

### Get Client by ID

**GET** `/clients/:id`

---

### Update Client

**PUT** `/clients/:id`

---

### Delete Client

**DELETE** `/clients/:id`

---

## 🏞️ 3. Alas Hak (Land Ownership)

### Create Alas Hak

**POST** `/alas-hak`

```json
{
  "certificate_number": "AH-001",
  "area_size": 120,
  "location": "Pekanbaru"
}
```

---

### Assign Owner to Alas Hak

**POST** `/alas-hak/:id/owners`

```json
{
  "clients_id": [1, 2]
}
```

---

## 🗺️ 4. Administrative Regions

### Get Provinces

**GET** `/regions/provinces`

### Get Regencies by Province

**GET** `/regions/regencies/:province_id`

### Get Districts by Regency

**GET** `/regions/districts/:regency_id`

---

# 🧪 Testing With cURL (Example)

```bash
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer your_token_here"
```

---

# 📖 API Design Principles

This API follows:

* RESTful resource naming
* Proper HTTP methods (GET, POST, PUT, DELETE)
* JSON request & response format
* JWT-based authentication
* Structured error handling

---

If you want to level this up 🔥 you can:

* Add status codes documentation (200, 201, 400, 401, 404)
* Add response format standardization
* Generate Swagger / OpenAPI docs
* Add Postman collection export

If you show me your exact route structure, I can make this 100% accurate to your actual implementation.
