import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js"; 

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config(); // Reads .env → parses it → adds keys to process.env . now the values will be availabel to be assigned

connectDB(); // we are connecting to the database

const PORT = process.env.PORT; // because we have done dotenv.config() we can access port number present in .env file 
const __dirname = path.resolve(); // gives you the absolute path (root to current directory) . this will help us to build safe file paths project.

// app.use() is used to mount middleware at application level. 
//what does middleware do? middleware is a function that get access to req and response of http server.
// app.use(express.json()) it will run on every path unless it is specific path is not mentioned    

app.use(express.json()); // json obj vali incoming request ne req.body ma put krse 
app.use(cookieParser()); // parses the Cookie header and makes cookies available in req.cookies
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false, // eg browser request kre che in methods other then 4 mentioned. false na lidhe pela j
    //  ek options at trial thse by sending request to cors. cors sidho response aappi dese. 
    // thus ee actual routes pr jse j nai directly ocrs j handle kri lese
    optionsSuccessStatus: 204,
    maxAge: 86400,// cors ee je pn response aapyo ee 24hrs mate save thai jse. 
    // so agar koi biji vaar same method thi request kre toh response quick thse
    credentials: true,
  })
);

app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ message });
});

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});

// proxy server at frontend side
// cors vali method

console.log(PORT);
