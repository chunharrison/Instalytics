import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Test = () => {

      const [accessToken, setAccessToken] = useState('') 
      const [userId, setUserId] = useState('') 

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
          }, {scope: 'pages_messaging,pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights,read_insights'});
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
                console.log(response)
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                console.log(uid, accessToken) 
                setAccessToken(accessToken)
                setUserId(uid)
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
      
      window.FB.api(
        '/me/accounts',
        'GET',
        function(response) {
            console.log(response)
        }
      );
    }

    function getThePagesInstagramBusinessAccount(e) {
      e.preventDefault()

      window.FB.api('/me', function(response) {
        console.log(response);
      });
    }

    return (
        <div>
            <button onClick={e => handleFBLogin(e)}>login</button>
            <button onClick={e => handleLoginStatus(e)}>handleLoginStatus</button>
            <button onClick={e => window.FB.logout()}>logout</button>
            <button onClick={e => getFollows(e)}>testFunction</button>
            <button onClick={e => getThePagesInstagramBusinessAccount(e)}>testFunction2</button>
        </div>
    )
}

export default Test