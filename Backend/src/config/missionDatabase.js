const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Tentukan lokasi database
const dbPath = path.resolve(__dirname, '../db/missions.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS shapes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT,
            coordinates TEXT,
            center TEXT,
            radius REAL
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Shapes table created or already exists.');
            }
        });

        // Tambahkan kolom 'name' jika belum ada
        db.run(`ALTER TABLE shapes ADD COLUMN name TEXT`, (err) => {
            if (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log('Column "name" already exists.');
                } else {
                    console.error('Error adding column "name":', err.message);
                }
            } else {
                console.log('Column "name" added successfully.');
            }
        });
    }
});

module.exports = db;

// DIBAWAH INI ADALAH CONTOH

// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();
// // Pastikan folder db ada
// const dbFolder = path.resolve(__dirname, '../db');
// if (!fs.existsSync(dbFolder)){
//     fs.mkdirSync(dbFolder, { recursive: true });
// }
// const dbPath = path.resolve(__dirname, '../db/missions.sqlite');
// const db = new sqlite3.Database(dbPath, (err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//     } else {
//         console.log('Connected to SQLite database');
//         initializeDatabase();
//     }
// });
// function initializeDatabase() {
//     db.serialize(() => {
//         db.run(`
//             CREATE TABLE IF NOT EXISTS missions (
//                 mission_id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 nama TEXT NOT NULL,
//                 coord TEXT NOT NULL,
//                 home TEXT NOT NULL,
//                 geoJSON TEXT
//             )
//         `, (err) => {
//             if (err) {
//                 console.error('Error creating table:', err);
//             } else {
//                 console.log('Database initialized successfully');
//             }
//         });
//     });
// }
// module.exports = db;