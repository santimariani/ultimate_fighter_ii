import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname to ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Database {
    constructor() {
        this.dbPath = path.resolve(__dirname, 'game.db');
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Could not connect to database', err);
            } else {
                console.log('Connected to database');
                this.createTable();
            }
        });
    }

    createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS save_points (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                round INTEGER,
                step TEXT,
                heroStats TEXT,
                enemyStats TEXT
            )
        `;
        this.db.run(query, (err) => {
            if (err) {
                console.error('Could not create table', err);
            } else {
                console.log('Table created or already exists');
            }
        });
    }

    saveGame(round, step, heroStats, enemyStats) {
        const query = `
            INSERT INTO save_points (round, step, heroStats, enemyStats)
            VALUES (?, ?, ?, ?)
        `;
        this.db.run(query, [round, step, JSON.stringify(heroStats), JSON.stringify(enemyStats)], (err) => {
            if (err) {
                console.error('Could not save game', err);
            } else {
                console.log('Game saved');
            }
        });
    }

    loadGame(callback) {
        const query = `
            SELECT * FROM save_points ORDER BY id DESC LIMIT 1
        `;
        this.db.get(query, (err, row) => {
            if (err) {
                console.error('Could not load game', err);
                callback(null);
            } else {
                callback(row);
            }
        });
    }

    clearSaves() {
        const query = `
            DELETE FROM save_points
        `;
        this.db.run(query, (err) => {
            if (err) {
                console.error('Could not clear saves', err);
            } else {
                console.log('All saves cleared');
            }
        });
    }
}
