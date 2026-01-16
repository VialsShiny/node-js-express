/**
 * Génère une requête SQL SELECT dynamique pour SQLite.
 *
 * @param {string|string[]} INPUTS - Colonnes à sélectionner (ex: "u.id, u.email" ou ["u.id", "u.email"])
 * @param {string} FROM - Table principale avec alias (ex: '"user" u')
 * @param {string[]} INNERS - Tableau de INNER JOIN. Chaque élément est une chaîne SQL du type :
 *                            '"role" r ON u.role_id = r.id'
 *                            La fonction construira autant de INNER JOIN que nécessaire.
 * @param {string} WHERE - Clause WHERE (ex: 'u.email = @email') ou undefined
 * @returns {string} Requête SQL complète
 */
export function generateQuery(INPUTS, FROM, INNERS = [], WHERE = '') {
    const selectClause = Array.isArray(INPUTS) ? INPUTS.join(', ') : INPUTS;
    const joinClause =
        INNERS.length > 0
            ? '\n' + INNERS.map((join) => `INNER JOIN ${join}`).join('\n')
            : '';
    const whereClause = WHERE ? `\nWHERE ${WHERE}` : '';
    const query = `
    SELECT
      ${selectClause}
    FROM ${FROM}${joinClause}${whereClause}
  `;
    return query.trim();
}

/**
 * Génère une requête SQL INSERT dynamique pour SQLite avec placeholders.
 *
 * @param {string} table - Nom de la table (ex: '"payment"')
 * @param {string[]} fields - Colonnes de la table (ex: ['user_id', 'price', 'created_at'])
 * @returns {string} Requête SQL INSERT avec placeholders @field
 *
 * Exemple :
 * generateInsertQuery('payment', ['user_id','price','created_at'])
 * -> INSERT INTO payment (user_id, price, created_at) VALUES (@user_id, @price, @created_at);
 */
export function generateInsertQuery(table, fields) {
    const columns = fields.join(', ');
    const placeholders = fields.map((f) => `@${f}`).join(', ');
    return `INSERT INTO ${table} (${columns}) VALUES (${placeholders});`;
}

/**
 * Génère une requête SQL UPDATE dynamique pour SQLite avec placeholders.
 *
 * @param {string} table - Nom de la table (ex: 'payment')
 * @param {string[]} fieldsToUpdate - Colonnes à mettre à jour (ex: ['price','created_at'])
 * @param {string|string[]} where - Clause WHERE : soit une string déjà formatée
 *                                   (ex: 'id = @id AND user_id = @user_id'),
 *                                   soit un array de champs (ex: ['id']) qui sera transformé en 'id = @id'
 * @returns {string} Requête SQL UPDATE avec placeholders
 *
 * Exemple :
 * generateUpdateQuery('payment', ['price'], ['id'])
 * -> UPDATE payment SET price = @price WHERE id = @id;
 */
export function generateUpdateQuery(table, fieldsToUpdate, where) {
    if (!Array.isArray(fieldsToUpdate) || fieldsToUpdate.length === 0) {
        throw new Error(
            'generateUpdateQuery: fieldsToUpdate must be a non-empty array'
        );
    }

    const setClause = fieldsToUpdate.map((f) => `${f} = @${f}`).join(', ');

    let whereClause = '';
    if (!where) {
        throw new Error(
            'generateUpdateQuery: WHERE clause is required to avoid updating all rows'
        );
    } else if (typeof where === 'string') {
        whereClause = where;
    } else if (Array.isArray(where)) {
        whereClause = where.map((f) => `${f} = @${f}`).join(' AND ');
    } else {
        throw new Error(
            'generateUpdateQuery: where must be a string or an array of field names'
        );
    }

    return `UPDATE ${table} SET ${setClause} WHERE ${whereClause};`;
}

/**
 * Génère une requête SQL DELETE dynamique pour SQLite avec placeholders.
 *
 * @param {string} table - Nom de la table (ex: 'payment')
 * @param {string|string[]} where - Clause WHERE : soit une string déjà formatée
 *                                   (ex: 'id = @id'), soit un array de champs (ex: ['id','user_id'])
 * @returns {string} Requête SQL DELETE avec placeholders
 *
 * ATTENTION : empêche les DELETE sans WHERE (protection contre suppression totale).
 *
 * Exemple :
 * generateDeleteQuery('payment', ['id'])
 * -> DELETE FROM payment WHERE id = @id;
 */
export function generateDeleteQuery(table, where) {
    if (!where) {
        throw new Error(
            'generateDeleteQuery: WHERE clause is required to avoid deleting all rows'
        );
    }

    let whereClause = '';
    if (typeof where === 'string') {
        whereClause = where;
    } else if (Array.isArray(where)) {
        whereClause = where.map((f) => `${f} = @${f}`).join(' AND ');
    } else {
        throw new Error(
            'generateDeleteQuery: where must be a string or an array of field names'
        );
    }

    return `DELETE FROM ${table} WHERE ${whereClause};`;
}
