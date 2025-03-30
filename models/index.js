// const Sequelize = require('sequelize');
// const config = require('../config/database');
// const { Op } = require('sequelize');

// const sequelize = new Sequelize(
//   config.database,
//   config.username,
//   config.password,
//   {
//     host: config.host,
//     dialect: config.dialect,
//     pool: config.pool,
//     logging: config.logging,
//     define: config.define
//   }
// );

// // Import des modèles avec la nouvelle syntaxe
// const User = require('./User')(sequelize, Sequelize.DataTypes);
// const Transaction = require('./Transaction')(sequelize, Sequelize.DataTypes);
// const Budget = require('./Budget')(sequelize, Sequelize.DataTypes);
// const Saving = require('./Saving')(sequelize, Sequelize.DataTypes);
// const Tontine = require('./Tontine')(sequelize, Sequelize.DataTypes);

// // Table de jointure pour la relation many-to-many entre User et Tontine
// const TontineParticipant = sequelize.define('TontineParticipant', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   joined_at: {
//     type: Sequelize.DATE,
//     defaultValue: Sequelize.NOW
//   },
//   is_active: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: true
//   }
// });

// // Établissement des relations
// User.hasMany(Transaction, { foreignKey: 'user_id' });
// Transaction.belongsTo(User, { foreignKey: 'user_id' });

// User.hasMany(Budget, { foreignKey: 'user_id' });
// Budget.belongsTo(User, { foreignKey: 'user_id' });

// User.hasMany(Saving, { foreignKey: 'user_id' });
// Saving.belongsTo(User, { foreignKey: 'user_id' });

// // Relations pour Tontine
// Tontine.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });
// User.belongsToMany(Tontine, { 
//   through: TontineParticipant,
//   foreignKey: 'user_id',
//   as: 'tontines'
// });
// Tontine.belongsToMany(User, { 
//   through: TontineParticipant,
//   foreignKey: 'tontine_id',
//   as: 'participants'
// });

// Tontine.hasMany(TontineParticipant, { foreignKey: 'tontine_id' });
// TontineParticipant.belongsTo(Tontine, { foreignKey: 'tontine_id' });

// User.hasMany(TontineParticipant, { foreignKey: 'user_id' });
// TontineParticipant.belongsTo(User, { foreignKey: 'user_id' });

// module.exports = {
//   sequelize,
//   Sequelize,
//   Op,
//   User,
//   Transaction,
//   Budget,
//   Saving,
//   Tontine,
//   TontineParticipant
// };

const Sequelize = require('sequelize');
const config = require('../config/database');
const { Op } = require('sequelize');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    pool: config.pool,
    logging: config.logging,
    define: config.define
  }
);

// Import des modèles
const models = {
  User: require('./User')(sequelize, Sequelize.DataTypes),
  Transaction: require('./Transaction')(sequelize, Sequelize.DataTypes),
  Budget: require('./Budget')(sequelize, Sequelize.DataTypes),
  Saving: require('./Saving')(sequelize, Sequelize.DataTypes),
  Tontine: require('./Tontine')(sequelize, Sequelize.DataTypes),
  TontineParticipant: require('./TontineParticipant')(sequelize, Sequelize.DataTypes)
};

// Établir les associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  Op,
  ...models
};