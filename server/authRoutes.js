import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        res.json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (err) {
        console.error("❌ Register Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userQuery.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = userQuery.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Ensure JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error("🚨 JWT_SECRET is missing in .env file!");
            return res.status(500).json({ error: "Internal server error" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        console.log("Generated Token:", token); 
        // Send token in headers + response
        res.setHeader("Authorization", `Bearer ${token}`);

        res.status(200).json({
            message: "✅ Login successful!",
             token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username || "",  // 🔴 FIX: Send empty string if username is null
            }
        });

    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


    

export default router;
