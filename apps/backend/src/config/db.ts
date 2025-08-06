import mysql from "mysql2/promise";

if (
  !process.env.RDS_HOSTNAME ||
  !process.env.RDS_USERNAME ||
  !process.env.RDS_PASSWORD ||
  !process.env.RDS_PORT ||
  !process.env.RDS_DB_NAME
) {
  throw new Error("Missing RDS environment variables!");
}

const db = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: parseInt(process.env.RDS_PORT),
  database: process.env.RDS_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

process.on("SIGINT", async () => {
  try {
    await db.end();
    console.log("MySQL Database connection closed gracefully");
    process.exit(0);
  } catch (err) {
    console.error("Error closing database connection:", err);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  try {
    await db.end();
    console.log("MySQL Database connection closed gracefully");
    process.exit(0);
  } catch (err) {
    console.error("Error closing database connection:", err);
    process.exit(1);
  }
});

export default db;
