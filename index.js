var wascallyRabbit = null;

var WascallyRabbit = require('./wascallyWrapper');

if (!wascallyRabbit) {
    wascallyRabbit = new WascallyRabbit;
}

module.exports = wascallyRabbit;
