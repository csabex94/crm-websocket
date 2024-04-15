
const url = require('url');
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

module.exports = (req, res, next) => {
    const { api_key, api_secret } = url.parse(req.url, true).query;

    if (!api_key || !api_secret) {
        return res.status(401).json({ error: "Unauthorized." });
    }

    if (api_key === API_KEY && api_secret === API_SECRET) {
        return next();
    }

    return res.status(401).json({ error: "Unauthorized." });
}