const mysql2 = require("mysql2/promise");
class db {
  /**
   * @param {String} host
   * @param {String} root
   * @param {String} password
   * @param {String} database
   */
  constructor(host, root, password, databse) {
    this.host = host;
    this.root = root;
    this.password = password;
    this.databse = databse;
  }
  createPool() {
    const conn = mysql2.createPool({
      host: this.host,
      user: this.root,
      password: this.password,
      database: this.databse,
      waitForConnections: true,
    });
    return conn;
  }
}

module.exports = db;
