const mongoLib = require('../lib/mongo');

const messageServices = {
  getAll: async function(roomName) {
    const chat = await mongoLib.getAll('chats');
    return (chat[0].message || []);
  },
  save: async function(data) {
    mongoLib.push('chats', { message: data });
  },
};

module.exports = messageServices;
