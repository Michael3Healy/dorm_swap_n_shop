"use strict";

const express = require("express");
const cors = require("cors");
const path = require('path')
const fs = require('fs')

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/users')
const itemRoutes = require('./routes/items')
const postRoutes = require('./routes/posts')
const locationRoutes = require('./routes/locations')
const transactionRoutes = require('./routes/transactions')

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

// Check if the file exists before serving it
app.get('/uploads/:filename', (req, res, next) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file doesn't exist, return a default image
      console.log(`File ${req.params.filename} not found. Serving default image.`);
      return res.sendFile(path.join(__dirname, 'uploads', 'default-pic.png')); // Path to your default image
    }

    // If file exists, continue to the next middleware (which is express.static)
    next();
  });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/auth", authRoutes);
app.use('/users', userRoutes)
app.use('/items', itemRoutes)
app.use('/posts', postRoutes)
app.use('/locations', locationRoutes)
app.use('/transactions', transactionRoutes)


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
