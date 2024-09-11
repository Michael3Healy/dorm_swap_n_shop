# Dorm Swap 'n' Shop

Dorm Swap 'n' Shop is a comprehensive application for managing and exchanging items within a university community. It features a backend built with Node, Express, and PostgreSQL, and a frontend using React. This application allows users to browse items, post listings, and manage transactions through an intuitive interface.

## Table of Contents

- [Link to Live Site](https://dorm-swap-n-shop-frontend.onrender.com/)
- [Backend Features](#backend-features)
  - [Authentication \& Authorization](#authentication--authorization)
  - [Companies \& Items](#companies--items)
  - [Transactions](#transactions)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [Backend Setup](#backend-setup)
- [Frontend Features](#frontend-features)
  - [User Interface](#user-interface)
  - [Authentication](#authentication)
  - [Item Search \& Filtering](#item-search--filtering)
  - [Responsive Design](#responsive-design)
  - [State Management](#state-management)
- [Frontend Setup](#frontend-setup)
- [Technologies Used](#technologies-used)
  - [Backend](#backend)
  - [Frontend](#frontend)

## Backend Features

### Authentication & Authorization

- Utilizes JWT tokens for secure access to API endpoints.
- Implements role-based permissions to control access levels.

### Companies & Items

- Supports CRUD operations for managing items and posts.
- Provides advanced filtering and search functionalities for items.

### Transactions

- Allows users to complete transactions and update seller ratings.
- Tracks transaction history and integrates with user profiles.

### Testing

- Includes comprehensive unit and integration tests to ensure robust functionality and maintainable codebase.

### Documentation

- Extensively documented codebase with clear explanations of functions and routes.

## Backend Setup

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Set up environment variables as required (e.g., database configuration, JWT secret).
5. Run tests using: `npm test`
6. Start the server: `npm start`

## Frontend Features

### User Interface

- Built with React to provide a dynamic and responsive user experience within a single-page application.
- Utilizes React Router for seamless navigation between pages.

### Authentication

- Implements login, signup, and logout functionalities.
- Manages user sessions and displays user-specific information.

### Item Search & Filtering

- Features a search bar for querying items and posts.
- Displays item cards with details like item name, description, and location.

### Item Details

- Provides detailed information about each item, including images, price, and seller information.*
- Uses GoogleMaps API to display the location of the item.

### Responsive Design

- Uses Bootstrap and modern CSS techniques to ensure the application is accessible and visually appealing across different devices.

### State Management

- Manages application state effectively with React's built-in state management features as well as custom hooks.
- Uses local storage for persisting user sessions.

## Frontend Setup

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Set up environment variables if needed.
5. Run tests using: `npm test`
6. Start the development server: `npm start`

## Technologies Used

### Backend

- Node
- Express
- PostgreSQL
- JWT
- Jest

### Frontend

- React
- React Router
- Axios
- Bootstrap
- Jest
- React Testing Library

*This application is deployed on Render, which uses ephemeral storage for its server instances. This means that any files uploaded to the server (e.g., images) are stored temporarily and will be lost when the server restarts. As a result, images uploaded for items or users will not persist. A future solution will be to incorporate a cloud storage service, such as Amazon S3.
