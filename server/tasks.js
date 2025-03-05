import express from "express";
import jwt from "jsonwebtoken";
import pool from "./db.js"; // PostgreSQL connection
import dotenv from "dotenv";


dotenv.config();
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    try {
        console.log("Authorization Header:", req.header("Authorization")); // Debugging: Check the Authorization header
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ No token provided or invalid format");
            return res.status(401).json({ message: "Access denied" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Received Token:", token); // Debugging: Check the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.email) {
            console.error("❌ Invalid token or missing email");
            return res.status(401).json({ message: "Access denied" });
        }

        req.user = { email: decoded.email };
        console.log("Decoded User:", req.user); // Debugging: Check the decoded user
        next();
    } catch (error) {
        console.error("❌ Token Verification Error:", error.message);
        res.status(401).json({ message: "Access denied" });
    }
};

// ✅ POST (Create Task)
router.post("/", verifyToken, async (req, res) => {
    try {
        console.log("Request User:", req.user); // Debugging: Check if req.user.email exists
        console.log("Request Body:", req.body); // Debugging: Check the request payload

        const { title, description, date, category } = req.body;
        const email = req.user.email; // Get email from the authenticated user

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Ensure user exists
        const userExists = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
        if (userExists.rowCount === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        // Debugging: Log the query parameters
        console.log("Query Parameters:", [email, title, description, date, category, false]);

        // Save task to database
        const newTask = await pool.query(
            "INSERT INTO tasks (email, title, description, date, category, completed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [email, title, description, date, category, false]
        );

        console.log("New Task Created:", newTask.rows[0]); // Debugging: Log the created task
        res.status(201).json({ message: "✅ Task created successfully", task: newTask.rows[0] });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        console.error("❌ Full Error Stack:", error.stack); // Debugging: Log the full error stack
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ GET (Fetch User Tasks)
router.get("/", verifyToken, async (req, res) => {
    try {
        const email = req.user.email; // Get email from the authenticated user

        // Fetch tasks for the authenticated user
        const tasks = await pool.query("SELECT * FROM tasks WHERE email = $1", [email]);

        res.json({ message: "✅ Tasks fetched successfully", tasks: tasks.rows });
    } catch (error) {
        console.error("❌ Error fetching tasks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ PUT (Mark Task as Completed/Uncompleted)
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const email = req.user.email;
        const { id } = req.params;
        const { completed } = req.body;

        // Ensure task exists and belongs to user
        const taskCheck = await pool.query("SELECT * FROM tasks WHERE id = $1 AND email = $2", [id, email]);
        if (taskCheck.rowCount === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        // Update task
        const updatedTask = await pool.query(
            "UPDATE tasks SET completed = $1 WHERE id = $2 AND email = $3 RETURNING *",
            [completed, id, email]
        );

        res.json({ message: "✅ Task updated successfully", task: updatedTask.rows[0] });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ DELETE Task
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const email = req.user.email;
        const { id } = req.params;

        // Ensure task exists
        const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND email = $2 RETURNING *", [id, email]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        res.json({ message: "✅ Task deleted successfully", deletedTask: result.rows[0] });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});
//upcoming tasks
router.get("/tasks/upcoming", async (req, res) => {
    try {
        const userEmail = req.user.email; // Get email from logged-in user
        const result = await pool.query(
            "SELECT id, title, description, date, category FROM tasks WHERE email = $1 AND completed = false ORDER BY date ASC LIMIT 6",
            [userEmail]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;