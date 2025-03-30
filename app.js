const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const routes = require('./routes');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connecté à la base de données MySQL');
    return sequelize.sync({ alter: true }); // Synchronisation des modèles
  })
  .then(() => {
    console.log('Modèles synchronisés');
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
  });

// Routes
app.use('/api', routes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Quelque chose a mal tourné!' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

