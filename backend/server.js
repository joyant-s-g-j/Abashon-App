import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())

app.use("/api/auth",)