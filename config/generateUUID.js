const { v4: uuidv4, v6: uuidv6 } = require('uuid');

async function generateUUID(role) {
    const uuid = uuidv4().toUpperCase();
    const prefix = role === 'admin' ? 'ADM' : 'USR';
    const user_uuid = `${prefix}-${uuid}`;
    return user_uuid;
}

async function generateToken() {
    const token = uuidv6();
    return token;
}

module.exports = {
    generateUUID,
    generateToken,
}