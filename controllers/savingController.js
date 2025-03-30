const { Saving, Transaction } = require('../models');

exports.createSaving = async (req, res) => {
  try {
    const { name, target_amount, target_date } = req.body;
    const user_id = req.userId;
    
    const saving = await Saving.create({
      user_id,
      name,
      target_amount,
      target_date
    });
    
    res.status(201).json(saving);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToSaving = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const user_id = req.userId;
    
    const saving = await Saving.findOne({ where: { id, user_id } });
    if (!saving) {
      return res.status(404).json({ message: "Épargne non trouvée" });
    }
    
    if (saving.is_completed) {
      return res.status(400).json({ message: "L'objectif d'épargne est déjà atteint" });
    }
    
    // Mettre à jour l'épargne
    const updatedAmount = saving.current_amount + parseFloat(amount);
    const isCompleted = updatedAmount >= saving.target_amount;
    
    await saving.update({
      current_amount: updatedAmount,
      is_completed: isCompleted
    });
    
    // Créer une transaction associée
    await Transaction.create({
      user_id,
      amount,
      type: 'expense',
      category: 'saving',
      description: `Versement épargne: ${saving.name}`
    });
    
    res.status(200).json(saving);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavings = async (req, res) => {
  try {
    const { is_completed } = req.query;
    const user_id = req.userId;
    
    const where = { user_id };
    if (is_completed !== undefined) where.is_completed = is_completed;
    
    const savings = await Saving.findAll({ where });
    res.status(200).json(savings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};