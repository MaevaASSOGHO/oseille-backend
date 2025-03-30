// module.exports = (sequelize, DataTypes) => {
//     const Transaction = sequelize.define('Transaction', {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//       },
//       amount: {
//         type: DataTypes.DECIMAL(15, 2),
//         allowNull: false,
//         validate: {
//           min: 0.01
//         }
//       },
//       type: {
//         type: DataTypes.ENUM('income', 'expense'),
//         allowNull: false
//       },
//       category: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//       description: {
//         type: DataTypes.STRING(500)
//       },
//       date: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//         validate: {
//           isDate: true
//         }
//       }
//     });
  
//     Transaction.associate = function(models) {
//       Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
//       Transaction.belongsTo(models.Budget, { foreignKey: 'budget_id' });
//     };
  
//     return Transaction;
//   };


module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    budget_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Budgets',
        key: 'id'
      }
    }
  });

  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
    Transaction.belongsTo(models.Budget, { foreignKey: 'budget_id' });
  };

  return Transaction;
};