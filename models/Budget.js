// module.exports = (sequelize, DataTypes) => {
//     const Budget = sequelize.define('Budget', {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//       },
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//       amount: {
//         type: DataTypes.DECIMAL(15, 2),
//         allowNull: false,
//         validate: {
//           min: 0.01
//         }
//       },
//       period: {
//         type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
//         allowNull: false
//       },
//       start_date: {
//         type: DataTypes.DATEONLY,
//         allowNull: false
//       },
//       end_date: DataTypes.DATEONLY,
//       current_spending: {
//         type: DataTypes.DECIMAL(15, 2),
//         defaultValue: 0
//       },
//       status: {
//         type: DataTypes.ENUM('active', 'inactive', 'completed'),
//         defaultValue: 'active'
//       }
//     });
  
//     Budget.associate = function(models) {
//       Budget.belongsTo(models.User, { foreignKey: 'user_id' });
//       Budget.hasMany(models.Transaction, { foreignKey: 'budget_id' });
//     };
  
//     return Budget;
//   };

module.exports = (sequelize, DataTypes) => {
  const Budget = sequelize.define('Budget', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    period: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: DataTypes.DATEONLY,
    current_spending: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'completed'),
      defaultValue: 'active'
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

  Budget.associate = function(models) {
    Budget.belongsTo(models.User, { foreignKey: 'user_id' });
    Budget.hasMany(models.Transaction, { foreignKey: 'budget_id' });
  };

  return Budget;
};