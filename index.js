var Scatter = require('scatter');
var scatter = new Scatter;
scatter.registerParticles(__dirname);
scatter.setNodeModulesDir(__dirname + '/node_modules');

var wascallyRabbit = {};

scatter.load('wascallyWrapper').then(function(wr) {
        wascallyRabbit = wr;
        console.log("channel is open")
    },
        function(err) {console.log("Error", err);
    }
);

module.exports = wascallyRabbit;