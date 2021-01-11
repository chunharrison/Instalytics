import React from 'react'

const TestPage = props => {

    function getFBLoginStatus() {
        window.FB.getLoginStatus(function(response) {
            console.log(response);
        });
    }

    return (
        <div>
            <button onClick={() => getFBLoginStatus()}>
                getStatus
            </button>
            <div class="fb-login-button"
                data-width="" 
                data-size="large"
                data-button-type="continue_with" 
                data-layout="default" 
                data-auto-logout-link="false" 
                data-use-continue-as="false">
            </div>
        </div>
    )
}

export default TestPage