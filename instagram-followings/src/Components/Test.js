import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Test = () => {

      const [accessToken, setAccessToken] = useState('') 

      function handleFBLogin(e) {
          e.preventDefault()
          window.FB.login(function(response){
            if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            window.FB.api('/me', function(response) {
                console.log('Good to see you, ' + response.name + '.');
              });
             } else {
              console.log('User cancelled login or did not fully authorize.');
             }
          });
        }

    function handleLoginStatus(e) {
        e.preventDefault()
        window.FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // The user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire.
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                console.log(uid, accessToken)
                setAccessToken(accessToken)
              } else if (response.status === 'not_authorized') {
                // The user hasn't authorized your application.  They
                // must click the Login button, or you must call FB.login
                // in response to a user gesture, to launch a login dialog.
              } else {
                // The user isn't logged in to Facebook. You can launch a
                // login dialog with a user gesture, but the user may have
                // to log in to Facebook before authorizing your application.
              }
        })
    }

    function getFollows(e) {
      e.preventDefault()
      axios.get(`https://api.instagram.com/v1/users/self/follows?access_token=${accessToken}`)
    }

    return (
        <div>
            <button onClick={e => handleFBLogin(e)}>login</button>
            <button onClick={e => handleLoginStatus(e)}>handleLoginStatus</button>
            <button onClick={e => window.FB.logout()}>logout</button>
            <button onClick={e => getFollows(e)}>handleLoginStatus</button>
        </div>
    )
}

export default Test