const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const eventRoutes = require("./routes/eventRoutes");

const app = express();

// --- Security Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Rate limiting - max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use(limiter);

// --- Swagger API Docs ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---
app.use("/api/events", eventRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "event-service",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("Event Service Running...");
});

module.exports = app;
