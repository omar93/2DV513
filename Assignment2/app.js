const mysql = require('mysql')
const fs = require('fs')
const readline = require('readline')
const { performance } = require('perf_hooks')

let startTimer = performance.now()

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'reddit-keys'
})


connection.connect(function (error) {
    if (!error) {
        console.log('we are connected to the database')
        readDataFromFile()
    } else {
        throw error
    }
})

const readDataFromFile = () => {
    
    const lineReader = readline.createInterface({
        input: fs.createReadStream('./lib/RC_2007-10')
    })

    lineReader.on('line', line => {
        let data = JSON.parse(line)
        saveToDB(data)
    })

}

const saveToDB = data => {
    let linkData = [[data.link_id.split('_')[1], data.link_id, data.subreddit]]
    let linkTable = 'INSERT IGNORE INTO link (id, name, subreddit_id) VALUES ?'
    connection.query(linkTable, [linkData],  (error, result) => {
        if (error) {
            throw error
        }
    })

    let subredditData = [[data.subreddit_id, data.subreddit]]
    let subredditTable = 'INSERT IGNORE INTO subreddit (id, name) VALUES ?'
    connection.query(subredditTable, [subredditData], (error, result) => {
        if (error) {
            throw error
        }
    })

    let commentData = [[data.id, data.name, data.author, data.score, data.body, data.created_utc, data.link_id, data.parent_id]]
    let commentTable = 'INSERT IGNORE  INTO comments (id, name, author, score, body, created_utc, link_id, parent_id) VALUES ?'
    connection.query(commentTable, [commentData], (error, result) => {
        if (error) {
            throw error
        }
        let endTimer = performance.now()
        console.log(`Time without contraints ${endTimer - startTimer}ms`)
        // without constraints it took 26 minutes or 1574891ms
        // without constraints it took 13 minutes or 785052ms
    })

}