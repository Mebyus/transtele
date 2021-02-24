import * as sqlite3 from 'sqlite3';

sqlite3.verbose();
const db = new sqlite3.Database('C:/Apps/SQLite3/transtele_db');
export default db;
