const {Router} = require('express');
const {
    createExpense,
    getExpenses,
    deleteExpense
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware); // Protect all routes

router.route('/')
    .get(getExpenses)
    .post(createExpense);

router.delete('/:id', deleteExpense);

module.exports = router;