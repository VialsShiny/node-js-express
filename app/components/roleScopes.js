/**
 * Retourne le tableau des scopes d'un rôle
 *
 * @param {string} role - Nom du rôle (ex: 'admin', 'accountant', 'support', 'customer')
 * @returns {Object} Tableau des scopes (ex: ['payments:rw', 'invoices:rw'])
 */
export default function getRoleScope(role) {
    const scopes = [];

    switch (role) {
        case 'admin':
            scopes.push('payments:rw');
            break;

        case 'accountant':
            scopes.push('payments:rw');
            break;

        case 'support':
            scopes.push('payments:r');
            break;

        case 'customer':
            scopes.push('payments:r');
            break;

        default:
            break;
    }

    return scopes;
}
