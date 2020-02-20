var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');

var dn = 'fordGID=2178281,OU=Employee,OU=People,O=ford,C=US';
var pass = 'WYEM=7naft';

router.get('/bind', function (req, res) {

    var client = ldap.createClient({
        url: req.query.url
    });

    client.bind(dn, pass, function (err, ldapRes) {
        assert.ifError(err);
        res.send(ldapRes);
        return;
    });

});

module.exports = router;
