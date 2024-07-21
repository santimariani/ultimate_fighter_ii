import express from 'express';
import { Database } from './Database.js';
import cors from 'cors';

const app = express();
const port = 3000;
const database = new Database();

app.use(cors());
app.use(express.json());

app.post('/save', (req, res) => {
    const { round, step, heroStats, enemyStats } = req.body;
    database.saveGame(round, step, heroStats, enemyStats);
    res.status(200).send('Game saved');
});

app.get('/load', (req, res) => {
    database.loadGame((savePoint) => {
        if (savePoint) {
            res.status(200).json(savePoint);
        } else {
            res.status(404).send('No save point found');
        }
    });
});

app.post('/clear', (req, res) => {
    database.clearSaves();
    res.status(200).send('All saves cleared');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
