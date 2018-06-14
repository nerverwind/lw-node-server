var chai = require('chai');
var assert = chai.assert;

var LwNodeServer = require('../index');
var svc = new LwNodeServer({});

describe('tokenpos node server', function(){

    it('server', function() {
        svc.start(() => {
            console.log(`listen on ${svc.port}`);

            svc.appendRouter('/test', function(req, res) {
                res.send({
                    t: 'x'
                });
            });

        });
    });

});