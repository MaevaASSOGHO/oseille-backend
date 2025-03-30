// module.exports = (sequelize, DataTypes) => {
//   const Tontine = sequelize.define('Tontine', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     contribution_amount: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false
//     },
//     frequency: {
//       type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
//       allowNull: false
//     },
//     payout_order: {
//       type: DataTypes.ENUM('random', 'fixed', 'auction'),
//       allowNull: false
//     },
//     start_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: false
//     },
//     end_date: DataTypes.DATEONLY,
//     current_round: {
//       type: DataTypes.INTEGER,
//       defaultValue: 1
//     },
//     status: {
//       type: DataTypes.ENUM('active', 'completed', 'cancelled'),
//       defaultValue: 'active'
//     }
//   });

//   return Tontine;
// };

// Tontine.associate = function(models) {
//   Tontine.belongsTo(models.User, { foreignKey: 'creator_id', as: 'creator' });
//   Tontine.belongsToMany(models.User, { 
//     through: models.TontineParticipant,
//     foreignKey: 'tontine_id',
//     as: 'participants'
//   });
//   Tontine.hasMany(models.TontineParticipant, { foreignKey: 'tontine_id' });
// };

module.exports = (sequelize, DataTypes) => {
  const Tontine = sequelize.define('Tontine', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contribution_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    frequency: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
      allowNull: false
    },
    payout_order: {
      type: DataTypes.ENUM('random', 'fixed', 'auction'),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: DataTypes.DATEONLY,
    current_round: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active'
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  Tontine.associate = function(models) {
    Tontine.belongsTo(models.User, { 
      foreignKey: 'creator_id', 
      as: 'creator' 
    });
    Tontine.belongsToMany(models.User, { 
      through: models.TontineParticipant,
      foreignKey: 'tontine_id',
      as: 'participants'
    });
    Tontine.hasMany(models.TontineParticipant, { 
      foreignKey: 'tontine_id' 
    });
  };

  return Tontine;
};