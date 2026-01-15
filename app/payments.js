import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import payments from './data/payments.js';

const SECRET = dotenv.config({path: './.env'}).parsed.SECRET;
const PORT = 5000;
const HOST = 'localhost';

const app = express()
    .use((req, res, next) => {
        const credentials = req.headers.authorization.split(' ');

        if (credentials.length !== 2 || credentials[0] !== 'Bearer') {
            return res.sendStatus(401);
        }

        const token = credentials[1];
        const payload = jwt.verify(token, SECRET);

        req.payload = payload;
        return next();
    })
    .get('/payments/:id', async (req, res, next) => {
        const payload = req.payload;
        if (!payload.scope.includes('payments:r')) {
            return res.sendStatus(401);
        }
        console.log(payload);

        const payment = payments.find(
            (payment) => payment.userId == payload.id
        );

        if (!payment) payment = 'Pas de payement trouvé';

        res.status(200).json({
            status: 200,
            message: 'Accés Autorisé',
            payment,
        });
    })
    .post('/payments', async (req, res, next) => {
        const payload = req.payload;
        if (!payload.scope.includes('payments:rw')) {
            return res.sendStatus(401);
        }

        res.status(200).json({
            status: 200,
            message: 'Accés Autorisé',
        });
    })
    .delete('/payments/:id', async (req, res, next) => {
        // delete payment
    });

app.listen(PORT, HOST, () => {
    console.log(`Listening at: ${HOST}:${PORT}`);
});
