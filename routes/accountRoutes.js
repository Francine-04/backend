const express = require('express');
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middleware/authMiddleware'); 

const router = express.Router();

router.get('/', authenticateToken, accountController.getAllAccounts);
router.get('/:id', authenticateToken, accountController.getAccount);
router.put('/:id', authenticateToken, accountController.updateAccount);
router.delete('/:id', authenticateToken, accountController.deleteAccount);

module.exports = router;