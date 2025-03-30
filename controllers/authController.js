const { User } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/auth');
const authMiddleware = require('../middlewares/auth');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });
    
    if (userExists) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password,
      phone,
      otp: authMiddleware.generateOTP(),
      otp_expires: new Date(Date.now() + config.otpExpires)
    });

    // Envoyer OTP par email
    await transporter.sendMail({
      to: email,
      subject: 'Votre code de vérification',
      text: `Votre code OTP est: ${user.otp}`
    });

    res.status(201).json({ 
      message: "Utilisateur créé. Vérifiez votre email pour le code OTP.",
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    if (user.otp !== otp || user.otp_expires < new Date()) {
      return res.status(400).json({ message: "OTP invalide ou expiré" });
    }
    
    await user.update({
      is_verified: true,
      otp: null,
      otp_expires: null
    });
    
    res.status(200).json({ message: "Compte vérifié avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    
    if (!user.is_verified) {
      return res.status(403).json({ message: "Compte non vérifié. Veuillez vérifier votre email." });
    }
    
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpires
    });
    
    res.status(200).json({ 
      token, 
      userId: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};