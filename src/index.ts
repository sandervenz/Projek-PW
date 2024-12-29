import express from "express";
import db from "./utils/database";
import routes from "./routes/api";
import bodyParser from "body-parser";
import docs from "./docs/route";
import {
  errorNotFoundMiddleware,
  errorServerMiddleware,
} from "./middlewares/error.middleware";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multiple allowed origins
const allowedOrigins = ["https://web-foodscoop.vercel.app", "https://web-foodscoop-admin.vercel.app", "http://127.0.0.1:5500"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow credentials (cookies)
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Define rate limiting rules
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Include rate limit info in headers
  legacyHeaders: false, // Disable old headers
  message: "Too many requests, please try again later.",
});

// Apply rate limiting globally
app.use(limiter);

// Database connection
db();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use("/menu", routes);

// Initialize Swagger UI
docs(app);

// Error handling middleware
app.use(errorNotFoundMiddleware);
app.use(errorServerMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
