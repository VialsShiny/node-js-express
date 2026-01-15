import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import users from './data/users.js';

const SECRET = dotenv.config({path: './.env'}).parsed.SECRET;
const PORT = 3000;
const HOST = 'localhost';

const app = express()
    .use(express.urlencoded({extended: true}))
    .post('/v2/login', async (req, res, next) => {
        const {email, password} = req.body;

        const userFound = users.find((user) => user.email === email);

        if (!userFound) {
            return res.sendStatus(404);
        }

        if (userFound) {
            if (userFound.password !== password) {
                return res.sendStatus(401);
            }
        }

        const token = jwt.sign(
            {
                email: userFound.email,
                id: userFound.id,
                scope: userFound.scopes,
            },
            SECRET,
            {
                algorithm: 'HS256',
                expiresIn: '1d',
            }
        );

        res.status(200).json({
            token,
        });
    });

app.listen(PORT, HOST, () => {
    console.log(`Listening at: ${HOST}:${PORT}`);
});

// Mi43ZDljYjhpMmF1Y2h5ajV6czh2Z2Yza2c=
