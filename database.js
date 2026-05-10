const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// Membuka koneksi ke database
async function getDbConnection() {
    return open({
        filename: process.env.DB_FILENAME || './expenses.sqlite',
        driver: sqlite3.Database
    });
}

// Inisialisasi tabel jika belum ada
async function initDb() {
    const db = await getDbConnection();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            category TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Database initialized.');
    return db;
}

module.exports = {
    getDbConnection,
    initDb
};
