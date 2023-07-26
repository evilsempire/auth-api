import express, { Router, Request, Response } from "express";
import nodemailer from "nodemailer";

import logger from "../utils/logger";
const Model = require("../models/model");

const router: Router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_SERVER_EMAIL,
    pass: process.env.SMPT_SERVER_PASSWORD,
  },
});

router.post("/forgot-password", (req: Request , res: Response) => {
  const { email }  = req.body;
  try {
    if (!email) {
     logger.info("email is empty")
      return res.status(422).json({ error: "Email is required!" }); //status 422 means server has understood the request but cant proess
    }
    logger.info("Finding User based on email provided.")
    Model.find({ email }).then(async (savedUser) => {
      if (!savedUser.length) {
        logger.info("User does not exist in database.");
        return res.status(422).json({ error: "user does not exists." });
      }

      logger.info("Generating email object for mail")
      const mailData: object = {
        from: "auth-api@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Reset your password",
        text: "That was easy!",
        html: `<b>Hello ${savedUser[0].username}! </b>
                   <br> Please click the link to reset password.<br/>`,
      };

      transporter.sendMail(mailData, function (err, info) {
        if (err) {
            logger.info("Error occurred while sending email");
            logger.error(`Error :${err.message}`);
            return res.status(400).json({ message: err.message });;
        };
        logger.info("Mail sent successfully.")
        res.send("Please check your email for resetting password.");
      });
    });
  } catch (error) {
    logger.info("Error occurred while password reset");
    logger.error(`Error :${error.message}`);
    
    res.status(400).json({ message: error.message });
  }
});

export default router;
