import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express(); // instance of express
const server = http.createServer(app);// now this app behaves as full fledged http server . also it is
// better than app.express() becuase it will give us more control over the server . we will be able to fet req and response  

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    maxAge: 86400,
    transports: ["websocket", "polling"],
    wsEngine: "ws",
    allowEIO3: true,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // MS
      httpOnly: true, // prevent XSS attacks cross-site scripting attacks
      sameSite: "strict", // CSRF attacks cross-site request forgery attacks
      secure: process.env.NODE_ENV !== "development",
    },
    transportOptions: {
      websocket: {
        checkOrigin: (origin) => true,
      },
    },
    path: "/socket.io",
    serveClient: false,
    upgradeTimeout: 10000,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
