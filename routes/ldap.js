var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
const assert = require('assert');

var dn = 'fordGID=2178281,OU=Employee,OU=People,O=ford,C=US';
var pass = 'WYEM=7naft';

router.get('/bind', function (req, res) {
    try {

        var client = ldap.createClient({
            url: req.query.url
        });

        client.bind(dn, pass, function (err) {
            assert.ifError(err);
        });

        // Search AD for user
        const searchOptions = {
            scope: "sub",
            filter: `(userPrincipalName=${userPrincipalName})`
        };

        client.search(adSuffix, searchOptions, (err, res) => {
            assert.ifError(err);

            res.on('searchEntry', entry => {
                console.log(entry.object.name);
            });
            res.on('searchReference', referral => {
                console.log('referral: ' + referral.uris.join());
            });
            res.on('error', err => {
                console.error('error: ' + err.message);
            });
            res.on('end', result => {
                console.log(result);
            });
        });

        // Wrap up
        client.unbind(err => {
            assert.ifError(err);
        });

    } catch (ex) {
        res.send(ex);
    }



});




router.get('/essam', function (req, res) {
    try {
        var ldap = require('ldapjs');
        var assert = require('assert');

        // user input
        var uids = process.argv.slice(2);


        var url = 'ldaps://fds.ford.com:636';
        var dn = 'fordGID=2178281,OU=Employee,OU=People,O=ford,C=US';
        var passwd = 'WYEM=7naft';


        var client = ldap.createClient({ url: url });
        var assertNoError = function (err) { assert.ifError(err); }
        client.bind(dn, passwd, assertNoError);


        var baseDn = 'OU=Employee,OU=People,O=ford,C=US';
        var filter = '(|' + uids.map((u) => '(uid=' + u + ')').join('') + ')';
        var opts = {
            filter: filter,
            scope: 'sub',
            attributes: [
                'uid',
                'givenName',
                'sn',
                'title',
                'fordJobFamily',
                'telephoneNumber',
                'roomNumber',
                'fordMRRole',
                'fordManagerCDSID',
                'company',
                'fordBldgAbbr',
                'fordBldgName',
                'fordBuildingCC',
                'fordBusinessUnitCode',
                'fordDivAbbr',
                'fordDivision',
                'fordDeptCode',
                'fordDeptName',
            ]
        };

        var entries = [];
        client.search(baseDn, opts, function (err, res) {
            assert.ifError(err);

            res.on('searchEntry', function (entry) {
                entries.push(entry.object);
            });
            res.on('searchReference', function (referral) {
                console.log('referral: ' + referral.uris.join());
            });
            res.on('error', function (err) {
                console.error('error: ' + err.message);
            });
            res.on('end', function (result) {
                console.log('status: ' + result.status);
                console.log(entries); // TODO - deal with all entries
                client.unbind(function (err) { assertNoError(err); client.destroy(assertNoError); });
            });
        });


    } catch (ex) {
        res.send(ex);
    }



});

module.exports = router;
