const express = require("express");
const { signup, login, getAllAccounts, getAccount, updateAccount, deleteAccount } = require("../controllers/accountController");
const authenticateToken = require('../middleware/authMiddleware'); 

const router = express.Router();

// Routes
router.post("/signup", signup);       // Signup route
router.post("/login", login);         // Login route
router.get("/all", authenticateToken, getAllAccounts);   // Get all accounts
router.get("/all", authenticateToken, getAccount);   // 
router.put("/:id", authenticateToken, updateAccount);    // Update an account
router.delete("/:id", authenticateToken, deleteAccount); // Delete an account

module.exports = router;






// const authenticateToken = require('../middleware/authMiddleware'); 

// const router = express.Router();

// router.get('/', authenticateToken, accountController.getAllAccounts);
// router.get('/:id', authenticateToken, accountController.getAccount);
// router.put('/:id', authenticateToken, accountController.updateAccount);
// router.delete('/:id', authenticateToken, accountController.deleteAccount);

// module.exports = router;