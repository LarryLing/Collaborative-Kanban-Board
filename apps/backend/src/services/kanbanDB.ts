import mysql from "mysql";

if (
  !process.env.RDS_HOSTNAME ||
  !process.env.RDS_USERNAME ||
  !process.env.RDS_PASSWORD ||
  !process.env.RDS_PORT ||
  !process.env.RDS_DB_NAME
) {
  throw new Error("Missing RDS environment variables!");
}

const kanbanDB = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: parseInt(process.env.RDS_PORT),
  database: process.env.RDS_DB_NAME,
});

kanbanDB.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

process.on("SIGINT", () => {
  kanbanDB.end((err) => {
    if (err) {
      console.error("Error closing database connection:", err);
    } else {
      console.log("MySQL Database connection closed");
    }
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  kanbanDB.end((err) => {
    if (err) {
      console.error("Error closing database connection:", err);
    } else {
      console.log("MySQL Database connection closed");
    }
    process.exit(0);
  });
});

export default kanbanDB;
