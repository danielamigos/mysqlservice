var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');

var dn = 'fordGID=2178281,OU=Employee,OU=People,O=ford,C=US';
var pass = 'WYEM=7naft';

router.get('/bind', function (req, res) {
    console.log('first')
    try {
        var client = ldap.createClient({
            url: req.query.url
        });
        console.log('second')
        client.bind(dn, pass, function (err, ldapRes) {
            console.log('third')
            assert.ifError(err);
            res.send(ldapRes);
        });

    } catch (ex) {
        console.log('forth')
        res.send(ex);
    }

});

module.exports = router;
