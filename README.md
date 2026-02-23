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

- Controller layer (HTTP handling)
- Service layer (business logic)
- Repository layer (database abstraction)
- Routes definition

This approach:

- Makes the system scalable as features grow
- Reduces tight coupling between domains
- Improves maintainability
- Encourages clean domain boundaries

---

### 🚀 Features

- 🔐 Authentication & authorization using JWT
- 👤 Client management (CRUD)
- 📂 Case management #TODO
- 🏞️ Land ownership (Alas Hak) management
- 🗺️ Administrative region hierarchy (Province → Regency → District → Village)
- 🔎 Case-insensitive search
- 🧾 Validation & centralized error handling

---

### 🛠️ Tech Stack

- Node.js
- Express.js
- Knex.js
- SQLite
- RESTful API

---

### 🎯 What This Project Demonstrates

- Feature-based modular backend architecture
- Proper async handling
- Repository & service layer separation
- Clean error propagation pattern
- Real-world relational database modeling

## ⚙️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/system_management
cd system_management
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
JWT_KEY=your_secret_key
```

Make sure to adjust the values based on your environment.

---

### 4️⃣ Run Database Migration

```bash
npx knex migrate:latest
or
npm run migrate
```

Fetch Wilayah.id.sqlite3 Database to main.sqlite3

Make sure to install sqlite3 tools on your device.

```bash
sqlite /dbs/main.sqlite3
ATTACH DATABASE /wilayah.id.sqlite3 as wilayah;
CREATE TABLE kelurahan AS SELECT * FROM wilayah.kelurahan;
CREATE TABLE kecamatan AS SELECT * FROM wilayah.kecamatan;
CREATE TABLE kabupaten AS SELECT * FROM wilayah.kabupaten;
CREATE TABLE provinsi AS SELECT * FROM wilayah.provinsi;
```

If using seeds:

```bash
npx knex seed:run
```

---

### 5️⃣ Start the Server

```bash
npm start
```

---

### 6️⃣ API Testing

You can test the API using:

- Postman
- Insomnia
- Thunder Client (VS Code extension)

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
    "password": "password123",
    "first_name": "your first name",
    "last_name": "your last name (optional)",
    "email": "your email address (optional)"
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

### Get All Clients with pagination

**GET** `/clients?currentpage=0&limit=10`

Optional query:

```
/clients/search?keyword=yourname&currentpage=0&limit=10
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
    "no_alas_hak": "03040804102576",
    "tgl_alas_hak": "2020-12-20",
    "no_surat_ukur": "02525/Ampang Gadang/2020",
    "tgl_surat_ukur": "2020-10-05",
    "luas": 125,
    "jor": "Ampang Gadang",
    "address_code": "13.06.07.2005",
    "jenis_hak_id": 0,
    "ket": "Proses Pemecahan"
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

### Get All Alas Hak with pagination

**GET** `/alas-hak?currentpage=0&limit=10`

Optional query:

```
/alas-hak/search?keyword=yourname&currentpage=0&limit=10
```

---

### Get Alas Hak by ID

**GET** `/alas-hak/:id`

---

### Update Client

**PUT** `/alas-hak/:id`

---

### Delete Client

**DELETE** `/alas-hak/:id`

---

---

# 📖 API Design Principles

This API follows:

- RESTful resource naming
- Proper HTTP methods (GET, POST, PUT, DELETE)
- JSON request & response format
- JWT-based authentication
- Structured error handling
