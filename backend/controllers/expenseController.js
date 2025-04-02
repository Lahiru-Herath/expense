const Expense = require('../models/expenseModel');
const HttpError = require('../models/errorModel');

// Create expense
const createExpense = async (req, res, next) => {
    try {
        const {description, amount, category} = req.body;
        
        if(!description || !amount || !category) {
            return next(new HttpError("Please fill in all fields", 422));
        }

        const expense = await Expense.create({
            description,
            amount,
            category,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            data: expense
        });

    } catch (error) {
        next(new HttpError("Couldn't create expense", 422));
    }
};

// Get all expenses for a user
const getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({user: req.user.id}).sort('-date');
        res.json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        next(new HttpError("Couldn't fetch expenses", 422));
    }
};

// Delete expense
const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);
        
        if(!expense) {
            return next(new HttpError("Expense not found", 404));
        }

        // Check if expense belongs to user
        if(expense.user.toString() !== req.user.id) {
            return next(new HttpError("Not authorized", 401));
        }

        await expense.deleteOne();

        res.json({
            success: true,
            message: "Expense deleted"
        });
    } catch (error) {
        next(new HttpError("Couldn't delete expense", 422));
    }
};

module.exports = {
    createExpense,
    getExpenses,
    deleteExpense
};