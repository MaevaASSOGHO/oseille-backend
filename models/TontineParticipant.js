module.exports = (sequelize, DataTypes) => {
    const TontineParticipant = sequelize.define('TontineParticipant', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      tontine_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tontines',
          key: 'id'
        }
      }
    });
  
    TontineParticipant.associate = function(models) {
      TontineParticipant.belongsTo(models.User, { 
        foreignKey: 'user_id' 
      });
      TontineParticipant.belongsTo(models.Tontine, { 
        foreignKey: 'tontine_id' 
      });
    };
  
    return TontineParticipant;
  };