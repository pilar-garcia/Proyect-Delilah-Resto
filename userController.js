const sequelize = require('./model')
const jwt = require('jsonwebtoken')

module.exports = {
    createUser: (req, res) => {
      try {
        let userToSave = req.body;
        const user =  sequelize.models.User.build({ userName: userToSave.userName, fullName: userToSave.fullName,
          email: userToSave.email, phone: userToSave.phone,
           address: userToSave.address, pass: userToSave.pass });
        user.save().then((userSaved) => {
          sequelize.models.Rol.findByPk(2).then(rol=>{
            user.setRol(rol).then(userWithRol=>{
              console.log(userWithRol);
              res.status(200).json(userSaved);
            });
          }).catch((error)=>{
              res.status(400).json(error.errors[0].message);
              console.error('Unable to connect to the database:', error);
          });
        }).catch((error)=>{
          res.status(400).json(error.errors[0].message);
          console.error('Unable to connect to the database:', error);
        });
      } catch (error) {
        res.status(400).json(error.errors[0].message);
        console.error('Unable to connect to the database:', error);
      }
    },
    login: (req, res) => {
      try {
        let userToAuthenticate = req.body;
        sequelize.models.User.findOne({ where: { userName: userToAuthenticate.userName } }).then((user) => {
          // Verificar contra
          if (user.pass == userToAuthenticate.pass){
            // Generar token de autenticacion
            let authentication = {
              fullName: user.fullName,
              id: user.id,
              admin: user.rolId == 1
            };
            const token = jwt.sign(authentication, 'secret', {
                expiresIn: '2h'
            });
            res.status(200).header('Authorization', token).json({
              data: `Welcome ${user.fullName}`,
              token
            });
          } else {
            res.status(401).json({ error: 'Verify credetials'});
          }
        }).catch((error)=>{
          console.log(error);
          res.status(400).json(error);
        });
        
      } catch (error) {
        res.status(400).json(error);
        console.error('Unable to connect to the database:', error);
      }
    },
    getUser: (req, res) => {
      try {
        let userId = req.params.userId;
        console.log(userId);
        sequelize.models.User.findByPk(userId).then((user) => {
          
          res.status(200).json(user);
        }).catch((error)=>{
          res.status(400).json(error);
        });
        
      } catch (error) {
        res.status(400).json(error);
        console.error('Unable to connect to the database:', error);
      }
    }
  };
