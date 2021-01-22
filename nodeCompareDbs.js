const { Client } = require('pg');
var fs = require('fs'); 
const { stringify } = require('querystring');

// Start function
const start = async function(a, b) {
    console.log('hello friend...');
    var query = `SELECT * FROM Accounts`;  
    
    const clientOld = new Client({
        user: 'old',
        host: 'localhost',
        database: 'old',
        password: 'hehehe',
        port: 5432,
    });    
    await clientOld.connect();
    console.log("ok old connected, user and record cnt");
    console.log(clientOld.user);
    const resOld = await clientOld.query(query);
    console.log(resOld.rowCount);

    const clientNew = new Client({
        user: 'new',
        host: 'localhost',
        database: 'new',
        password: 'hahaha',
        port: 5433,
    });
    await clientNew.connect();
    console.log("ok new connected, user and record cnt");
    console.log(clientNew.user);    
    const resNew = await clientNew.query(query);
    console.log(resNew.rowCount);

    var missing = [];
    var mismatched = [];
    var newonnew = [];

    await Promise.all(resOld.rows.map(async (o) => {
        findquery = "SELECT * FROM Accounts WHERE Id = '" + o.id + "'" ;
        const resNewFx = await clientNew.query(findquery);
        // if we have 1 or more rows we found something
        if (resNewFx.rowCount && resNewFx.rowCount > 0) {
            // next lets compare
            if (o.id === resNewFx.rows[0].id) {
                if (o.email != resNewFx.rows[0].email || o.name != resNewFx.rows[0].name) { 
                    mismatched.push(o);
                } 
            }
        }
        else { 
            missing.push(o);
        };
    }));

    // stringify the JSON Object
    var jsonContent = JSON.stringify(mismatched);
    console.log("this is mismatched records cnt");
    console.log(mismatched.length);
    await fs.writeFile("output/mismatched.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("mismatch records have been saved to output/mismatched.json");
    }); 

    // stringify the JSON Object
    jsonContent = JSON.stringify(missing);
    console.log("this is missing records cnt");
    console.log(missing.length);
    await fs.writeFile("output/missing.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("missing records have been saved to output/missing.json");
    }); 

    // checking if records in new are in old (NEW)
    await Promise.all(resNew.rows.map(async (o) => {
        findquery = "SELECT * FROM Accounts WHERE Id = '" + o.id + "'" ;
        const resOldFx = await clientOld.query(findquery);
        if (!resOldFx.rowCount || resOldFx.rowCount === 0) {
            newonnew.push(o);
        };
    }));

    console.log("this is new records cnt");
    console.log(newonnew.length);
    jsonContent = JSON.stringify(newonnew);
    await fs.writeFile("output/newOnNew.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("newOnNew records have been saved to output/newOnNew.json");
    }); 

    // lets close up this pony show
    await clientOld.end();
    await clientNew.end();
    console.log('we`re done here...');
    console.log('goodbye');
};

// Call start
start();