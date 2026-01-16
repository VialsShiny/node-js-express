import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import {
    generateDeleteQuery,
    generateInsertQuery,
    generateQuery,
    generateUpdateQuery,
} from './components/generateQuery.js';

const SECRET = dotenv.config({path: './.env'}).parsed.SECRET;
const PORT = 5000;
const HOST = 'localhost';

const db = new Database('data/db.sqlite', {
    fileMustExist: true,
    verbose: console.warn,
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return res.sendStatus(401);

    try {
        req.payload = jwt.verify(token, SECRET);
        next();
    } catch {
        return res.sendStatus(401);
    }
};

const middlewareCheckPermission = (permissions) => (req, res, next) => {
    const {scope} = req.payload;

    for (const permission of permissions) {
        if (scope.includes(permission)) {
            return next();
        }
    }

    return res.sendStatus(403);
};

async function getUserAuth(userId, paymentID) {
    const inputs = ['*'];
    const from = '"payment" p';
    const where = 'p.user_id = @userId AND p.id = @paymentID';
    const inners = [];

    const query = generateQuery(inputs, from, inners, where);

    const stmt = db.prepare(query);
    return stmt.get({userId, paymentID}) ?? null;
}

async function createPaymentUser(
    userId,
    price,
    date = new Date().toISOString()
) {
    const table = 'payment';
    const fields = ['user_id', 'price', 'date'];

    const query = generateInsertQuery(table, fields);

    const stmt = db.prepare(query);
    return stmt.run({user_id: userId, price, date: date}) ?? null;
}

async function updatePaymentUser(
    userId,
    price,
    date = new Date().toISOString(),
    paymentID
) {
    const table = 'payment';
    const fields = ['user_id', 'price', 'date'];
    const where = 'id = @id';

    const checkId = await getUserAuth(userId, paymentID);

    if (!checkId) return null;

    const query = generateUpdateQuery(table, fields, where);

    const stmt = db.prepare(query);
    return (
        stmt.run({user_id: userId, price, date: date, id: paymentID}) ?? null
    );
}

async function deletePaymentUser(table, where, id) {
    const query = generateDeleteQuery(table, where);

    const stmt = db.prepare(query);
    return stmt.run({id: id}) ?? null;
}

const app = express()
    .use(express.urlencoded({extended: true}))
    .use(authMiddleware)
    .get(
        '/payments/:id',
        middlewareCheckPermission(['payments:r', 'payments:rw']),
        async (req, res, next) => {
            const paymentID = req.params.id;
            const payload = req.payload;

            const paymentUser = await getUserAuth(payload.id, paymentID);

            if (!paymentUser)
                return res.status(403).json({
                    status: 403,
                    message: 'Accés Refusé',
                });

            return res.status(200).json({
                status: 200,
                message: 'Accés Autorisé',
                paymentUser,
            });
        }
    )
    .post(
        '/payments',
        middlewareCheckPermission(['payments:rw']),
        async (req, res, next) => {
            const {price} = req.body;
            const payload = req.payload;

            const payment = await createPaymentUser(payload.id, price);

            res.status(200).json({
                status: 200,
                message: 'Payment bien ajouté en base de donnée !',
                payment,
            });
        }
    )
    .put(
        '/payments/:id',
        middlewareCheckPermission(['payments:rw']),
        async (req, res, next) => {
            const {id} = req.params;
            const {price, date} = req.body;
            const payload = req.payload;

            const payment = updatePaymentUser(payload.id, price, date, id);

            console.log(payment);

            if (!payment)
                res.status(404).json({
                    status: 404,
                    message: "Le payment définie n'a pas été trouver !",
                    payment,
                });

            res.status(200).json({
                status: 200,
                message: 'Payment bien modifié !',
                payment,
            });
        }
    )
    .delete(
        '/payments/:id',
        middlewareCheckPermission(['payments:rw']),
        async (req, res, next) => {
            const {id} = req.params;
            const paymentUser = await deletePaymentUser(
                'payment',
                'id = @id',
                id
            );

            if (!paymentUser)
                return res.status(403).json({
                    status: 403,
                    message: 'Accés Refusé',
                });

            return res.status(200).json({
                status: 200,
                message: 'Le payment a bien été suprimer !',
            });
        }
    );

app.listen(PORT, HOST, () => {
    console.log(`Listening at: ${HOST}:${PORT}`);
});
