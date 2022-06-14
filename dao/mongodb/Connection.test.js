const Connection = require('./Connection');
require('dotenv').config();
describe('Probando Connection con Mongodb', ()=>{
    test('probando Conexion a DB', async ()=>{
        const db = await Connection.getDB();
        expect(db).toBeDefined();
    });
});