import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./src/lib/db.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () =>{
    ConnectDB()
    console.log("Server is running on port: " + PORT);
})