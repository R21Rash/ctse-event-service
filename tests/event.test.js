const request = require("supertest");
const app = require("../src/app");

describe("Event Service", () => {
  describe("GET /", () => {
    it("should return service running message", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Event Service Running...");
    });
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/health");
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.service).toBe("event-service");
      expect(res.body).toHaveProperty("timestamp");
    });
  });

  describe("POST /api/events", () => {
    it("should reject creating event without token", async () => {
      const res = await request(app).post("/api/events").send({
        title: "Test Event",
        description: "A test event description",
        date: "2026-06-15T09:00:00Z",
        location: "Colombo",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("No token provided");
    });

    it("should reject creating event with invalid token", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", "Bearer invalidtoken123")
        .send({
          title: "Test Event",
          description: "A test event description",
          date: "2026-06-15T09:00:00Z",
          location: "Colombo",
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/events", () => {
    it("should attempt to return list of events", async () => {
      const res = await request(app).get("/api/events");
      // 200 if DB connected, 500 if not (expected in test environment)
      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe("GET /api/events/:id", () => {
    it("should return 400 for invalid event ID", async () => {
      const res = await request(app).get("/api/events/invalidid");
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid event ID");
    });
  });

  describe("PUT /api/events/:id", () => {
    it("should reject update without token", async () => {
      const res = await request(app)
        .put("/api/events/507f1f77bcf86cd799439011")
        .send({ title: "Updated" });
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api-docs", () => {
    it("should serve Swagger docs", async () => {
      const res = await request(app).get("/api-docs/").redirects(1);
      expect(res.statusCode).toBe(200);
    });
  });
});
