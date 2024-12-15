// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).json({ error: "No token provided" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: "Invalid or expired token" });
//         }
//         req.user = user; // Attach user information to the request object
//         next();
//     });
// };

// module.exports = authenticateToken;

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get the token from the header
  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Invalid token
      req.user = user; // Save the user information for later use
      next(); // Proceed to the next middleware or route handler
  });
};

//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Add user info to request
//     next(); // Continue to the next middleware or route handler
//   } catch (err) {
//     console.error("Invalid token:", err);
//     res.status(403).json({ error: "Invalid token" });
//   }
// };

module.exports = authenticateToken;