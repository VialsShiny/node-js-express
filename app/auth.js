import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import {generateQuery} from './components/generateQuery.js';
import getRoleScope from './components/roleScopes.js';

const SECRET = dotenv.config({path: './.env'}).parsed.SECRET;
const PORT = 3000;
const HOST = 'localhost';

const db = new Database('data/db.sqlite', {
    fileMustExist: true,
    verbose: console.warn,
});

function getUserByEmail(email) {
    const inputs = [
        'u.id',
        'u.email',
        'u.password AS user_password',
        'r.name AS role_name',
        'p.price AS last_payment',
    ];
    const from = '"user" u';
    const inners = [
        '"role" r ON u.role_id = r.id',
        '"payment" p ON p.user_id = u.id',
    ];
    const where = 'u.email = @email';

    const query = generateQuery(inputs, from, inners, where);

    const stmt = db.prepare(query);
    return stmt.get({email}) ?? null;
}

const app = express()
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .post('/v2/login', (req, res) => {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const userFound = getUserByEmail(email);

        if (!userFound) {
            return res.sendStatus(404);
        }

        if (userFound.user_password !== password) {
            return res.sendStatus(401);
        }

        const token = jwt.sign(
            {
                email: userFound.email,
                id: userFound.id,
                scope: getRoleScope(userFound.role_name),
            },
            SECRET,
            {expiresIn: '1d'}
        );

        res.status(200).json({token});
    });

app.listen(PORT, HOST, () => {
    console.log(`Listening at: ${HOST}:${PORT}`);
});

// Mi43ZDljYjhpMmF1Y2h5ajV6czh2Z2Yza2c=
