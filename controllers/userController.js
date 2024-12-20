// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const db = require("../config/db"); 

// // Signup function
// const signup = async (req, res) => {
//     try {
//         const { fullname, username, password } = req.body;

//         // Validate input
//         if (!fullname || !username || !password) {
//             return res.status(400).json({ error: "All fields are required." });
//         }

//         // Check if the user already exists
//         const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
//         if (rows.length > 0) {
//             return res.status(400).json({ error: "User  already exists." });
//         }

//         // Hash the password before storing it
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create the new user with the hashed password
//         await db.execute("INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)", [fullname, username, hashedPassword]);
//         res.status(201).json({ message: "User  registered successfully." });
//     } catch (error) {
//         console.error("Error during signup:", error);
//         res.status(500).json({ error: "An error occurred during signup." });
//     }
// };

// // Login function
// const login = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Validate input
//         if (!username || !password) {
//             return res.status(400).json({ error: "Username and password are required." });
//         }

//         // Check if the user exists
//         const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
//         if (rows.length === 0) {
//             return res.status(401).json({ error: "Invalid username or password." });
//         }

//         const user = rows[0];

//         // Compare the hashed password
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ error: "Invalid username or password." });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
//             expiresIn: "1h",
//         });

//         // Return success response with token
//         res.status(200).json({ message: "Login successful.", token });
//     } catch (error) {
//         console.error("Error during login:", error);
//         res.status(500).json({ error: "An error occurred during login." });
//     }
// };

// module.exports = { signup, login };