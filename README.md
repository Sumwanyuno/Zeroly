# 🚀 Zeroly - Community Reuse Platform

> Welcome to the official repository for the Zeroly project, a smart, interactive platform to turn unused goods into community good. This project was built for the **Triwizardthon hackathon** by the **Dumbledore Devs** team.

## 🌟 About the Project

Zeroly is a hyperlocal platform where people can give away, request, or swap usable items with others nearby. Our core idea is to promote a **zero-waste lifestyle** by enabling quick, safe, and rewarding community reuse.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Image Uploads:** Cloudinary
- **Authentication:** JWT (JSON Web Tokens)

---

## 🏁 Getting Started

To get the project running locally, each team member must follow these steps.

### Prerequisites

- Node.js (v18 or later)
- `npm`
- A personal MongoDB Atlas account (Free Tier)
- A personal Cloudinary account (Free Tier)

---

### 🖥️ Backend Setup

1.  **Navigate to the `server` directory:**
    ```bash
    cd server
    ```
2.  **Install all backend dependencies:**
    ```bash
    npm install
    ```
3.  **Create your own `.env` file** in the `server` directory. Copy the structure below and replace the placeholder values with **your own secret keys**.

    ```
    MONGO_URI=your_mongodb_connection_string_here
    JWT_SECRET=a_long_random_secret_string
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    > The backend will now be running on `http://localhost:5000`.

---

### 🎨 Frontend Setup

1.  **Open a new terminal**. Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  **Install all primary frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Install additional required packages:**
    _(Note: These should be included by `npm install`, but run these commands if you encounter errors related to routing or styling)._

    ```bash
    # For page navigation
    npm install react-router-dom

    # For styling with Tailwind CSS
    npm install -D tailwindcss @tailwindcss/vite
    ```

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    > The frontend will now be running on `http://localhost:5173`.

---

## 🧑‍💻 The Team

- **Samarth Khare** (Leader)
- **Sneha**
- **Shivam Gupta**
- **Prateek Amar Batham**
