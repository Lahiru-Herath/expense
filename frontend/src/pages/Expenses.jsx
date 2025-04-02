import React, { useState } from 'react';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: 'Other'
    });

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];

    const handleSubmit = (e) => {
        e.preventDefault();
        const expense = {
            id: Date.now(),
            ...newExpense,
            date: new Date().toISOString()
        };
        setExpenses([expense, ...expenses]);
        setNewExpense({ description: '', amount: '', category: 'Other' });
    };

    const handleDelete = (id) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Description"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                            className="p-2 border rounded-md w-full"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                            className="p-2 border rounded-md w-full"
                            required
                        />
                        <select
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                            className="p-2 border rounded-md w-full"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add Expense
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Expense Summary</h2>
                    <div className="text-lg font-bold text-blue-600">
                        Total: ${totalExpenses.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {expenses.map(expense => (
                    <div key={expense.id} className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
                        <div>
                            <h3 className="font-semibold">{expense.description}</h3>
                            <p className="text-sm text-gray-600">{expense.category}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-lg">${Number(expense.amount).toFixed(2)}</span>
                            <button
                                onClick={() => handleDelete(expense.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Expenses;