const { Budget, Transaction, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.createBudget = async (req, res) => {
  try {
    const { name, amount, period, start_date, end_date, categories } = req.body;
    const user_id = req.userId;
    
    const budget = await Budget.create({
      user_id,
      name,
      amount,
      period,
      start_date,
      end_date,
      categories
    });
    
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const { status } = req.query;
    const user_id = req.userId;
    
    const where = { user_id };
    if (status) where.status = status;
    
    const budgets = await Budget.findAll({ where });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBudgetDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;
    
    const budget = await Budget.findOne({ 
      where: { id, user_id },
      include: [{
        model: Transaction,
        where: { type: 'expense' },
        required: false,
        order: [['date', 'DESC']]
      }]
    });
    
    if (!budget) {
      return res.status(404).json({ message: "Budget non trouvé" });
    }
    
    // Analyse par catégorie
    const categoryAnalysis = await Transaction.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      where: { 
        user_id,
        budget_id: id,
        type: 'expense'
      },
      group: ['category'],
      raw: true
    });
    
    res.status(200).json({
      budget,
      categoryAnalysis,
      remaining: budget.amount - budget.current_spending
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;
    const updateData = req.body;
    
    const [updated] = await Budget.update(updateData, {
      where: { id, user_id },
      returning: true
    });
    
    if (!updated) {
      return res.status(404).json({ message: "Budget non trouvé" });
    }
    
    const budget = await Budget.findByPk(id);
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};