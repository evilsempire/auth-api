import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import logger from "../utils/logger";
const Model = require("../models/model");

const router: Router = express.Router();

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      logger.info("email or password is empty")
      return res.status(422).json({ error: "please add all the fields" }); //status 422 means server has understood the request but cant proess
    }
    logger.info("Finding User based on email provided.")

    Model.find({
      email,
    }).then(async (savedUser) => {
      if (!savedUser.length) {
        logger.info("User does not exist in database.");
        return res.status(422).json({ error: "user does not exists." });
      }
      logger.info("Comparing password provided from request");
      bcrypt.compare(password, savedUser[0].password, function (err, result) {

        if (result) {
          const token = jwt.sign(
            { user_id: savedUser[0]._id, email },
            `process.env.ACCESS_TOKEN_SECRET`,
            {
              expiresIn: "1h",
            }
          );
          const refreshToken = jwt.sign(
            {
              username: savedUser[0].username,
            },
            `process.env.REFRESH_TOKEN_SECRET`,
            { expiresIn: "1d" }
          );

          // Assigning refresh token in http-only cookie
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          
          logger.info("Generating token for user.");
          res.send(token);
        }else{
            logger.error("Wrong password entered.");
            return res.status(422).json({ error: "Wrong password entered." });
        }
      });
    });
  } catch (error) {
    logger.info("Error occurred while logging");
    logger.error(`Error :${error.message}`);
    res.status(400).json({ message: error.message });
  }
});

export default router;
