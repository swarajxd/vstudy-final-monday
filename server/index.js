import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import   pool  from "./db.js"; // Ensure database connection is set
import bcrypt from "bcrypt";
import authRoutes from "./authRoutes.js"; // ✅ Corrected path
import authenticateToken from "../middleware/authenticateToken.js";


dotenv.config();

const app = express(); // ✅ Define app BEFORE using it



// Middlewares
app.use(express.json());
app.use(cors());






// Middleware
app.use(cors({
    origin: "http://localhost:5000", // Replace with your frontend URL
    credentials: true,
  }));
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data

// ✅ Use Routes
import tasksRouter from "./tasks.js";  // Adjust path if needed
  
app.use("/api/", authRoutes);  // Authentication routes
app.use("/api/tasks", tasksRouter); // Task management routes


app.use(express.json());
app.use(cors());

// Serve static files (adjust folder path)
app.use(express.static("public"));

// 🟢 **Signup Route**
app.post("/signup", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Validate input fields
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Check if email already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ error: "Email already registered!" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const newUser = await pool.query(
            "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [first_name, last_name, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully!", user: newUser.rows[0] });

    } catch (error) {
        console.error("❌ Error in /signup:", error);
        res.status(500).json({ error: "Signup failed. Try again later." });
    }
});

// 🟢 **Login Route**
import jwt from "jsonwebtoken";
app.post("/login", async (req, res) => {
    console.log("🔍 /login route hit!");
    console.log("Request body:", req.body); // Debugging
    try {
        console.log("🔍 Login request received!");
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required!" });
        }

        // Check user in database
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect password!" });
        }
        const token = jwt.sign(
            { id: user.rows[0].id, first_name: user.rows[0].first_name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );


        res.status(200).json({ message: "Login successful!", user: user.rows[0] });

    } catch (error) {
        console.error("❌ Error in /login:", error);
        res.status(500).json({ error: "Login failed. Try again later." });
    }
});

//pomodoro
app.post("/save-pomodoro-time", async (req, res) => {
    try {
        const { email, time_spent } = req.body; // Get email and time in minutes

        if (!email || !time_spent || isNaN(time_spent)) {
            return res.status(400).json({ error: "Invalid data" });
        }

        const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format

        // ✅ 1. Update `study_time` table (Daily tracking)
        const userCheck = await pool.query(
            "SELECT * FROM study_time WHERE email = $1 AND date = $2",
            [email, today]
        );

        if (userCheck.rows.length > 0) {
            // Update today's study time
            await pool.query(
                "UPDATE study_time SET time = time + $1 WHERE email = $2 AND date = $3",
                [time_spent, email, today]
            );
        } else {
            // Insert new daily study record
            await pool.query(
                "INSERT INTO study_time (email, date, time) VALUES ($1, $2, $3)",
                [email, today, time_spent]
            );
        }

        // ✅ 2. Update `total_time` in `users` table
        await pool.query(
            "UPDATE users SET total_time = total_time + $1 WHERE email = $2",
            [time_spent, email]
        );

        res.json({ success: true, message: "Time saved successfully" });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//study time display
app.get("/api/getStudyTime", async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const result = await pool.query("SELECT time FROM study_time WHERE email = $1", [email]);
        if (result.rows.length > 0) {
            res.json({ time: result.rows[0].time });
        } else {
            res.status(404).json({ error: "Study time not found" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//firstname on display
app.get("/api/user/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT first_name FROM users WHERE id = $1", [id]);
        
        if (result.rows.length > 0) {
            res.json(result.rows[0]);  // Send { first_name: "Swaraj" }
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
