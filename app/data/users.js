const users = [
    {
        id: 1,
        email: 'admin@email.fr',
        password: 'adminPW',
        scopes: ['payments:rw', 'invoices:rw', 'users:rw'],
    },
    {
        id: 2,
        email: 'accountant@email.fr',
        password: 'accountantPW',
        scopes: ['payments:r', 'invoices:rw'],
    },
    {
        id: 3,
        email: 'support@email.fr',
        password: 'supportPW',
        scopes: ['payments:r', 'invoices:r'],
    },
    {
        id: 4,
        email: 'customer@email.fr',
        password: 'customerPW',
        scopes: ['payments:r'],
    },
];

export default users;
