require('dotenv').config();
//packages
import express from "express";
import mongoose from "mongoose";
import logger from "./utils/logger";


//routes
import register from "./api/register";
import login from "./api/login";
import forgotPassword from "./api/forgot-password";


const app = express();

app.use(express.json());
mongoose.connect(process.env.DATABASE_CONNECTION_URL);
const database = mongoose.connection;

const PORT = process.env.PORT || 3000;
database.on("error", (error) => {
  logger.error(`error occured while connecting to database: ${error}`);
});

database.once("connected", () => {
  logger.info("Database Connection successful.");
});


app.get("/", (req, res) => {
  res.send("Application is working fine");
  logger.info("Application is working fine");
});
app.use('/api/auth/', register);
app.use('/api/auth/', login);
app.use('/api/auth/', forgotPassword);

app.listen(PORT, () => {
  logger.info(`Server Listening on PORT: ${PORT}`);
});
