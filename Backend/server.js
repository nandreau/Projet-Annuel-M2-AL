const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const { Role } = db;

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync database and seed roles
db.sequelize.sync({ force: true }).then(() => {
  console.log("✔️  Database dropped & re-synced with { force: true }");
  seedRoles();
});

// Simple health-check route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to your application." });
});

// Register Auth & CRUD routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/taskPlanning.routes")(app);
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

// Seed initial roles into the `roles` table
function seedRoles() {
  const roles = [
    { id: 1, name: "user" },
    { id: 2, name: "moderator" },
    { id: 3, name: "admin" }
  ];

  roles.forEach(role =>
    Role.findOrCreate({ where: { id: role.id }, defaults: role })
  );
}
