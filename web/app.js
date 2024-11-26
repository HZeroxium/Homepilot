// app.js
import "dotenv/config";
import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import http from "http";
import { appConfig } from "./config/appConfig.js";
import routes from "./routes/index.js";
import mqttController from "./controllers/mqttController.js";
import sharedsession from "express-socket.io-session";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { Server as SocketIO } from "socket.io";
import socketController from "./controllers/socketController.js"; // Import the socket controller

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Session middleware configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);

// Initialize Socket.IO with CORS configuration
const io = new SocketIO(server, {
  cors: {
    origin: "*", // Or specify a specific domain
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Use shared session for Socket.IO
io.use(
  sharedsession(sessionMiddleware, {
    autoSave: true,
  })
);

// Middleware to attach io to requests if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(expressLayouts);
app.set("layout", "layouts/layout");

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files configuration
app.use(express.static(path.join(__dirname, "public")));

// Configure flash messages
app.use(flash());

// Custom middleware to pass flash messages and user data to all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.user = req.session.user || null;
  next();
});

// Define routes
app.use("/", routes);

// Error handling middleware
app.use(errorHandler);

// Register mqttController with io
mqttController(io); // Pass io to mqttController for Socket.IO handling

// Listen for Socket.IO connections
io.on("connection", socketController); // Delegate socket logic to the controller

// Start the server
const PORT = appConfig.port;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, io };
