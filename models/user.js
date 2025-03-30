
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: DataTypes.STRING,
    otp: DataTypes.STRING,
    otp_expires: DataTypes.DATE,
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const bcrypt = require('bcryptjs');
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Transaction, { foreignKey: 'user_id' });
    User.hasMany(models.Budget, { foreignKey: 'user_id' });
    User.hasMany(models.Saving, { foreignKey: 'user_id' });
    User.hasMany(models.Tontine, { foreignKey: 'creator_id', as: 'createdTontines' });
    User.belongsToMany(models.Tontine, { 
      through: models.TontineParticipant,
      foreignKey: 'user_id',
      as: 'tontines'
    });
  };

  User.prototype.validPassword = async function(password) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

// const bcrypt = require('bcryptjs');

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         len: [3, 50]
//       }
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: true
//       }
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: [6, 255]
//       }
//     },
//     phone: {
//       type: DataTypes.STRING,
//       validate: {
//         is: /^\+?[0-9]{10,15}$/
//       }
//     },
//     otp: DataTypes.STRING(6),
//     otp_expires: DataTypes.DATE,
//     is_verified: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     }
//   }, {
//     hooks: {
//       beforeSave: async (user) => {
//         if (user.changed('password')) {
//           user.password = await bcrypt.hash(user.password, 10);
//         }
//       }
//     }
//   });

//   User.prototype.validPassword = async function(password) {
//     return await bcrypt.compare(password, this.password);
//   };

//   User.associate = function(models) {
//     User.hasMany(models.Transaction, { foreignKey: 'user_id' });
//     User.hasMany(models.Budget, { foreignKey: 'user_id' });
//     User.hasMany(models.Saving, { foreignKey: 'user_id' });
//     User.belongsToMany(models.Tontine, { 
//       through: 'TontineParticipants',
//       foreignKey: 'user_id'
//     });
//     User.hasMany(models.Tontine, { foreignKey: 'creator_id' });
//   };

//   return User;
// };