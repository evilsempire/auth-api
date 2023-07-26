import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import logger from "../utils/logger";
const Model = require("../models/model");

const router: Router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    
    if (!username || !email || !password) {
      logger.info("Username or email or password is empty")
      return res.status(422).json({ error: "please add all the fields" }); //status 422 means server has understood the request but cant proess
    }

    Model.find({ email }).then(async (savedUser) => {
      
      if (savedUser.length) {
        logger.info("User already exist.")
        return res.status(422).json({ error: "user already exist." });
      }
      logger.info("New User found");
      const hashPassword: String = bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT_ROUNDS));

      const data = new Model({
        username,
        email,
        password: hashPassword,
      });
      const dataToSave = await data.save();
      logger.info("User saved successfully to database");
      res.status(201).json(dataToSave);
    });
  } catch (error) {
    logger.info("Error occurred while register user");
    logger.error(`Error :${error.message}`);
    
    res.status(400).json({ message: error.message });
  }
});

export default router;
