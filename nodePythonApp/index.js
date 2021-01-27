require('dotenv').config()
const express = require('express')
const {exec, execSync} = require('child_process');
const app = express()
const cors = require('cors')
const fs = require('fs');
const mkdirp = require('mkdirp')
const rimraf = require("rimraf");
const nodemailer = require('nodemailer');
const port = 5000

app.use(cors({
	credentials: true,
	origin: '*',
	"Access-Control-Allow-Origin": "*",
}));

// EXECUTE SCRIPTS TO RETREIVE FOLLOWER DATA & ACCOUNT INFO
app.get('/api/store-metadata', (req, res) => {
	console.log('performing store-metadata!')

	// // the folder already exists so delete it
	// if (fs.existsSync(`./data/${req.query.username}`)) rimraf(`./data/${req.query.username}`, {}, (err) => {
	// 	// check for errors
	// 	if (err) {
	// 		console.log('store-metadata rimraf error: ', err)
	// 		res.status(400).send({message: 'store-metadata rimraf error'})
	// 	} else {
  //     console.log(`deleted the directory: ./data/${req.query.username} successfully`)
  //   }

	// create the data directory
	fs.mkdir(`./data/${req.query.username}`, { recursive: true }, (err) => {
		// check for errors
		if (err) {
			console.log('store-metadata mkdir error: ', err)
			res.status(400).send({message: 'store-metadata mkdir error'})
		} else {
			console.log(`created the directory: ./data/${req.query.username} successfully`)
		}

		// STORE THE DATE THIS DATA IS BEING DOWNLOADED AT
		let fetchedDate = new Date();
		fetchedDate = fetchedDate.toLocaleDateString();
		fs.writeFile(`./data/${req.query.username}/date.txt`, fetchedDate.toString(), (err) => {
			// check for errors
			if (err) {
				console.log('store-metadata date.txt writeFile error: ', err)
				res.status(400).send({message: 'store-metadata date.txt writeFile error'})
			} else {
				console.log(`created the file: ./data/${req.query.username}/date.txt successfully`)
			}
		});

		// STORE THE REQUESTER FOLLOWING'S METADATA
		setTimeout(() => {
		// 	fs.readFile(`./data/${req.query.username}/followings.txt`, (err, data) => {
		// 		// check for errors
		// 		if (err) {
		// 			console.log('store-metadata followings.txt readFile error: ', err)
		// 			res.status(400).send({message: 'store-metadata followings.txt readFile error'})
		// 		} else {
		// 			console.log(`read the file ./data/${req.query.username}/followings.txt successfully`)
		// 		} // if (err)

				// list of followers in an array
				// followingsArray = data.toString().split("\n")
				followingsArray = req.query.followers
				console.log(followingsArray)
				var i = 0
				
				// run command every 1.5 min until we fetched everyone
				let intervalId = setInterval(() => {
					// if we get to the end OR the last follower is undefined, we are done.
					if (i >= followingsArray.len || followingsArray[i] === 'undefined') {
						clearInterval(intervalId)

						console.log("FINISHED FETCHING! SENDING NOTIFICATION EMAIL...")
						sendEmail(req.query.email, req.query.username)
					}

					console.log(`fetching data from account: ${followingsArray[i]}`)
					execSync(`instagram-scraper ${followingsArray[i]} --login-user ${process.env.IG_SCRAPER_LOGIN} --login-pass ${process.env.IG_SCRAPER_PASSWORD} --destination ./data/${req.query.username}/ --media-types none --media-metadata --maximum ${req.query.numPosts} --profile-metadata`, (error, stdout, stderr) => {
						if (error) {
							console.error(`exec error 2: ${error}`);
							fs.writeFile(`./data/${req.query.username}/error2.txt`, error, (err) => {
								// check for errors
								if (err) {
									console.log('store-metadata error2.txt writeFile error: ', err)
									res.status(400).send({message: 'store-metadata error2.txt writeFile error'})
								} 
							});
							res.status(400).send({message: `exec error 2: ${error}`})
						} else {
							console.log(`fetched data from account: ${followingsArray[i]} successfully`)
						} // if (error)
					}) // execSync()
					i += 1
				}, 90000) // let intervalId = ...

		// }) // fs.readFile

		}, 3000);

	})

	res.status(200).send({message: "called with no errors"}) 
})

app.get('/api/data-date', (req, res) => {
  console.log('performing data-date')

  fs.readFile(`./data/${req.query.username}/date.txt`, 'utf8', function(err, data) {
    if (err) {
      // throw err;
      res.status(400).send({err: err});
    }

    else {
      console.log(data);
      res.status(200).send({date: data});
    }
  });
})

function sendEmail(respondentEmail, respondentUsername) {
  console.log('sending email to: ', respondentEmail, 'with account name:', respondentUsername)
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: {
            user: process.env.MAILER_LOGIN,
            pass: process.env.MAILER_PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.MAILER_LOGIN,
        to: respondentEmail,
        subject: 'Instlytics: data fetching completed!',
        html: `<html xmlns="http://www.w3.org/1999/xhtml">
 
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <title>A Simple Responsive HTML Email</title>
          <style type="text/css">
          body {margin: 0; padding: 0; min-width: 100%!important;}
          img {height: auto;}
          .content {width: 100%; max-width: 600px;}
          .header {padding: 40px 30px 20px 30px;}
          .innerpadding {padding: 30px 30px 30px 30px;}
          .borderbottom {border-bottom: 1px solid #f2eeed;}
          .subhead {font-size: 15px; color: #ffffff; font-family: sans-serif; letter-spacing: 10px;}
          .h1, .h2, .bodycopy {color: #153643; font-family: sans-serif;}
          .h1 {font-size: 33px; line-height: 38px; font-weight: bold;}
          .h2 {padding: 0 0 15px 0; font-size: 24px; line-height: 28px; font-weight: bold;}
          .bodycopy {font-size: 16px; line-height: 22px;}
          .button {text-align: center; font-size: 18px; font-family: sans-serif; font-weight: bold; padding: 0 30px 0 30px;}
          .button a {color: #ffffff; text-decoration: none;}
          .footer {padding: 20px 30px 15px 30px;}
          .footercopy {font-family: sans-serif; font-size: 14px; color: #ffffff;}
          .footercopy a {color: #ffffff; text-decoration: underline;}
        
          @media only screen and (max-width: 550px), screen and (max-device-width: 550px) {
          body[yahoo] .hide {display: none!important;}
          body[yahoo] .buttonwrapper {background-color: transparent!important;}
          body[yahoo] .button {padding: 0px!important;}
          body[yahoo] .button a {background-color: #e05443; padding: 15px 15px 13px!important;}
          body[yahoo] .unsubscribe {display: block; margin-top: 20px; padding: 10px 50px; background: #2f3942; border-radius: 5px; text-decoration: none!important; font-weight: bold;}
          }
        
          /*@media only screen and (min-device-width: 601px) {
            .content {width: 600px !important;}
            .col425 {width: 425px!important;}
            .col380 {width: 380px!important;}
            }*/
        
          </style>
        </head>
        
        <body yahoo bgcolor="#ffdfdb">
        <table width="100%" bgcolor="#ffdfdb" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <!--[if (gte mso 9)|(IE)]>
              <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
            <![endif]-->     
            <table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="#e6a9a2" class="header">
                  <!--[if (gte mso 9)|(IE)]>
                    <table width="425" align="left" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                  <![endif]-->
                  <table class="col425" align="left" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 425px;">  
                    <tr>
                      <td height="70">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td class="subhead" style="padding: 0 0 0 3px;">
                              INSTALYTICS
                            </td>
                          </tr>
                          <tr>
                            <td class="h1" style="padding: 5px 0 0 0;">
                              We Got The Data!
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                        </td>
                      </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
              <tr>
                <td class="innerpadding borderbottom">
                  <!--[if (gte mso 9)|(IE)]>
                    <table width="380" align="left" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                  <![endif]-->
                  <table class="col380" align="left" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 380px;">  
                    <tr>
                      <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td class="bodycopy">
                              We have everything that you need to help you start snooping around your followings' data for the account: ${respondentUsername}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 20px 0 0 0;">
                              <table class="buttonwrapper" bgcolor="#e05443" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td class="button" height="45">
                                    <a href="${process.env.FRONTEND_ADDRESS}/?username=${respondentUsername}">Go see the data!</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <!--[if (gte mso 9)|(IE)]>
                        </td>
                      </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
                  </td>
                </tr>
            </table>
            <![endif]-->
            </td>
          </tr>
        </table>
        </body>
        </html>`
    }

    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) console.log(error)
      else console.log(response)
    })
}


app.get('/api/update-metadata', (req,res) => {
  console.log('performing update-metadata!, doesnt do anything rn tho xd')
  // console.log(req.query.username)

  // let fetchedDate = new Date();
  // fetchedDate = fetchedDate.toLocaleDateString();
  // fs.writeFile(`./data/${req.query.username}/date.txt`, fetchedDate.toString(), (err) => {
  //   if (err) res.status(400).send({err: err});
  //   console.log('The file has been saved!');
  // });

  // // spawn new child process to call the python script
  // exec(`instagram-scraper --followings-input --login-user ${req.query.username} --login-pass ${req.query.refreshPassword} --destination ./data/${req.query.username}/ --media-types none --media-metadata --maximum 20 --profile-metadata --latest`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  //   console.error(`stderr: ${stderr}`);
  // })

  // # '--followings-output', 'followings.txt',
  // # '--latest-stamps',
})

app.get('/api/check-username', (req, res) => {
    console.log('performing check-username')

    const dirCheck = './data/' + req.query.username

    if (fs.existsSync(dirCheck)) {
        res.status(200).send({message: 'The user exists in our db'})
    } else {
        res.status(400).send({message: 'The user DNE in our db'})
    }
})

app.get('/api/start_instalytics', (req, res) => {
    console.log('performing start_instalytics!')
    console.log(req.query.username)
    fs.readdir(`./data/${req.query.username}/`, (err, files) => {
      if (fs.existsSync(`./data/${req.query.username}/error.txt`) || files.length === 2 || files.length === 0) {
        rimraf.sync(`./data/${req.query.username}/`)
        res.status(400).send() 
        return
      }

        // key = userName, value = average views of their posts
        let retreivedData = []
        // loop through all the users that this person follows
        files.forEach(mediaMetadataJSON => {
          if (mediaMetadataJSON === 'date.txt') return 

            let mediaMetadata = require(`./data/${req.query.username}/${mediaMetadataJSON}`) // parse the media metadata json file 

            const username = mediaMetadata.GraphProfileInfo.username
            // the dude has 0 posts
            if (mediaMetadata.GraphImages === undefined) { 
                retreivedData.push({
                    username: username,
                    averageLikes: 'NaN', 
                    averageComments: 'NaN', 
                    averageViews: 'NaN',
                    LFR: 'NaN',
                    CFR: 'NaN',
                    VFR: 'NaN',
                    top5: 'NaN'
                })
                return 
            }


            // TOP 5 POSTS
            let metadataList = mediaMetadata.GraphImages
            let top5Posts = []
            if (metadataList !== undefined) {
              metadataList.sort((a,b) => (a.edge_media_preview_like.count <= b.edge_media_preview_like.count) ? 1 : -1)

              for (let i = 0; i < metadataList.length; i++) {
                if (i === 5) {
                    break;
                }

                const currentMetadata = metadataList[i]
                let caption = currentMetadata.edge_media_to_caption.edges[0] ? currentMetadata.edge_media_to_caption.edges[0].node.text : ''
                top5Posts.push({
                    images: currentMetadata.is_video ? null : currentMetadata.urls,
                    likes: currentMetadata.edge_media_preview_like.count,
                    comments: currentMetadata.edge_media_to_comment.count,
                    caption: caption,
                    date: currentMetadata.taken_at_timestamp,
                })
              }
            }

            // Rest of 6 sorting values
            const numFollowers = mediaMetadata.GraphProfileInfo.info.followers_count // number of followers
            const numMedia = mediaMetadata.GraphImages.length // number of medias retreived
            let numLikes = 0
            let numComments = 0
            let numViews = 0 // total number of views for this specific user
            let numVideos = 0 // total number of posts that are videos
            // loop through the retrieved metadata of medias
            mediaMetadata.GraphImages.forEach(media => {
                numLikes += media.edge_media_preview_like.count
                numComments += media.edge_media_to_comment.count
                if (media.is_video) {
                    numViews += media.video_view_count
                    numVideos++
                }
            })


            retreivedData.push({
                username: username,
                averageLikes: (numLikes / numMedia).toFixed(2), 
                averageComments: (numComments / numMedia).toFixed(2), 
                averageViews: (numViews / numVideos).toFixed(2),
                LFR: ((numLikes / numMedia) * 100 / numFollowers).toFixed(2),
                CFR: ((numComments / numMedia) * 100 / numFollowers).toFixed(3),
                VFR: ((numViews / numVideos) * 100 / numFollowers).toFixed(2),
                top5: top5Posts
            })
        })

        res.send(retreivedData) 
    });
})

app.get('/api/top-5-posts', (req, res) => {
  console.log('performing top_5_posts!')
  let mediaMetadata = require(`./data/${req.query.logged_in_username}/${req.query.target_username}`)
  let dataToSend = []
  if (mediaMetadata) {
    let metadataList = mediaMetadata.GraphImages

    if (metadataList) {
      metadataList.sort((a,b) => (a.edge_media_preview_like.count <= b.edge_media_preview_like.count) ? 1 : -1)
    
      
      for (let i = 0; i < metadataList.length; i++) {
          if (i === 5) {
              return res.send(dataToSend)
          }
          const currentMetadata = metadataList[i]
          if (currentMetadata !== undefined) {
            let caption = currentMetadata.edge_media_to_caption.edges[0] ? currentMetadata.edge_media_to_caption.edges[0].node.text : ''
            dataToSend.push({
                images: currentMetadata.urls,
                likes: currentMetadata.edge_media_preview_like.count,
                comments: currentMetadata.edge_media_to_comment.count,
                caption: caption,
                date: currentMetadata.taken_at_timestamp,
            })
          }
      }
    }
  }
  return res.send(dataToSend)
})

app.listen(port, () => console.log(`Listening on port ${port}!`))