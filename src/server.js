const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Event Service running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();
