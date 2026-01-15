import express from 'express';
import jwt from 'jsonwebtoken';
import createToken from './sessionToken.js';

const SECRET = 'abcdefg';
const PORT = 3001;
const HOST = 'localhost';

const users = [
    {
        id: 1,
        email: 'test@email.fr',
        password: 'toto',
    },
    {
        id: 2,
        email: 'a@a.fr',
        password: 'testPW',
    },
];

const sessions = [];

const app = express()
    .use(express.urlencoded({extended: true}))
    .post('/login', async (request, response, next) => {
        const {email, password} = request.body;

        const userFound = users.find((user) => user.email === email);

        if (!userFound) {
            return response.sendStatus(404);
        }

        if (userFound) {
            if (userFound.password !== password) {
                return response.sendStatus(401);
            }
        }

        const {tokenEncrypted, tokenId, session} = await createToken(
            userFound.id
        );

        sessions.push({
            id: tokenId,
            userId: userFound.id,
            hash: tokenEncrypted,
        });

        return response.status(200).json({
            session: session,
        });
    })
    .get('/users/:userid', (request, response, next) => {
        const {userid} = request.params;

        const tokenSplit = request.headers.authorization.split(' ');

        console.log(tokenSplit);

        if (tokenSplit[0] !== 'Bearer' || tokenSplit.length < 2) {
            return response.sendStatus(401);
        }

        const session = Buffer.from(tokenSplit[1], 'base64').toString('utf-8');
        const sessionSplit = session.split('.');

        console.log(sessionSplit);
        if (sessionSplit.length !== 2) {
            return response.sendStatus(401);
        }

        const sessionUserId = sessionSplit[0];
        const sessionId = sessionSplit[1];

        const sessionFound = sessions.find(
            (session) => session.id === sessionId
        );

        if (
            !sessionFound ||
            sessionFound.userId !== Number.parseInt(sessionUserId)
        ) {
            return response.sendStatus(401);
        }

        const userFound = users.find(
            (user) => user.id === Number.parseInt(userid)
        );

        if (!userFound) {
            return response.sendStatus(404);
        }

        response.status(200).json(userFound);
    })
    .post('/v2/login', async (req, res, next) => {
        const token = jwt.sign(
            {
                username: 'user',
                userId: 1,
                scope: [
                    "payments:rw", "invoices:r"
                ]
            },
            SECRET,
            {
                algorithm: 'HS256',
                expiresIn: Math.floor(Date.now() / 1000) + 86400,
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
