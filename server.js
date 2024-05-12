const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const app = express();
const bcrypt = require('bcrypt');

app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize('pruebasphone', 'joseph', '1234567890', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log
});


const Usuario = require('./models/user')(sequelize, Sequelize);

const Producto = require('./models/product')(sequelize, Sequelize);

const Tienda = require('./models/tienda')(sequelize, Sequelize);

const Cupones = require('./models/cupones')(sequelize, Sequelize);

const Categorias = require('./models/category')(sequelize, Sequelize);

const Telefono = require('./models/telefonos')(sequelize, Sequelize);




// Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({storage: storage});

const dir = './uploads';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

sequelize.authenticate()
  .then(() => console.log('Connected to database'))
  .catch(err => {
    console.error('Unable to connect to database:', err);
    process.exit(1); // Cierra la aplicación si no se puede conectar a la base de datos
  });


//---------------------LOGIN---------------------//


  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Buscar al usuario en la base de datos
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }
  
      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const coinciden = await bcrypt.compare(password, usuario.Contrasena);
      if (!coinciden) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }
  
      // Si las contraseñas coinciden, el inicio de sesión es exitoso
      res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  });
   
//---------------------USUARIOS---------------------//

// Crear un usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    const usuario = req.body;
    if (!usuario.Contrasena) {
      return res.status(400).json({ error: 'Contraseña requerida' });
    }
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(usuario.Contrasena, salt);
    // Crea un nuevo objeto con la contraseña encriptada
    const usuarioParaGuardar = { ...usuario, Contrasena: contrasenaEncriptada };
    Usuario.create(usuarioParaGuardar)
      .then(usuario => res.json(usuario))
      .catch(err => res.json(err));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});



 //Leer todos los usuarios
app.get('/api/usuarios', (req, res) => {
  Usuario.findAll()
    .then(usuarios => res.json(usuarios))
    .catch(err => res.json(err));
});

// Leer un usuario específico
app.get('/api/usuarios/:id', (req, res) => {
  Usuario.findByPk(req.params.id)
    .then(usuario => res.json(usuario))
    .catch(err => res.json(err));
});

// Actualizar un usuario
app.put('/api/usuarios/:id', (req, res) => {
  Usuario.update(req.body, {
    where: { id: req.params.id }
  })
    .then(() => res.sendStatus(200))
    .catch(err => res.json(err));
});

// Eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  Usuario.destroy({
    where: { id: req.params.id }
  })
    .then(() => res.json({ status: 'Usuario eliminado' }))
    .catch(err => res.json(err));
});


//---------------------PRODUCTOS---------------------//


// Crear un Producto con imagen
app.post('/api/productos', upload.single('imagen'), (req, res) => {
  const producto = req.body;
  producto.imagen = `/uploads/${req.file.filename}`;
  Producto.create(producto)
    .then(producto => res.json(producto))
    .catch(err => res.json(err));
});

// Leer todos los Productos
app.get('/api/productos', (req, res) => {
  Producto.findAll()
    .then(Producto => res.json(Producto))
    .catch(err => res.json(err));
});

// Leer un Producto específico
app.get('/api/productos/:id', (req, res) => {
  Producto.findByPk(req.params.id)
    .then(Producto => res.json(Producto))
    .catch(err => res.json(err));
});

// Actualizar un Producto
app.put('/api/productos/:id', (req, res) => {
  Producto.update(req.body, {
    where: { id: req.params.id }
  })
    .then(() => res.sendStatus(200))
    .catch(err => res.json(err));
});

// Eliminar una tienda
app.delete('/api/productos/:id', (req, res) => {
  Producto.destroy({
    where: { id: req.params.id }
  })
    .then(() => res.json({ status: 'Producto eliminado' }))
    .catch(err => res.json(err));
});



//---------------------TELEFONOS---------------------//


// Crear un telefono con imagen
app.post('/api/telefonos', upload.single('imagen'), (req, res) => {
  const telefono = req.body;
  telefono.imagen = `/uploads/${req.file.filename}`;
  Telefono.create(telefono)
    .then(telefono => res.json(telefono))
    .catch(err => res.json(err));
});

// Leer todos los telefonos
app.get('/api/telefonos', (req, res) => {
  Telefono.findAll()
    .then(telefono => res.json(telefono))
    .catch(err => res.json(err));
});

// Leer un telefonos específico
app.get('/api/telefonos/:id', (req, res) => {
  telefono.findByPk(req.params.id)
    .then(telefono => res.json(telefono))
    .catch(err => res.json(err));
});

// Actualizar un telefonos
app.put('/api/telefonos/:id', (req, res) => {
  telefono.update(req.body, {
    where: { id: req.params.id }
  })
    .then(() => res.sendStatus(200))
    .catch(err => res.json(err));
});

// Eliminar una tienda
app.delete('/api/telefono/:id', (req, res) => {
  telefono.destroy({
    where: { id: req.params.id }
  })
    .then(() => res.json({ status: 'telefono eliminado' }))
    .catch(err => res.json(err));
});
//---------------------TIENDAS---------------------//


// Crear una Tienda
app.post('/api/tienda', (req, res) => {
  console.log(req.body)
  Tienda.create(req.body)
    .then(tienda => res.json(tienda))
    .catch(err => res.json(err));
});


// Leer todos las tiendas
app.get('/api/tiendas', (req, res) => {
  Tienda.findAll()
    .then(tiendas => res.json(tiendas))
    .catch(err => res.json(err));
});

// Leer un tienda específico
app.get('/api/tiendas/:id', (req, res) => {
  Tienda.findByPk(req.params.id)
    .then(tienda => res.json(tienda))
    .catch(err => res.json(err));
});

// Actualizar una Tienda
app.put('/api/tiendas/:id', (req, res) => {
  Tienda.update(req.body, {
    where: { id: req.params.id }
  })
    .then(() => res.sendStatus(200))
    .catch(err => res.json(err));
});


// Eliminar una tienda
app.delete('/api/tiendas/:id', (req, res) => {
  Tienda.destroy({
    where: { id: req.params.id }
  })
    .then(() => res.json({ status: 'Tiendas eliminado' }))
    .catch(err => res.json(err));
});



//---------------------CUPONES---------------------//


// Crear un cupon
app.post('/api/cupones', (req, res) => {
  console.log(req.body)
  Cupones.create(req.body)
    .then(cupones => res.json(cupones))
    .catch(err => res.json(err));
});

// Leer todos los cupones
app.get('/api/cupones', (req, res) => {
  Cupones.findAll()
    .then(cupones => res.json(cupones))
    .catch(err => res.json(err));
});

// Leer un cupon específico
app.get('/api/cupones/:id', (req, res) => {
  Cupones.findByPk(req.params.id)
    .then(cupones => res.json(cupones))
    .catch(err => res.json(err));
});

// Actualizar un cupon
app.put('/api/cupones/:id', (req, res) => {
  Cupones.update(req.body, {
    where: { id: req.params.id }
  })
    .then(() => res.sendStatus(200))
    .catch(err => res.json(err));
});


// Eliminar un cupon
app.delete('/api/cupones/:id', (req, res) => {
  Cupones.destroy({
    where: { id: req.params.id }
  })
    .then(() => res.json({ status: 'Cupon eliminado' }))
    .catch(err => res.json(err));
});


//---------------------CATEGORIAS---------------------//


// Crear una categoria
app.post('/api/categorias', (req, res) => {
  console.log(req.body)
  Categorias.create(req.body)
    .then(categorias => res.json(categorias))
    .catch(err => res.json(err));
});

// Leer todos los categoria
app.get('/api/categorias', (req, res) => {
  Categorias.findAll()
    .then(categorias => res.json(categorias))
    .catch(err => res.json(err));
});

// Leer una categoria
app.get('/api/categorias/:id', (req, res) => {
  Categorias.findByPk(req.params.id)
    .then(Categorias => res.json(Categorias))
    .catch(err => res.json(err));
});

// Actualizar un cupon
app.put('/api/categorias/:id', (req, res) => {
  Categorias.update(req.body, {
    where: { id: req.params.id }
  })
    .then(() => res.sendStatus(200))
    .catch(err => res.json(err));
});


// Eliminar una categoria
app.delete('/api/categorias/:id', (req, res) => {
  Categorias.destroy({
    where: { id: req.params.id }
  })
    .then(() => res.json({ status: 'Categoria eliminado' }))
    .catch(err => res.json(err));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
