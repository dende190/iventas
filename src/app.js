const express = require('express');
const app = express();
const expressSession = require('express-session');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const cookieParser = require('cookie-parser');
const { config } = require('../config/config');
const loginService = require('../services/login');
const messageServices = require('../services/message');
const userServices = require('../services/user');

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(expressSession({
  secret: 'prueba',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    expires: new Date(Date.now() + 3600000),
    maxAge: 3600000
  },
}));

app.get('/', (req, res, next) => {
  const datosVista = {
    title: 'Iniciar sesion',
  }
  res.render('users/login', datosVista);
});

app.post('/login', async (req, res, next) => {
  const user = await loginService.authUser(req.body);
  if (!user) {
    return res.redirect('/');
  }

  req.session.user = user;
  res.app.locals.user = user;
  res.redirect('/chat');
});

app.get('/chat', async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const messages = await messageServices.getAll();
  let contactData = [];
  if (messages.length) {
    const contact = messages.find(message => {
      return message.userId !== req.session.user.id
    });
    contactData = await userServices.get(contact.userId);
  }
  const datosVista = {
    title: 'chat',
    user: req.session.user,
    messages: messages,
    contactData: contactData,
  }

  res.render('chat/chat', datosVista);
});

io.on('connection', async socket => {
  console.log('usuario conectado');

  socket.on('message', data => {
    messageServices.save(data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => console.log('usuario desconectado'));
});

http.listen(config.port, () => {
  console.log('Servidor escuchando en el puerto', config.port);
});
