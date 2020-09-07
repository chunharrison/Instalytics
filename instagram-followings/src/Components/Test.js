import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Test = () => {

      const [accessToken, setAccessToken] = useState('') 
      const [userId, setUserId] = useState('') 
      const [pageId, setPageId] = useState('')
      const [businessAccountId, setBusinessAccountId] = useState('')

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
          }, {scope: `
                        pages_messaging,
                        pages_show_list,
                        pages_read_engagement,
                        instagram_basic,
                        instagram_manage_insights,
                        read_insights,
                        business_management,
                        ads_management
                      `});
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

    function func1(e) {
      e.preventDefault()
      
      window.FB.api('/me/accounts', 'GET', function(response) {
          setPageId(response.data.id)
        }
      );
    }

    function func2(e) {
      e.preventDefault()

      window.FB.api(`/${pageId}`, 'GET', {
          "fields": "instagram_business_account"
        }, function(response) {
          businessAccountId(response.instagram_business_account.id)
        }
      );
    }

    function func3(e) {
      e.preventDefault()
      
    }

    return (
        <div>
            <button onClick={e => handleFBLogin(e)}>login</button>
            <button onClick={e => window.FB.logout()}>logout</button>
            <button onClick={e => handleLoginStatus(e)}>handleLoginStatus</button>
            <button onClick={e => func1(e)}>GET /me/accounts</button>
            <button onClick={e => func2(e)}>testFunction2</button>
        </div>
    )
}

export default Test