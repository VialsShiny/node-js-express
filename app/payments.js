import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

const SECRET = dotenv.config({path: './.env'}).parsed.SECRET;
const PORT = 5000;
const HOST = 'localhost';

const app = express()
    .post('/payments', async (req, res, next) => {
        const credentials = req.headers.authorization.split(' ');

        if (credentials.length !== 2 || credentials[0] !== 'Bearer') {
            return res.sendStatus(401);
        }

        const token = credentials[1];
        const payload = jwt.verify(token, SECRET);

        if (!payload.scope.includes('payments:r')) {
            return res.sendStatus(401);
        }

        res.status(200).json({
            token,
        });
    })
    .post('/invoices', async (req, res, next) => {
        res.status(200).json({
            token,
        });
    });

app.listen(PORT, HOST, () => {
    console.log(`Listening at: ${HOST}:${PORT}`);
});
