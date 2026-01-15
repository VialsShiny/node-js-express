import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import payments from './data/payments.js';

const SECRET = dotenv.config({path: './.env'}).parsed.SECRET;
const PORT = 5000;
const HOST = 'localhost';

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

const app = express()
    .use(express.urlencoded({extended: true}))
    .use(authMiddleware)
    .get(
        '/payments/:id',
        middlewareCheckPermission(['payments:r', 'payments:rw']),
        async (req, res, next) => {
            const payementID = req.params.id;
            const payload = req.payload;

            const paymentUser = payments.find((payment) => {
                return payment.userId == payload.id && payment.id == payementID;
            });

            if (!paymentUser)
                return res.status(401).json({
                    status: 401,
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
            const payload = req.payload;

            res.status(200).json({
                status: 200,
                message: 'Accés Autorisé',
            });
        }
    )
    .delete(
        '/payments/:id',
        middlewareCheckPermission(['payments:rw']),
        async (req, res, next) => {
            // delete payment
        }
    );

app.listen(PORT, HOST, () => {
    console.log(`Listening at: ${HOST}:${PORT}`);
});
