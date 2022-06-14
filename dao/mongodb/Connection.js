const MongoClient = require('mongodb').MongoClient;

const mongodb = null;

const mongoUri = process.env.MONGODB_URI;
const mongoDbname = process.env.MONGODB_DB;

module.exports = class Connection {
    static db = null;
    static async getDB(){
        if(this.db === null) {
            var mongoClient = await (new MongoClient(mongoUri)).connect();
            this.db = mongoClient.db(mongoDbname);
            console.log('Connection: ', 'Creando conexión')
        } else {
          console.log('Connection: ', 'Usando Conexión Cacheada');
        }
        return this.db;
    }
  }