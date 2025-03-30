const jwt = require('jsonwebtoken');
const config = require('../config/auth');
const { User } = require('../models');

exports.verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  
  if (!token) {
    return res.status(403).json({ message: "Aucun token fourni!" });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé!" });
    }
    
    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Non autorisé!" });
  }
};

exports.generateOTP = () => {
  return require('otp-generator').generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false
  });
};