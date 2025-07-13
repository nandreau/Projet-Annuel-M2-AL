const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const app = express();

app.use(
  require("cors")({
    origin: true,
    credentials: true,
  }),
);

// CORS configuration
const corsOptions = {
  origin: "http://localhost:8081",
  allowedHeaders: [
    "x-access-token",
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Sync database and load roles
db.sequelize.sync({ force: true }).then(async () => {
  console.log("✔️  Database dropped & re-synced with { force: true }");
  const loadFakeData = require("./loadFakeData");
  try {
    await loadFakeData();
  } catch (err) {
    console.error("❌ Fake data loading failed:", err);
  }
});

// Simple health-check route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to your application." });
});

// Register Auth & CRUD routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/assignment.routes")(app);
require("./app/routes/checklist.routes")(app);
require("./app/routes/task.routes")(app);
require("./app/routes/phase.routes")(app);
require("./app/routes/chantier.routes")(app);
require("./app/routes/problem.routes")(app);
require("./app/routes/problemMessage.routes")(app);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}.`);
});
