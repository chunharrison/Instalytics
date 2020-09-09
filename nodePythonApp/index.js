const express = require('express')
const {spawn} = require('child_process');
const app = express()
const cors = require('cors')
const fs = require('fs');
const mkdirp = require('mkdirp')
const rimraf = require("rimraf");
const port = 5000

app.use(cors())

app.get('/api/store-metadata', (req, res) => {
    var dataToSend;
    
    console.log(req.query.login_user, req.query.login_pass)

    mkdirp(`./${req.query.login_user}`)

    // spawn new child process to call the python script
    const python = spawn('python', ['getData.py', req.query.login_user, req.query.login_pass]);

    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);

        const files = fs.readdirSync(`./${req.query.login_user}/`)
            
        if (files.length === 0) {
            rimraf.sync(`./${req.query.login_user}`)
            res.send('fail')
        }
        else {
            res.send('success')
        }
    });
    
})

app.get('/api/followers_to_likes', (req, res) => {
    console.log('performing followers_to_likes!')
    
    fs.readdir(`./${req.query.username}/`, (err, files) => {
        // key = userName, value = Like Follower Ratio
        let retreivedData = {} 

        // loop through all the users that this person follows
        files.forEach(mediaMetadataJSON => {
            let mediaMetadata = require(`./${req.query.username}/${mediaMetadataJSON}`) // parse the media metadata json file 
            
            const numFollowers = mediaMetadata.GraphProfileInfo.info.followers_count // number of followers
            const username = mediaMetadata.GraphProfileInfo.username // username

            if (mediaMetadata.GraphImages === undefined) { 
                retreivedData[username] = 'NaN'
                return 
            }

            const numMedia = mediaMetadata.GraphImages.length // number of medias retreived
            let numLikes = 0 // total number of likes for this specific user
            // loop through the retrieved metadata of medias
            mediaMetadata.GraphImages.forEach(media => {
                numLikes += media.edge_media_preview_like.count
            })
            retreivedData[username] = ((numLikes / numMedia) / numFollowers).toFixed(2);
        })
        
        let sorted = []
        for (var username in retreivedData) {
            sorted.push([username, retreivedData[username]]);
        }
        sorted.sort(function(a, b) {
            return b[1] - a[1];
        });
        // change to [{}, {}, ...]
        for(let i = 0; i < sorted.length; i++) {
            const newEntryFormat = {name: sorted[i][0], LFR: sorted[i][1]}
            sorted[i] = newEntryFormat
        }

        console.log(sorted)
        res.send(sorted) 
    });
})

app.get('/api/followers_to_comments', (req, res) => {
    console.log('performing followers_to_comments!')
    
    fs.readdir(`./${req.query.username}/`, (err, files) => {
        // key = userName, value = Comment Follower Ratio
        let retreivedData = {} 

        // loop through all the users that this person follows
        files.forEach(mediaMetadataJSON => {
            let mediaMetadata = require(`./${req.query.username}/${mediaMetadataJSON}`) // parse the media metadata json file 

            const numFollowers = mediaMetadata.GraphProfileInfo.info.followers_count // number of followers
            const username = mediaMetadata.GraphProfileInfo.username // username

            if (mediaMetadata.GraphImages === undefined) { 
                retreivedData[username] = 'NaN'
                return 
            }

            const numMedia = mediaMetadata.GraphImages.length // number of medias retreived
            let numComments = 0 // total number of comments for this specific user
            // loop through the retrieved metadata of medias
            mediaMetadata.GraphImages.forEach(media => {
                numComments += media.edge_media_to_comment.count
            })
            retreivedData[username] = ((numComments / numMedia) / numFollowers).toFixed(3);
        })
        
        let sorted = []
        for (var username in retreivedData) {
            sorted.push([username, retreivedData[username]]);
        }
        sorted.sort(function(a, b) {
            return b[1] - a[1];
        });
        // change to [{}, {}, ...]
        for(let i = 0; i < sorted.length; i++) {
            const newEntryFormat = {name: sorted[i][0], LCR: sorted[i][1]}
            sorted[i] = newEntryFormat
        }

        console.log(sorted)
        res.send(sorted) 
    });
})

app.get('/api/followers_to_views', (req, res) => {
    console.log('performing followers_to_views!')
    
    fs.readdir(`./${req.query.username}/`, (err, files) => {
        // key = userName, value = Views Follower Ratio
        let retreivedData = {} 

        // loop through all the users that this person follows
        files.forEach(mediaMetadataJSON => {
            let mediaMetadata = require(`./${req.query.username}/${mediaMetadataJSON}`) // parse the media metadata json file 

            const numFollowers = mediaMetadata.GraphProfileInfo.info.followers_count // number of followers
            const username = mediaMetadata.GraphProfileInfo.username

            if (mediaMetadata.GraphImages === undefined) { 
                retreivedData[username] = 'NaN'
                return 
            }

            let numViews = 0 // total number of views for this specific user
            let numVideos = 0
            // loop through the retrieved metadata of medias
            mediaMetadata.GraphImages.forEach(media => {
                if (media.is_video) {
                    numViews += media.video_view_count
                    numVideos++
                }
            })
            retreivedData[username] = ((numViews / numVideos) / numFollowers).toFixed(2);
        })
        
        let sorted = []
        for (var username in retreivedData) {
            sorted.push([username, retreivedData[username]]);
        }
        sorted.sort(function(a, b) {
            return b[1] - a[1];
        });
        // change to [{}, {}, ...]
        for(let i = 0; i < sorted.length; i++) {
            const newEntryFormat = {name: sorted[i][0], LVR: sorted[i][1]}
            sorted[i] = newEntryFormat
        }

        console.log(sorted)
        res.send(sorted) 
    });
})

app.get('/api/average_likes', (req, res) => {
    console.log('performing average_likes!')
    
    fs.readdir(`./${req.query.username}/`, (err, files) => {
        // key = userName, value = average likes of their posts
        let retreivedData = {} 

        // loop through all the users that this person follows
        files.forEach(mediaMetadataJSON => {
            let mediaMetadata = require(`./${req.query.username}/${mediaMetadataJSON}`) // parse the media metadata json file 

            const username = mediaMetadata.GraphProfileInfo.username
            if (mediaMetadata.GraphImages === undefined) { 
                retreivedData[username] = 'NaN'
                return 
            }

            const numMedia = mediaMetadata.GraphImages.length // number of medias retreived
            let numLikes = 0 // total number of likes for this specific user
            // loop through the retrieved metadata of medias
            mediaMetadata.GraphImages.forEach(media => {
                numLikes += media.edge_media_preview_like.count
            })
            retreivedData[username] = (numLikes / numMedia).toFixed(2);
        })
        
        let sorted = []
        for (var username in retreivedData) {
            sorted.push([username, retreivedData[username]]);
        }
        sorted.sort(function(a, b) {
            return b[1] - a[1];
        });
        // change to [{}, {}, ...]
        for(let i = 0; i < sorted.length; i++) {
            const newEntryFormat = {name: sorted[i][0], likes: sorted[i][1]}
            sorted[i] = newEntryFormat
        }

        console.log(sorted)
        res.send(sorted) 
    });
})

app.get('/api/average_comments', (req, res) => {
    console.log('performing average_comments!')

    fs.readdir(`./${req.query.username}/`, (err, files) => {
        // key = userName, value = average comments of their posts
        let retreivedData = {} 

        // loop through all the users that this person follows
        files.forEach(mediaMetadataJSON => {
            let mediaMetadata = require(`./${req.query.username}/${mediaMetadataJSON}`) // parse the media metadata json file 

            const username = mediaMetadata.GraphProfileInfo.username
            if (mediaMetadata.GraphImages === undefined) { 
                retreivedData[username] = 'NaN'
                return 
            }

            const numMedia = mediaMetadata.GraphImages.length // number of medias retreived

            let numComments = 0 // total number of comments for this specific user
            // loop through the retrieved metadata of medias
            mediaMetadata.GraphImages.forEach(media => {
                numComments += media.edge_media_to_comment.count
            })
            retreivedData[username] = (numComments / numMedia).toFixed(2);
        })
        
        let sorted = []
        // change {} to [[], [], ...]
        for (var username in retreivedData) {
            sorted.push([username, retreivedData[username]]);
        }
        // sort
        sorted.sort(function(a, b) {
            return b[1] - a[1];
        });
        // [[], [], ...] change to [{}, {}, ...]
        for(let i = 0; i < sorted.length; i++) {
            const newEntryFormat = {name: sorted[i][0], comments: sorted[i][1]}
            sorted[i] = newEntryFormat
        }

        console.log(sorted)
        res.send(sorted) 
    });
})

app.get('/api/average_views', (req, res) => {
    console.log('performing average_views!')
    
    fs.readdir(`./${req.query.username}/`, (err, files) => {
        // key = userName, value = average views of their posts
        let retreivedData = {}

        // loop through all the users that this person follows
        files.forEach(mediaMetadataJSON => {
            let mediaMetadata = require(`./${req.query.username}/${mediaMetadataJSON}`) // parse the media metadata json file 

            const username = mediaMetadata.GraphProfileInfo.username
            if (mediaMetadata.GraphImages === undefined) { 
                retreivedData[username] = 'NaN'
                return 
            }

            let numViews = 0 // total number of views for this specific user
            let numVideos = 0 // total number of posts that are videos
            // loop through the retrieved metadata of medias
            mediaMetadata.GraphImages.forEach(media => {
                if (media.is_video) {
                    numViews += media.video_view_count
                    numVideos++
                }
            })
            retreivedData[username] = (numViews / numVideos).toFixed(2);
        })
        
        let sorted = []
        // change {} to [[], [], ...]
        for (var username in retreivedData) {
            sorted.push([username, retreivedData[username]]);
        }
        // sort
        sorted.sort(function(a, b) {
            return b[1] - a[1];
        });
        // [[], [], ...] change to [{}, {}, ...]
        for(let i = 0; i < sorted.length; i++) {
            const newEntryFormat = {name: sorted[i][0], views: sorted[i][1]}
            sorted[i] = newEntryFormat
        }

        console.log(sorted)
        res.send(sorted) 
    });
})

app.get('/api/start_instalytics', (req, res) => {
    console.log('performing start_instalytics!')

    fs.readdir(`./${req.query.username}/`, (err, files) => {
        // key = userName, value = average views of their posts
        let retreivedData = []

        // loop through all the users that this person follows
        files.forEach(mediaMetadataJSON => {
            let mediaMetadata = require(`./${req.query.username}/${mediaMetadataJSON}`) // parse the media metadata json file 

            const username = mediaMetadata.GraphProfileInfo.username
            if (mediaMetadata.GraphImages === undefined) { 
                retreivedData.push({
                    username: username,
                    averageLikes: 'NaN', 
                    averageComments: 'NaN', 
                    averageViews: 'NaN',
                    LFR: 'NaN',
                    LCR: 'NaN',
                    LVR: 'NaN'
                })
                return 
            }

            const numFollowers = mediaMetadata.GraphProfileInfo.info.followers_count // number of followers
            const numMedia = mediaMetadata.GraphImages.length // number of medias retreived
            let numLikes = 0
            let numComments = 0
            let numViews = 0 // total number of views for this specific user
            let numVideos = 0 // total number of posts that are videos
            // loop through the retrieved metadata of medias
            mediaMetadata.GraphImages.forEach(media => {
                if (media.is_video) {
                    numComments += media.edge_media_to_comment.count
                    numViews += media.video_view_count
                    numVideos++
                }
            })


            retreivedData.push({
                username: username,
                averageLikes: (numLikes / numMedia).toFixed(2), 
                averageComments: (numComments / numMedia).toFixed(2), 
                averageViews: (numViews / numVideos).toFixed(2),
                LFR: ((numLikes / numMedia) / numFollowers).toFixed(2),
                LCR: ((numComments / numMedia) / numFollowers).toFixed(3),
                LVR: ((numViews / numVideos) / numFollowers).toFixed(2)
            })
        })

        res.send(sorted) 
    });
})

app.listen(port, () => console.log(`Listening on port ${port}!`))