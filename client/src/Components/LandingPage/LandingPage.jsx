import React, {useState} from 'react'

import axios from 'axios'

const LandingPage = props => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function handleAccountChange(e) {
        setUsername(e.target.value)
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        
        const options = {
            params: {
                login_user: username,
                login_pass: password
            },
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
            },
        }

        axios.get('http://localhost:5000/api/login', options)
            .then(res => {
                setLoggedIn(true)
            })
    }

    // GET DATA
    function followers_to_likes(e) {
        e.preventDefault()

        const getDataOptions = {
            params: {
                username: username
            },
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
            },
        }
        axios.get('http://localhost:5000/api/followers_to_likes', getDataOptions)
            .then(res => {

            })
    }

    function followers_to_comments(e) {
        e.preventDefault()

        const getDataOptions = {
            params: {
                username: username
            },
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
            },
        }
        axios.get('http://localhost:5000/api/followers_to_comments', getDataOptions)
            .then(res => {
                
            })
    }

    function followers_to_views(e) {
        e.preventDefault()

        const getDataOptions = {
            params: {
                username: username
            },
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
            },
        }
        axios.get('http://localhost:5000/api/followers_to_views', getDataOptions)
            .then(res => {
                
            })
    }

    function average_likes(e) {
        e.preventDefault()

        const getDataOptions = {
            params: {
                username: username
            },
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
            },
        }
        console.log('average_likes requested!')
        axios.get('http://localhost:5000/api/average_likes', getDataOptions)
            .then(res => {
                console.log(res)
            })
    }

    function average_comments(e) {
        e.preventDefault()

        const getDataOptions = {
            params: {
                username: username
            },
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
            },
        }
        axios.get('http://localhost:5000/api/average_comments', getDataOptions)
            .then(res => {
                
            })
    }
    
    function average_views(e) {
        e.preventDefault()

        const getDataOptions = {
            params: {
                username: username
            },
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': '*',
            },
        }
        axios.get('http://localhost:5000/api/average_views', getDataOptions)
            .then(res => {
                
            })
    }

    return (<div>
        <form onSubmit={e => handleSubmit(e)}>
                <label>
                    Username:
                <input type="text" value={username} onChange={e => handleAccountChange(e)}/>
                </label>
                <label>
                    Password:
                <input type="text" value={password} onChange={e => handlePasswordChange(e)}/>
                </label>
                <input type="submit" value="Submit" />
          </form>
          <div>
                <button>followers to likes</button>
                <button>followers to comments</button>
                <button>followers to views (videos)</button>
                <button onClick={e => average_likes(e)}>average likes</button>
                <button>average comments</button>
                <button>average views</button>
            </div>
        {/* {
            loggedIn
            ?
            <div>
                <button onClick={e => average_likes(e)}>followers to likes</button>
                <button>followers to comments</button>
                <button>followers to views (videos)</button>
                <button>average likes</button>
                <button>average comments</button>
                <button>average views</button>
            </div>
            :
            <form onSubmit={e => handleSubmit(e)}>
                <label>
                    Username:
                <input type="text" value={username} onChange={e => handleAccountChange(e)}/>
                </label>
                <label>
                    Password:
                <input type="text" value={password} onChange={e => handlePasswordChange(e)}/>
                </label>
                <input type="submit" value="Submit" />
          </form>

        } */}
    </div>)
}

export default LandingPage