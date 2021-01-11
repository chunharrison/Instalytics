import React from 'react'

const TestPage = props => {

    function getFBLoginStatus() {
        window.FB.getLoginStatus(function(response) {
            console.log(response);
        });
    }

    function PerformFBLogin() {
        window.FB.login(function(response) {
            console.log(response);
        });
    }

    return (
        <div>
            <button onClick={() => getFBLoginStatus()}>
                getStatus
            </button>
            <button onClick={() => PerformFBLogin()}>
                login
            </button>
        </div>
    )
}

export default TestPage