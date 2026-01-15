import argon2 from 'argon2';
import express from 'express';
import generateSecureRandomString from './randomString.js';

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

        const tokenId = generateSecureRandomString();
        const tokenEncrypted = await argon2.hash(tokenId);
        const session = Buffer.from(`${userFound.id}.${tokenId}`).toString(
            'base64'
        );

        sessions.push({
            id: tokenId,
            userId: userFound.id,
            hash: tokenEncrypted,
        });

        return response.json({
            session: session,
        });
    });

app.listen(PORT, HOST, () => {
    console.log(`Listening at: ${HOST}:${PORT}`);
});
