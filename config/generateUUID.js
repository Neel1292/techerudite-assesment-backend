const { v4: uuidv4 } = require('uuid');

async function generateUUID(role) {
    const uuid = uuidv4().toUpperCase();
    const prefix = role === 'admin' ? 'ADM' : 'USR';
    const user_uuid = `${prefix}-${uuid}`;
    return user_uuid;
}

module.exports = {
    generateUUID,
}