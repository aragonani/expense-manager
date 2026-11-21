const Expense = require('../models/expense');
const { getDateRange } = require('../utils/dateFilter');

async function getAllExpenses(req, res) {
    try {
        if (!req.user) {
            return res.render('index', { expense: [], user: null, currentFilter: req.query.filter || 'all' });
        }
        const { filter } = req.query;
        const query = { createdBy: req.user.id };

        const dateRange = getDateRange(filter);
        if (dateRange) {
            query.date = { $gte: dateRange.startDate, $lte: dateRange.endDate };
        }
        const expense = await Expense.find(query).sort({ date: -1 });
        res.render('index', { expense, user: req.user, currentFilter: filter || 'all' });
    } catch (err) {
        res.status(500).send("Error fetching Expense");
    }
}

async function getExpenseDetail(req, res) {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).send("Expense not found");
        }
        if (!expense.createdBy || expense.createdBy.toString() !== req.user.id) {
            return res.status(403).send("You do not have permission to view this expense");
        }
        res.render('expense-detail', { expense, user: req.user });
    } catch (err) {
        res.status(500).send("Error fetching expenses");
    }
}

async function createExpense(req, res) {
    try {
        const { title, amount, category, date } = req.body;
        await Expense.create({
            title,
            amount: amount ? Number(amount) : 0,
            category,
            date: date ? new Date(date) : undefined,
            createdBy: req.user.id,
        });
        res.redirect('/expense');
    } catch (err) {
        res.status(500).send("Error creating expense");
    }
}

async function renderEditForm(req, res) {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).send("Expense not found");
        }
        if (!expense.createdBy || expense.createdBy.toString() !== req.user.id) {
            return res.status(403).send("You do not have permission to edit this expense");
        }
        res.render('expenses-edit', { expense, user: req.user });
    } catch (err) {
        res.status(500).send("Error rendering edit form");
    }
}

async function updateExpense(req, res) {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).send("Expense not found");
        }
        if (!expense.createdBy || expense.createdBy.toString() !== req.user.id) {
            return res.status(403).send("You do not have permission to update this expense");
        }
        const { title, amount, category, date } = req.body;
        expense.title = title;
        expense.amount = amount ? Number(amount) : 0;
        expense.category = category;
        if (date) {
            expense.date = new Date(date);
        }
        await expense.save();
        res.redirect(`/expense/${req.params.id}`);
    } catch (err) {
        res.status(500).send("Error updating expense"); 
    }
}

async function deleteExpense(req, res) {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).send("Expense not found");
        }
        if (!expense.createdBy || expense.createdBy.toString() !== req.user.id) {
            return res.status(403).send("You do not have permission to delete this expense");
        }
        await Expense.findByIdAndDelete(req.params.id);
        res.redirect('/expense');
    } catch (err) {
        res.status(500).send("Error deleting expense");
    }
}

module.exports = {
    getAllExpenses,
    getExpenseDetail,
    createExpense,
    renderEditForm,
    updateExpense,
    deleteExpense
};
