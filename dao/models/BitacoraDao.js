const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class CategoryDao extends DaoObject {
  constructor(db = null) {
    console.log('BitacoraDao db: ', db);
    super(db);
  }
  async setup() {
    if (process.env.SQLITE_SETUP) {
      const createStatement = 'CREATE TABLE IF NOT EXISTS bitacora (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, description TEXT, date TEXT, amount DECIMAL, category TEXT);';
      await this.run(createStatement);
    }
  }

  getAll() {
    return this.all(
      'SELECT * from bitacora;', []
    );
  }

  getById({ codigo }) {
    const sqlstr = 'SELECT * from bitacora where id=?;';
    const sqlParamArr = [codigo];
    return this.get(sqlstr, sqlParamArr);
  }

  insertOne({ type, description, date, amount, category }) {
    const datee = new Date().toISOString();
    const sqlstr = 'INSERT INTO bitacora (type, description, date, amount, category) values (?, ?, ?, ?, ?);';
    const sqlParamArr = [type, description, date, amount, category];
    return this.run(sqlstr, sqlParamArr);
  }

  updateOne({ codigo, type, description, date, amount, category }) {
    const sqlstr = 'UPDATE bitacora set type = ?, description = ?, date = ?, amount = ?, category = ? where id = ?;';
    const sqlParamArr = [type, description, date, amount, category, codigo];
    return this.run(sqlstr, sqlParamArr);
  }

  deleteOne({ codigo }) {
    const sqlstr = 'DELETE FROM bitacora where id = ?;';
    const sqlParamArr = [codigo];
    return this.run(sqlstr, sqlParamArr);
  }

}