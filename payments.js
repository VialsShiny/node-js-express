import express from 'express';
import jwt from 'jsonwebtoken';

const SECRET = 'abcdefg';
const PORT = 3000;
const HOST = 'localhost';

const app = express()
    .post('/payments', async (req, res, next) => {
        const credentials = req.headers.authorization.split(' ');

        console.log(credentials);

        if (credentials.length !== 2 || credentials[0] !== 'Bearer') {
            return res.sendStatus(401);
        }

        const token = credentials[1];

        console.log(token);

        const payload = jwt.verify(token, SECRET);

        console.log(payload);

        if (!payload.scope.includes('payments:rw')) {
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
