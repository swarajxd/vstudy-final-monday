import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "root",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || "my_database",
    ssl: false // 🔴 Set to false for local development
});

pool.connect()
    .then(() => console.log("✅ PostgreSQL connected successfully!"))
    .catch((err) => console.error("❌ Database connection failed:", err));

    export default pool;  // Change this line
