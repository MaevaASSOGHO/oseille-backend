const { Tontine, User, TontinePayment, TontineParticipant } = require('../models');
const { Op } = require('sequelize');

exports.createTontine = async (req, res) => {
  try {
    const { 
      name, 
      participantIds, 
      contribution_amount, 
      frequency, 
      payout_order, 
      start_date, 
      end_date 
    } = req.body;
    
    const creator_id = req.userId;
    
    // Vérifier que tous les participants existent
    const users = await User.findAll({ 
      where: { id: { [Op.in]: participantIds } }
    });
    
    if (users.length !== participantIds.length) {
      return res.status(404).json({ message: "Un ou plusieurs participants non trouvés" });
    }
    
    // Créer la tontine
    const tontine = await Tontine.create({
      name,
      creator_id,
      contribution_amount,
      frequency,
      payout_order,
      start_date,
      end_date
    });
    
    // Ajouter les participants (y compris le créateur)
    const allParticipants = [...new Set([creator_id, ...participantIds])];
    await tontine.addParticipants(allParticipants);
    
    res.status(201).json(tontine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;
    
    const tontine = await Tontine.findByPk(id, {
      include: [{
        model: User,
        as: 'participants',
        where: { id: user_id },
        required: true
      }]
    });
    
    if (!tontine) {
      return res.status(404).json({ message: "Tontine non trouvée ou vous n'êtes pas participant" });
    }
    
    // Vérifier si l'utilisateur a déjà contribué pour ce round
    const existingPayment = await TontinePayment.findOne({
      where: {
        tontine_id: id,
        user_id,
        round: tontine.current_round
      }
    });
    
    if (existingPayment) {
      return res.status(400).json({ message: "Vous avez déjà contribué pour ce round" });
    }
    
    // Enregistrer la contribution
    await TontinePayment.create({
      tontine_id: id,
      user_id,
      amount: tontine.contribution_amount,
      round: tontine.current_round,
      date: new Date()
    });
    
    // Vérifier si tous les participants ont contribué pour ce round
    const participantsCount = await TontineParticipant.count({
      where: { tontine_id: id }
    });
    
    const paymentsCount = await TontinePayment.count({
      where: { 
        tontine_id: id,
        round: tontine.current_round
      }
    });
    
    if (paymentsCount >= participantsCount) {
      // Tous ont contribué - passer au round suivant
      await tontine.update({
        current_round: tontine.current_round + 1
      });
      
      // TODO: Implémenter la logique de payout selon payout_order
    }
    
    res.status(200).json({ message: "Contribution enregistrée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTontines = async (req, res) => {
  try {
    const user_id = req.userId;
    const { status } = req.query;
    
    const where = {};
    if (status) where.status = status;
    
    const tontines = await Tontine.findAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }, {
        model: User,
        as: 'participants',
        attributes: ['id', 'username'],
        through: { attributes: [] },
        where: { id: user_id }
      }]
    });
    
    res.status(200).json(tontines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};