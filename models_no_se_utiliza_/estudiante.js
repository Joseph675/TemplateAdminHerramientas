module.exports = (sequelize, Sequelize) => {
    const Estudiante = sequelize.define('estudiantes', {
      id_estudiante: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING
      },
      apellido: {
        type: Sequelize.STRING
      },
      
      email: {
        type: Sequelize.STRING
      },
      contraseña: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      }
    }, {
      freezeTableName: true,
      timestamps: false
    });
  
    return Usuario;
  };
  