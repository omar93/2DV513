const mysql = require('mysql')
const fs = require('fs')
const readline = require('readline')

const readInterface = readline.createInterface({
    input: fs.createReadStream('./lib/RC_2007-10'),
    output: process.stdout,
    console: false
});

readInterface.on('line', function(line) {
    console.log(line);
});