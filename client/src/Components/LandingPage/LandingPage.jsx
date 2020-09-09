import React, {useState, useEffect} from 'react'

import axios from 'axios'

const LandingPage = props => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [currentUser, setCurrentUser] = useState('')

    useEffect(() => {
        const users = localStorage.getItem('Instalytics_Users');
        if (users !== null && users !== []) setLoggedIn(true)
    }, [])

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

        axios.get('http://localhost:5000/api/store-metadata', options)
            .then(res => {
                if (res.data === 'success') {
                    setLoggedIn(true)

                    // add username to the username list in localStorage 
                    const users = localStorage.getItem('Instalytics_Users');
                    if (users === null) {
                        localStorage.setItem('Instalytics_Users', [username]);
                    } else {
                        users.push(username)
                        localStorage.setItem('Instalytics_Users', users)
                    }
                }
                
            })
    }

    function refresh(e) {
        e.preventDefault()
    }

    // add user
    function addUser(e) {
        e.preventDefault()
    }

    // remove user
    function removeUser(e) {
        e.preventDefault()
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
                console.log(res)
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
                console.log(res)
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
                console.log(res)
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
                console.log(res)
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
                console.log(res)
            })
    }

    function getLocalStorage(e) {
        e.preventDefault()

        const users = localStorage.getItem('Instalytics_Users')
        console.log(users)
    }

    return (<div>
        {/* <form onSubmit={e => handleSubmit(e)}>
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
                <button onClick={e => followers_to_likes(e)}>followers to likes</button>
                <button onClick={e => followers_to_comments(e)}>followers to comments</button>
                <button onClick={e => followers_to_views(e)}>followers to views (videos)</button>
                <button onClick={e => average_likes(e)}>average likes</button>
                <button onClick={e => average_comments(e)}>average comments</button>
                <button onClick={e => average_views(e)}>average views</button>
            </div> */}
            <button onClick={e => getLocalStorage(e)}>get localStorage</button>
        {
            loggedIn
            ?   <div>
                <button onClick={e => followers_to_likes(e)}>followers to likes</button>
                <button onClick={e => followers_to_comments(e)}>followers to comments</button>
                <button onClick={e => followers_to_views(e)}>followers to views (videos)</button>
                <button onClick={e => average_likes(e)}>average likes</button>
                <button onClick={e => average_comments(e)}>average comments</button>
                <button onClick={e => average_views(e)}>average views</button>
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

        }
    </div>)
}

export default LandingPage