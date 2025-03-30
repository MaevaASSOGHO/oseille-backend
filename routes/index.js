const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const budgetController = require('../controllers/budgetController');
const savingController = require('../controllers/savingController');
const tontineController = require('../controllers/tontineController');
const authMiddleware = require('../middlewares/auth');

// Routes publiques
router.post('/auth/register', authController.register);
router.post('/auth/verify', authController.verifyOTP);
router.post('/auth/login', authController.login);

// Routes protégées
router.use(authMiddleware.verifyToken);

// Transactions
router.post('/transactions', transactionController.createTransaction);
router.get('/transactions', transactionController.getTransactions);
router.get('/transactions/summary', transactionController.getTransactionSummary);

// Budgets
router.post('/budgets', budgetController.createBudget);
router.get('/budgets', budgetController.getBudgets);
router.get('/budgets/:id', budgetController.getBudgetDetails);
router.put('/budgets/:id', budgetController.updateBudget);

// Épargne
router.post('/savings', savingController.createSaving);
router.post('/savings/:id/add', savingController.addToSaving);
router.get('/savings', savingController.getSavings);

// Tontines
router.post('/tontines', tontineController.createTontine);
router.post('/tontines/:id/contribute', tontineController.addContribution);
router.get('/tontines', tontineController.getTontines);

module.exports = router;