const NodeCache = require('node-cache');
const searchCache = new NodeCache({ stdTTL: 300 }); // Cache 5 phút

const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = searchCache.get(key);

    if (cachedResponse) {
        return res.send(cachedResponse);
    }

    res.sendResponse = res.send;
    res.send = (body) => {
        searchCache.set(key, body);
        res.sendResponse(body);
    };

    next();
};

module.exports = cacheMiddleware;