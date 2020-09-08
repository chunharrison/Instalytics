const express = require('express')
const {spawn} = require('child_process');
const app = express()
const cors = require('cors')
const fs = require('fs');
const mkdirp = require('mkdirp')
const fetch = require('node-fetch')
const port = 5000

app.use(cors())

app.get('/api/login', (req, res) => {
    var dataToSend;
    
    console.log(req.query.login_user, req.query.login_pass)

    mkdirp('./' + req.query.login_user)

    // spawn new child process to call the python script
    const python = spawn('python', ['getData.py', req.query.login_user, req.query.login_pass]);


    // // collect data from script
    // python.stdout.on('data', function (data) {
    //     console.log('Pipe data from python script ...');
    //     dataToSend = data.toString();
    // });

    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.send(dataToSend)
    });
    
})

app.get('/api/average_likes', (req, res) => {
    console.log('performing average_likes!')
    console.log(`./${req.query.username}/`)
    fs.readdir(`./${req.query.username}/`, (err, files) => {
        console.log(files)

        // key = userName, value = average likes of their last 20 posts
        let retreivedData = {} 

        // loop through all the users that this person follows
        files.forEach(mediaMetadataJSON => {
            let mediaMetadata = require(`./${req.query.username}/${mediaMetadataJSON}`) // parse the media metadata json file 

            const numMedia = mediaMetadata.GraphImages.length // number of medias retreived

            let numLikes = 0 // total number of likes for this specific user
            let username = ''
            // loop through the retrieved metadata of medias
            mediaMetadata.GraphImages.forEach(media => {
                numLikes += media.edge_media_preview_like.count
                username = media.username
            })
            retreivedData[username] = (numLikes / numMedia).toFixed(2);
        }) 

        // shorthand but doesnt work rn
        // Object.keys(retreivedData).sort(function(a, b) {
        //     console.log(-(retreivedData[a] - retreivedData[b])) 
        // })
        
        let sorted = []
        for (var username in retreivedData) {
            sorted.push([username, retreivedData[username]]);
        }
        sorted.sort(function(a, b) {
            return b[1] - a[1];
        });

        console.log(sorted)
        res.send(sorted) 
    });
})

app.listen(port, () => console.log(`Listening on port ${port}!`))