const express = require('express');
const router = express.Router();
const {
    getAllExpenses,
    getExpenseDetail,
    createExpense,
    renderEditForm,
    updateExpense,
    deleteExpense
} = require('../controller/expense');

const { requireAuth } = require('../middleware/checkAuth');

router.get('/', getAllExpenses);
router.get('/:id', requireAuth, getExpenseDetail);

router.post('/', requireAuth, createExpense);
router.get('/:id/edit', requireAuth, renderEditForm);
router.post('/:id/update', requireAuth, updateExpense);
router.post('/:id/delete', requireAuth, deleteExpense);

module.exports = router;
