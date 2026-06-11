<div align="center">
  <img src="./frontend/public/navape-logo.svg" alt="NavaPe Logo" width="80" />
  <h1>NavaPe</h1>
  <p><strong>A digital payment app built to test backend security and transactions.</strong></p>
  <p>
    <a href="https://navape.vercel.app"><strong>https://navape.vercel.app</strong></a>
  </p>
</div>

## Overview
NavaPe is a project I built to understand how apps like Paytm or PhonePe actually work behind the scenes. Instead of just saving data to a database like a normal web app, I focused heavily on making the money transfers safe. It handles real-world problems like stopping two payments from happening at the exact same time, securing user PINs, and using a fake payment gateway for adding funds.

## How it Works & Security Features

### 1. Stopping "Double-Spending" (Database Locking)
One big problem I had to solve was: what if a user has ₹1000 and tries to send ₹600 twice at the exact same millisecond? A normal database might get confused, approve both, and leave the user with a negative balance. 

To fix this, I used **PostgreSQL Row-Level Locking**. Basically, when one transfer starts, the database "locks" that user's row. If a second request comes in at the same time, it is forced to wait in line until the first one is completely done. If the balance drops too low after the first transaction, the second one just fails.

### 2. Fake Payment Gateway & Signatures
Since I can't connect to real banking APIs yet, I built a mock (fake) payment gateway. When you add money to your wallet, the server generates an Order ID and a Payment ID. I used `HMAC-SHA256` to create a secret signature. This makes sure that nobody can hack or change the payment amount while the data is traveling from the frontend to the backend.

### 3. Password Security & Rate Limiting
Passwords and 4-digit financial PINs are securely hashed using `bcryptjs`, so even if someone looks at the database, they can't see the real PINs. Also, to stop hackers from guessing PINs by trying hundreds of times, I added a rate-limiter. If someone fails to log in or transfer money 5 times, that IP address gets blocked for 15 minutes.

## Tech Stack Used

* **Frontend:** React.js (Vite), Tailwind CSS, Axios
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL, Sequelize ORM
* **Security:** JWT for sessions, bcryptjs, crypto

---

## How to Run This on Your Computer

### 1. Setup the Database
Make sure you have PostgreSQL installed and running. Open your terminal or pgAdmin and run:
```sql
CREATE DATABASE navape_db;
```

### 2. Start the Backend
Open a terminal, go to the `backend` folder, and install the packages:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add your database details (or use a cloud database link if you have one):
```env
PORT=8000
DB_NAME=navape_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=put_any_secret_string_here
GATEWAY_SECRET=put_another_secret_string_here
```

Start the backend server:
```bash
npm run dev
```

### 3. Start the Frontend
Open a new terminal, go to the `frontend` folder, and start the React app:
```bash
cd frontend
npm install
```
Create a .env file in the frontend folder: 
```env
VITE_API_URL=http://localhost:8000/api
```

now do:
```bash
npm run dev
```
Now, just open `http://localhost:5173` in your browser and the app should be running!

---

## Testing the API (Swagger UI)

I also set up a Swagger UI dashboard. It's basically a testing page for the backend where you can see all the routes and test the API without even opening the React frontend.

Once your backend server is running, go to: **`https://navape-backend.onrender.com/api-docs`**

To test your Local API (if running locally): **`http://localhost:8000/api-docs`**

**How to test secure routes like money transfers:**

1. Open the `POST /api/auth/login` section and click **Try it out**.
2. Enter your email and password, then click **Execute**.
3. In the server response, copy the long `token` string.
4. Go to the top of the page, click the green **Authorize** button, paste your token, and click **Authorize**. Now you can test all the money transfer routes directly from the dashboard!