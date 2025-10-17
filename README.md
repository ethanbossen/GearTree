# 🎸 GearTree

GearTree is a **full-stack web application** for exploring, managing, and showcasing music gear.
It combines a **.NET backend** with a **React + Vite frontend**, connected to a SQL database.

---

## 🚀 Features

### Public Site

* **Artist Profiles** – Browse artists and their associated gear
* **Guitar Catalog** – Explore guitars by type, manufacturer, and year
* **Amplifier Catalog** – View amps with detailed specs and price ranges
* **Responsive UI** – Mobile-friendly layout with clean cards

### Admin Dashboard

* **Tabbed Management** – Separate tabs for Artists, Guitars, and Amps
* **Entity CRUD** – Create, edit, and delete records via API integration
* **Expandable Design** – Easy to add new gear categories (Pedals, Effects, etc.)

### Backend (.NET)

* **RESTful API** with Controllers for each entity
* **Entity Framework Core** for database access
* **DTOs & Validation** for consistent data contracts
* **Migrations** for versioned database updates

---

## 📂 Project Structure

```
GearTree Project/
├── GearTree/          # .NET backend
│   ├── Controllers/   # API endpoints
│   ├── Data/          # EF Core DbContext
│   ├── Dtos/          # Data transfer objects
│   ├── Helpers/       # Utility classes
│   ├── Migrations/    # EF Core migrations
│   ├── Models/        # Entity classes
│   └── Properties/
│
└── geartree-ui/       # React frontend
    ├── public/        # Static assets
    └── src/           # React + TS app source
```

---

## ⚡️ Tech Stack

* **Frontend**: React + TypeScript, Vite, Mantine, Lucide Icons, Framer Motion
* **Backend**: .NET 9 Web API (C#), Entity Framework Core
* **Database**: SQL Server (configurable in backend)

---

## 🛠️ Setup & Run Locally

You’ll need **two terminals** running side-by-side: one for the backend and one for the frontend.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/geartree.git
cd "GearTree Project"
```

---

### 2. Backend (.NET API)

From the `GearTree/` folder:

```bash
cd GearTree
dotnet restore
dotnet ef database update   # apply migrations
dotnet run
```

By default, the API runs at:

```
http://localhost:5262
```

---

### 3. Frontend (React UI)

From the `geartree-ui/` folder:

```bash
cd geartree-ui
npm install
npm run dev
```

By default, the UI runs at:

```
http://localhost:5173
```

---

### 4. Open the App

* Public catalog → `http://localhost:5173/`
* Admin dashboard → `http://localhost:5173/admin` The Admin Dashboard is a work in progress, I would like to be able to add other users but with current deployment cannot do so without giving access to the whole database, this is obviously problematic and is something I plan to change if I come back to it. Thanks!

---

## 📜 License

MIT License

---

