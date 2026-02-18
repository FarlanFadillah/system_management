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

