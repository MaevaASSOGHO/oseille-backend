const { Transaction, Budget } = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, budget_id } = req.body;
    const user_id = req.userId;
    
    const transaction = await Transaction.create({
      user_id,
      amount,
      type,
      category,
      description,
      budget_id,
      date: new Date()
    });
    
    // Mettre à jour le budget si applicable
    if (budget_id && type === 'expense') {
      await Budget.increment('current_spending', {
        by: amount,
        where: { id: budget_id, user_id }
      });
    }
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const user_id = req.userId;
    
    const where = { user_id };
    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    const transactions = await Transaction.findAll({ 
      where,
      order: [['date', 'DESC']]
    });
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionSummary = async (req, res) => {
  try {
    const { period } = req.query;
    const user_id = req.userId;
    
    const date = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(date.setHours(0, 0, 0, 0));
        endDate = new Date(date.setHours(23, 59, 59, 999));
        break;
      case 'month':
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'year':
        startDate = new Date(date.getFullYear(), 0, 1);
        endDate = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        return res.status(400).json({ message: "Période invalide" });
    }
    
    const result = await Transaction.findAll({
      attributes: [
        'type',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        user_id,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: ['type'],
      raw: true
    });
    
    const summary = {
      income: result.find(r => r.type === 'income')?.total || 0,
      expense: result.find(r => r.type === 'expense')?.total || 0,
      startDate,
      endDate
    };
    
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};