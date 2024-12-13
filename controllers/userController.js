const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


const signup = async (req, res) => {
  const { fullname, username, password } = req.body;

  if (!fullname || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    
    const userCheckQuery = "SELECT * FROM users WHERE username = ?";
    const [existingUser] = await db.promise().query(userCheckQuery, [username]);

    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);


    const insertQuery = "INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)";
    await db.promise().query(insertQuery, [fullname, username, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during signup:", err); 
    res.status(500).json({ error: "An internal server error occurred" });
  }
};


const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const userQuery = "SELECT * FROM users WHERE username = ?";
    const [userResult] = await db.promise().query(userQuery, [username]);

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

 
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h", 
    });


    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Error during login:", err); 
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

module.exports = { signup, login };
