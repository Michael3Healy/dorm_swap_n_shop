# Dorm Swap 'n' Shop

Dorm Swap 'n' Shop is a comprehensive application for managing and exchanging items within a university community. It features a backend built with Node, Express, and PostgreSQL, and a frontend using React. This application allows users to browse items, post listings, and manage transactions through an intuitive interface.

## Table of Contents

- [Link to Live Site](http://dgd6mwd26zyub.cloudfront.net)
- [Backend Features](#backend-features)
  - [Authentication \& Authorization](#authentication--authorization)
  - [Companies \& Items](#companies--items)
  - [Transactions](#transactions)
  - [Testing](#testing)
  - [Documentation](#documentation)
  - [Backend Deployment](#backend-deployment)
- [Backend Setup](#backend-development-setup)
- [Frontend Features](#frontend-features)
  - [User Interface](#user-interface)
  - [Authentication](#authentication)
  - [Item Search \& Filtering](#item-search--filtering)
  - [Responsive Design](#responsive-design)
  - [State Management](#state-management)
  - [Frontend Deployment](#frontend-deployment)
- [Frontend Setup](#frontend-development-setup)
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

### Backend Deployment

- The backend is deployed on AWS Elastic Beanstalk, which provides an easy-to-manage and reliable environment for scaling and running the server.
  It connects to a SupaBase PostgreSQL database to store application data.

## Backend Development Setup

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

- Provides detailed information about each item, including images, price, and seller information.
- Uses GoogleMaps API to display the location of the item.

### Responsive Design

- Uses Bootstrap and modern CSS techniques to ensure the application is accessible and visually appealing across different devices.

### State Management

- Manages application state effectively with React's built-in state management features as well as custom hooks.
- Uses local storage for persisting user sessions.

### Frontend Deployment

- The frontend is deployed as a static React app using AWS S3 and AWS CloudFront. The app's static files are uploaded to an S3 bucket configured for public access,
  enabling static website hosting. AWS CloudFront acts as a Content Delivery Network (CDN), caching and serving the files from edge locations globally to ensure fast and
  secure delivery.

## Frontend Development Setup

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
