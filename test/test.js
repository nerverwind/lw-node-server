var chai = require('chai');
var assert = chai.assert;

var TokenPosNodeServer = require('../index');
var svc = new TokenPosNodeServer({});

describe('tokenpos node server', function(){

    it('server', function() {
        svc.start(() => {
            console.log(`listen on ${svc.prot}`);

            svc.appendRouter('/test', function(req, res) {
                res.send({
                    t: 'x'
                });
            });

        });
    });

});