const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config/config');

const USER = config.dbUser;
const PASSWORD = config.dbPassword;
const DB_HOST = config.dbHost;
const DB_NAME = config.dbName;
const MONGO_URI = (
  `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
);

const mongoLib = {
  client: new MongoClient(
    MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  ),
  dbName: DB_NAME,
  collection: 'rooms',
  connection: undefined,
  connect: function() {
    if (this.connection) {
      return this.connection;
    }

    return this.connection = new Promise((resolve, reject) => {
      this.client.connect(err => {
        if (err) {
          reject(err);
        }

        console.log('conexion iniciada mongo');
        resolve(this.client.db(this.dbName));
      });
    });
  },
  getAll: async function(collection) {
    return this.connect().then(db => {
      return db.collection(collection).find().toArray();
    });
  },
  get: async function(collection, where) {
    return this.connect().then(db => {
      return db.collection(collection).findOne(where);
    });
  },
  insert: function(collection, data) {
    return this.connect().then(db => {
      return db.collection(collection).insertMany(data);
    }).then(result => result.insertedId);
  },
  push: function(collection, data) {
    return this.connect().then(db => {
      return db.collection(collection).updateOne(
        {},
        { '$push': data },
      );
    }).then(result => result.insertedId);
  }
};

module.exports = mongoLib
