const DeviceDetector = require('node-device-detector');
const Register = require('../models/Register');
const Tenant = require('../models/Tenant');
const User = require('../models/User');

const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});

const getDevice = (result) => {
    const platform = `${result.os.name} ${result.os.version}`;
    let deviceType = result.device.type;
    const capitalised = deviceType.charAt(0).toUpperCase() + deviceType.slice(1)
    const browser = result.client.name;
    return { platform, device: capitalised, browser };
}

const checkDevice = async (deviceInfo, userId, tenantId) => {
    const tenant = await Tenant.findById(tenantId).exec();
    const user = await User.findById(userId).exec();
    if (!tenant) {
        throw new Error('Tenant not found');
    }

    if (!user) {
        throw new Error('User not found');
    }

    const platform = deviceInfo.platform === user.platform;
    const device = deviceInfo.device === user.device;
    const browser = deviceInfo.browser === user.browser;

    if (!platform || !device || !browser) {
        throw new Error('Untrusted client!');
    }

    return `${userId}_${tenantId}`
}

const sendMessage = (req, res, clients) => {
    try {
        const { message_data, user_id, tenant_id } = req.body;
        const client = clients[`${user_id}_${tenant_id}`];
        console.log(clients);
        if (!client) {
            throw new Error("Client not found.");
        }

        client.send(JSON.stringify(message_data));
        return res.status(200).json({ ok: true });
    } catch(error) {
        return res.status(400).json({ error: error.name, message: error.message });
    }
}

class WebSocketClient {
    constructor() {
        this.clientList = {};
        this.saveClient = this.saveClient.bind(this);
        this.removeClient = this.removeClient.bind(this);
    }

    saveClient(clientId, client) {
        this.clientList[clientId] = client;
    }

    removeClient(clientId) {
        delete clientId.clientId;
    }
}

module.exports = {
    detector,
    getDevice,
    checkDevice,
    WebSocketClient,
    sendMessage
}