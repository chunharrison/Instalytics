import React, { useState, useEffect, useRef } from 'react' 
import { ResponsiveContainer, BarChart, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

import axios from 'axios'

import './LandingPage.css';

const LandingPage = props => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState('cosign.pro')
    const [password, setPassword] = useState('')
    const [currentUser, setCurrentUser] = useState('')
    const canvasElement = useRef(null);
    const [context, setContext] = useState(null)
    const [searched, setSearched] = useState(true);
    const [data, setData] = useState([]);
    let time = 0;

    useEffect(() => {
        setContext(canvasElement.current.getContext('2d'));
        const users = localStorage.getItem('Instalytics_Users');
    }, [])

    useEffect(() => {
        if (!context) return;
        startAnimation();
    }, [context])

    function compare( a, b ) {
        if ( Number(a.averageLikes) < Number(b.averageLikes) || a.averageLikes === 'NaN' ){
          return 1;
        }
        if ( Number(a.averageLikes) > Number(b.averageLikes) || b.averageLikes === 'Nan'){
          return -1;
        }
        return 0;
    }
      
    function color (x, y, r, g, b) {
        if (!canvasElement || !context) return;
        context.fillStyle = `rgb(${r}, ${g}, ${b})`
        context.fillRect(x, y, 10, 10);
    }

    function R (x, y, time) {
        return (Math.floor(200 + 35 * Math.cos((x * x - y * y) / 300 + time)));
    }

    function G (x, y, time) {
        return (Math.floor(130 + 40 * Math.cos((x * x - y * y) * Math.cos(time / 3)) / 300));
    }

    function B (x, y, time) {
        return (Math.floor(136 + 17 * Math.sin(5 * Math.sin(time / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100)));
    }

    function startAnimation() {
        for (let x = 0; x <= 31; x++) {
            for (let y = 0; y <= 31; y++) {
                color(x, y, R(x, y, time), G(x, y, time), B(x, y, time));
            }
        }
        time = time + 0.02;
        window.requestAnimationFrame(startAnimation);
    }

    function handleAccountChange(e) {
        setUsername(e.target.value)
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value)
    }

    function getData() {
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
        axios.get('http://localhost:5000/api/start_instalytics', getDataOptions)
            .then(res => {
                console.log(res.data);
                setData(res.data)
            })
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

        console.log('calling store-metadata')
        axios.get('http://localhost:5000/api/store-metadata', options)
            .then(res => {
                console.log(res)
                setSearched(true);
                console.log(res);
                getData();
                // add username to the username list in localStorage 
                const user = localStorage.getItem('Instalytics_User');
                if (user === null || user === '') {
                    localStorage.setItem('Instalytics_User', username);
                } else {
                    // check to see if the backend has the data corresponding to the username in the localstorage
                }
                
                
        }).catch(res => {
            if (res.response) {
                console.log(res.response.data.message)
            } else {
                console.log(res)
            }
        })
    }

    function refresh(e) {
        e.preventDefault()

        console.log(localStorage.getItem('Instalytics_User'))
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
    function followers_to_likes() {

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
                console.log(res);
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

    function average_likes() {
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

    function getLocalStorage(e) {
        e.preventDefault()

        const users = localStorage.getItem('Instalytics_Users')
        console.log(users)
    }

    let max = Math.max.apply(Math, data.map(function(entry) { if (entry.averageLikes !== 'NaN') {return Number(entry.averageLikes);} else {return 0} }))

    return (
        <div className='search-page-container'>
            <div className='nav'>
                <p className='nav-logo'>instalytics</p>
            </div>
            <div className='search-page-search-container' style={{height: `${searched ? '60px' : ''}`}}>
                <canvas ref={canvasElement} id="canvas" width='32px' height={`${searched ? '5px' : '32px'}`} style={{height: `${searched ? '60px' : ''}`, opacity: `${searched ? '0.7' : ''}`}}/>
                {searched ? 
                <label className='search-page-username-label'>{username}</label>
                : 
                <form onSubmit={e => handleSubmit(e)} className='search-page-form'>
                    <input className='search-page-input' type="text" value={username} placeholder='Username' onChange={e => handleAccountChange(e)}/>
                    <input className='search-page-input' type="password" value={password} placeholder='Password' onChange={e => handlePasswordChange(e)}/>
                    <button className='search-page-submit' type="submit">Analyze</button>
                </form>
                }
            </div>
            <div className='search-page-data-container' style={{display: `${searched ? '' : 'none'}`}}>
                <ResponsiveContainer className='search-page-data' width={900} height="55%">
                    <BarChart data={data.sort(compare)} layout='vertical' margin={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                        <YAxis type='category' dataKey="username" width={150}/>
                        <XAxis type='number' domain={[0, max]} allowDecimals={false}/>
                        <Bar dataKey="averageLikes" fill="#8884d8"/>
                    </BarChart>
                </ResponsiveContainer>
                <button onClick={e => getData()}>getData</button>
            </div>
        </div>
    )
}

export default LandingPage