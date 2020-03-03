var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
const assert = require('assert');
const stringify = require('csv-stringify');
var fs = require('fs');

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

        // user input
        var uids = ['esabbagh', 'jszczyg2'];


        var url = 'ldaps://fds.ford.com:636';
        var dn = 'fordGID=2178281,OU=Employee,OU=People,O=ford,C=US';
        var passwd = 'WYEM=7naft';
        var count = 0;


        var client = ldap.createClient({ url: url });
        var assertNoError = function (err) { assert.ifError(err); }
        client.bind(dn, passwd, assertNoError);


        var baseDn = 'OU=Employee,OU=People,O=ford,C=US';
        // var filter = '(|' + uids.map((u) => '(uid=' + u + ')').join('') + ')';
        var filter = '(objectClass=User)'
        console.log(filter);
        var opts = {
            filter: filter,
            scope: 'sub', //sub
            paged: false,
            sizeLimit: 10,
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
        client.search(baseDn, opts, function (err, result) {
            assert.ifError(err);

            result.on('searchEntry', function (entry) {
                entries.push(entry.object);
                count++;
                // console.log('entry:',entry.object)
            });
            result.on('searchReference', function (referral) {
                console.log('referral: ' + referral.uris.join());
            });
            result.on('error', function (err) {
                console.error('count: ' + count);
                console.error('error: ' + err.message);
                res.json(err); // TODO - deal with all entries
            });
            result.on('end', function (result) {
                console.log('status: ' + result.status);
                console.log(entries); // TODO - deal with all entries
                res.json(entries); // TODO - deal with all entries
                client.unbind(function (err) { assertNoError(err); client.destroy(assertNoError); });
            });
        });


    } catch (ex) {
        res.send(ex);
    }



});

router.get('/test', function (req, res) {
    try {
        var url = 'ldaps://fds.ford.com:636';
        var dn = 'fordGID=2178281,OU=Employee,OU=People,O=ford,C=US';
        var passwd = 'WYEM=7naft';
        var count = 0;


        var client = ldap.createClient({ url: url });
        var assertNoError = function (err) { assert.ifError(err); }
        client.bind(dn, passwd, assertNoError);


        var baseDn = 'OU=Employee,OU=People,O=ford,C=US';
        // var filter = '(|' + uids.map((u) => '(uid=' + u + ')').join('') + ')';
        var filter = '(objectClass=User)'
        console.log(filter);
        var opts = {
            filter: filter,
            scope: 'sub', //base, one, sub
            paged: false, //1000
            sizeLimit: 10,
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
                'dn',
                'manager',
                'fordLastModified',
                'fordDisplayName',
                'userPrincipalName'
            ]
        };

        var entries = [];
        client.search(baseDn, opts, function (err, result) {
            assert.ifError(err);

            result.on('searchEntry', function (entry) {
                entries.push(entry.object);
                count++;
                if (count % 10000 == 0) {
                    console.log(count);
                }
            });

            result.on('end', function (result) {
                stringify(entries, { delimiter: ",", header: true, columns: [
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
                    'dn',
                    'manager',
                    'fordLastModified',
                    'fordDisplayName',
                    'userPrincipalName'
                ] }).pipe(
                    fs.createWriteStream('C:/Users/dvalen48/Documents/test2.csv', { flags: 'w' })
                ).on('finish', function () {
                    res.json(entries);
                })
                client.unbind(function (err) { assertNoError(err); client.destroy(assertNoError); });
            });
            result.on('error', function (err) {
                console.error('count: ' + count);
                console.error('error: ' + err.message);
                if (err.message == 'Size Limit Exceeded') {
                    stringify(entries, { delimiter: ",", header: true, columns: [
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
                        'dn',
                        'manager',
                        'fordLastModified',
                        'fordDisplayName',
                        'userPrincipalName'
                    ] }).pipe(
                        fs.createWriteStream('C:/Users/dvalen48/Documents/test3.csv', { flags: 'w' })
                    ).on('finish', function () {
                        res.json(entries);
                    })
                } else {
                    res.json(err); // TODO - deal with all entries
                }
            });
        });
    } catch (ex) {
        res.send(ex);
    }

});
router.get('/test01', function (req, res) {
    try {
        var url = 'ldaps://fds.ford.com:636';
        var dn = 'fordGID=2178281,OU=Employee,OU=People,O=ford,C=US';
        var passwd = 'WYEM=7naft';
        var count = 0;
        var fileCount = 0;


        var client = ldap.createClient({ url: url });
        var assertNoError = function (err) { assert.ifError(err); }
        client.bind(dn, passwd, assertNoError);


        var baseDn = 'OU=Employee,OU=People,O=ford,C=US';
        // var filter = '(|' + uids.map((u) => '(uid=' + u + ')').join('') + ')';
        var filter = '(objectClass=User)'
        console.log(filter);
        var opts = {
            filter: filter,
            scope: 'sub', //base, one, sub
            paged: true,
            sizeLimit: 1000,
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
                'dn',
                'manager',
                'fordLastModified',
                'fordDisplayName',
                'userPrincipalName'
            ]
        };

        var entries = [];
        client.search(baseDn, opts, function (err, result) {
            assert.ifError(err);

            var temp = [];
            result.on('searchEntry', async function (entry) {
                temp = []
                temp.push(entry.object)
                if (count == 0) {
                    //create
                    await new ObjectsToCsv(temp).toDisk('C:/Users/dvalen48/Documents/sub' + fileCount + '.csv');
                } else if (count == 50000) {
                    count = 0;
                    fileCount++;
                    console.log(fileCount);
                    //create
                    await new ObjectsToCsv(temp).toDisk('C:/Users/dvalen48/Documents/sub' + fileCount + '.csv');
                } else {
                    //append
                    await new ObjectsToCsv(temp).toDisk('C:/Users/dvalen48/Documents/sub' + fileCount + '.csv', { append: true });
                }
                count++;
            });
            result.on('searchReference', function (referral) {
                console.log('referral: ' + referral.uris.join());
            });
            res.on('page', function (result) {
                console.log('page end');
            });
            result.on('end', function (result) {
                console.log('status: ' + result.status);
                console.log(count); // TODO - deal with all entries
                res.json(count); // TODO - deal with all entries
                client.unbind(function (err) { assertNoError(err); client.destroy(assertNoError); });
            });
            result.on('error', function (err) {
                console.error('count: ' + count);
                console.error('error: ' + err.message);
                res.json(err); // TODO - deal with all entries
            });
        });


    } catch (ex) {
        res.send(ex);
    }

});

router.get('/test02', function (req, res) {
    try {
        var url = 'ldaps://fds.ford.com:636';
        var dn = 'fordGID=2178281,OU=Employee,OU=People,O=ford,C=US';
        var passwd = 'WYEM=7naft';
        var count = 0;


        var client = ldap.createClient({ url: url });
        var assertNoError = function (err) { assert.ifError(err); }
        client.bind(dn, passwd, assertNoError);


        var baseDn = 'OU=Employee,OU=People,O=ford,C=US';
        // var filter = '(|' + uids.map((u) => '(uid=' + u + ')').join('') + ')';
        var filter = '(objectClass=User)'
        console.log(filter);
        var opts = {
            filter: filter,
            scope: 'sub', //base, one, sub
            paged: 1000,
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
                'dn',
                'manager',
                'fordLastModified',
                'fordDisplayName',
                'userPrincipalName'
            ]
        };

        var entries = [];
        client.search(baseDn, opts, function (err, result) {
            assert.ifError(err);

            result.on('searchEntry', function (entry) {
                entries.push(entry.object);
                count++;
                if (count % 10000 == 0) {
                    console.log(count);
                }
            });
            result.on('searchReference', function (referral) {
                console.log('referral: ' + referral.uris.join());
            });
            res.on('page', function (result) {
                console.log('page end');
            });
            result.on('end', function (result) {
                new ObjectsToCsv(entries).toDisk('C:/Users/dvalen48/Documents/test.csv');
                client.unbind(function (err) { assertNoError(err); client.destroy(assertNoError); });
            });
            result.on('error', function (err) {
                console.error('count: ' + count);
                console.error('error: ' + err.message);
                res.json(err); // TODO - deal with all entries
            });
        });


    } catch (ex) {
        res.send(ex);
    }

});

module.exports = router;
