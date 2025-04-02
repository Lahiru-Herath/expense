const {Schema, model} = require('mongoose');

const expenseSchema = new Schema({
    description: {
        type: String, 
        required: true
    },
    amount: {
        type: Number, 
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Expense', expenseSchema);