# Zeroly - Community Reuse Platform

Welcome to the official repository for the Zeroly project, a smart, interactive platform to turn unused goods into community good. This project was built for the Triwizardthon hackathon by the Dumbledore Devs team.

## About the Project

Zeroly is a hyperlocal platform where people can give away, request, or swap usable items with others nearby. Our core idea is to promote a zero-waste lifestyle by enabling quick, safe, and rewarding community reuse.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Image Uploads:** Cloudinary
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

To get the project running locally, follow these steps:

### Prerequisites

- Node.js (v18 or later)
- npm
- A MongoDB Atlas account
- A Cloudinary account

### Backend Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory and add your secret keys:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_URL=your_cloudinary_url
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    The backend will be running on `http://localhost:5000`.

### Frontend Setup

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the client:
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173`.

## Team

- Samarth (Leader)
- Sneha
- Shivam Gupta
- Prateek Amar Batham
