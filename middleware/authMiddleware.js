const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the verified user information to the request object
        next(); // Call the next middleware or route handler
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;