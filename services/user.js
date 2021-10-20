const mongoLib = require('../lib/mongo');
const { ObjectId } = require('mongodb');

const userServices = {
  get: async function(id) {
    const user = await mongoLib.get('users', { _id: ObjectId(id) });
    return {
      id: user._id,
      email: user.email,
      image: user.imagen,
      name: user.nombre,
      phone: user.telefono,
      curp: user.curp,
      age: user.edad,
      problem: user.problema,
      priority: user.prioridad,
      note: user.nota,
    };
  },
  save: async function(data) {
    mongoLib.push('chats', { message: data });
  },
};

module.exports = userServices;
