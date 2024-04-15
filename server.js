require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const url = require('url');
const { detector, getDevice, checkDevice, WebSocketClient, sendMessage } = require('./helpers/clientDeviceHelper');
const { verifyWebsocketJwtRegister } = require('./helpers/jwtHelper');
const { validateTenant, validateRegister } = require('./validators/tenant');

const webSocketServer = require('./webSocketServer');
const { register, createTenant, createUser } = require('./controllers/tenantController');
const apiKeyApiSecret = require('./middlewares/apiKeyApiSecret');

const app = express();
const server = http.createServer(app);
const PORT = 3000;

const clients = new WebSocketClient();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post('/tenant/register', apiKeyApiSecret, register);

app.post('/user/create', apiKeyApiSecret, createUser);

app.post('/tenant/create', apiKeyApiSecret, async (req, res) => {
    try {
        const validated = await validateTenant.validate(req.body);
        const result = await createTenant(validated);
  
        return res.status(201).json(result);
    } catch(error) {
        return res.status(400).json({ error: error.name, message: error.message });
    }
});

app.post('/client/send-message', apiKeyApiSecret, async (req, res) => sendMessage(req, res, clients.clientList));

webSocketServer(server, async function connection(websocketConnection, connectionRequest) {
    const userAgent = connectionRequest.headers['user-agent'];
    const result = detector.detect(userAgent);
    const params = url.parse(connectionRequest.url, true).query;
    const device = getDevice(result);
    const { token } = params;

    if (!token) {
        websocketConnection.close();
    }

    const clientData = verifyWebsocketJwtRegister(token);

    checkDevice(device, clientData.user_id, clientData.tenant_id).then((clientKey) => {
        clients.saveClient(clientKey, websocketConnection);
    }).catch(error => {
        console.log(error);
        websocketConnection.close();
        clients.removeClient(`${clientData.user_id}_${clientData.tenant_id}`);
    });
});

server.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    mongoose.connect(process.env.MONGO_DB_CONNECTION, { autoIndex: true }).then(() => {
        console.log("Mongo DB connection established!");
    });
});
