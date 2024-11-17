"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");
const multer = require('multer');
const path = require('path');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const upload = multer();

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/auth/userAuth.json");
const userRegisterSchema = require("../schemas/auth/userRegister.json");
const { BadRequestError } = require("../expressError");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})




// Set storage options for multer
// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, 'uploads/'); // The folder where the uploaded files will be stored
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Naming the file uniquely
// 	},
// });

// Set up multer to use the storage options
// const upload = multer({ storage: storage });

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 * 
 * Login endpoint
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email, isAdmin, phoneNumber }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", upload.single('profilePicture'), async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    let profilePictureUrl = req.file ? req.file.path : req.body.profilePicture;
    if (req.file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `user-images/${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      }

      const command = new PutObjectCommand(params);
      await s3.send(command); // Upload the file to S3
      profilePictureUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    }

    const newUser = await User.register({ ...req.body, profilePicture: profilePictureUrl, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
