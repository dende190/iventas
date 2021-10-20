const mongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');
const saltRounds = 10;

loginService = {
  authUser: async function({email, password}) {
    const user = await mongoLib.get('users', {email: email});
    if (!user) {
      return false;
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return false;
    }

    return {
      id: user._id,
      email: user.email,
      image: user.imagen,
      name: user.nombre,
      phone: user.telefono,
    };
  },
};

module.exports = loginService;
