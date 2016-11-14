'use strict';

let crypto = require('crypto');

// Do not send the same message twice to the same recipient

module.exports.title = 'Loop Breaker';
module.exports.init = function (app, done) {

    app.addHook('sender:fetch', (delivery, next) => {
        if (!delivery.envelope.to) {
            return next();
        }

        let loopFields = delivery.headers.getDecoded('X-Zone-Loop');

        // check existing loop headers (max 100 to avoid checking too many hashes)
        for (let i = 0, len = Math.min(loopFields.length, 100); i < len; i++) {
            let field = (loopFields[i].value || '').toLowerCase().trim();
            let salt = field.substr(0, 12);
            let hash = field.substr(12);
            let hmac = crypto.createHmac(app.config.algo, app.config.secret);
            hmac.update(salt);
            hmac.update(delivery.envelope.to);
            let result = hmac.digest('hex');
            if (result.toLowerCase() === hash) {
                // Loop detected!
                let err = new Error('Detected routing loop for ' + delivery.envelope.to);
                delivery.skipBounce = err.message;
                return next(err);
            }
        }

        // add loop detection header
        let salt = crypto.randomBytes(6).toString('hex').toLowerCase();
        let hmac = crypto.createHmac(app.config.algo, app.config.secret);
        hmac.update(salt);
        hmac.update(delivery.envelope.to);
        let result = salt + hmac.digest('hex').toLowerCase();
        delivery.headers.add('X-Zone-Loop', result);

        next();
    });

    done();
};
