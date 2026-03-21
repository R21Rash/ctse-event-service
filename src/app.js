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
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    originAgentCluster: false,
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
app.use("/api/events/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---
app.use("/api/events", eventRoutes);

/**
 * @swagger
 * /event/health:
 *   get:
 *     summary: Health Check
 *     description: Returns the health status of the Event Service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
// Health check endpoint
app.get("/event/health", (req, res) => {
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
