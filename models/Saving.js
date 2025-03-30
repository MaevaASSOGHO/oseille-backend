// module.exports = (sequelize, DataTypes) => {
//     const Saving = sequelize.define('Saving', {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//       },
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//       target_amount: {
//         type: DataTypes.DECIMAL(15, 2),
//         allowNull: false,
//         validate: {
//           min: 0.01
//         }
//       },
//       current_amount: {
//         type: DataTypes.DECIMAL(15, 2),
//         defaultValue: 0
//       },
//       target_date: {
//         type: DataTypes.DATEONLY,
//         validate: {
//           isDate: true
//         }
//       },
//       is_completed: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//       }
//     });
  
//     Saving.associate = function(models) {
//       Saving.belongsTo(models.User, { foreignKey: 'user_id' });
//     };
  
//     return Saving;
//   };

module.exports = (sequelize, DataTypes) => {
  const Saving = sequelize.define('Saving', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    current_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    target_date: DataTypes.DATEONLY,
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  Saving.associate = function(models) {
    Saving.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Saving;
};