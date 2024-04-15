const jwt = require('jsonwebtoken');

const verifyWebsocketJwtRegister = (token) => {
    const secret = process.env.NODE_REGISTER_WEBSOCKET_JWT_SECRET;

    const decoded = jwt.verify(token, secret);
    
    const { user_id, tenant_id } = decoded;

    if (!user_id || !tenant_id) {
        throw new Error('Invalid key!');
    }

    return { user_id, tenant_id };
}

module.exports = {
    verifyWebsocketJwtRegister
}