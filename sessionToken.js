import argon2 from 'argon2';
import generateSecureRandomString from './randomString.js';

export default async function createToken(id) {
    const tokenId = generateSecureRandomString();
    const tokenEncrypted = await argon2.hash(tokenId);
    return {
        tokenId: tokenId,
        tokenEncrypted: tokenEncrypted,
        session: Buffer.from(`${id}.${tokenId}`).toString('base64'),
    };
}
