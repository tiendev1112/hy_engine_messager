import requestHeaders from './RequestHeaders'


const get =(url) =>{
    return fetch(url, {
        method: 'GET',
        headers: requestHeaders.headers
    }).then((response) => {
        return response.json()
    })
}

const getCallBack = (url, callBack)=> {
    fetch(url, {
        method: 'GET',
        headers: requestHeaders.headers
    }).then((response) => response.json())
        .then((responseJson) => {
            callBack(null, responseJson)
        })
        .catch((error) => {
            callBack(error, null)
        })
}

const post = (url, params)=>{
    return fetch(url, {
        method: 'POST',
        headers: requestHeaders.headers,
        body: JSON.stringify(params)
    }).then((response) => response.json())
}

const postCallBack = (url, params, callback) => {
    fetch(url, {
        method: 'POST',
        headers: requestHeaders.headers,
        body: JSON.stringify(params)
    }).then((response) => response.json())
        .then((responseJson) => {
            callback(null, responseJson)
        })
        .catch((error) => {
            callback(error, null)
        });
}

const put = (url, params) =>{
    return fetch(url, {
        method: 'PUT',
        headers: requestHeaders.headers,
        body: JSON.stringify(params)
    }).then((response) => response.json())
}

const putCallBack = (url, params, callback) => {
    return fetch(url, {
        method: 'PUT',
        headers: requestHeaders.headers,
        body: JSON.stringify(params)
    }).then((response) => response.json())
        .then((responseJson) => {
            callback(null, responseJson)
        })
        .catch((error) => {
            callback(error, null)
        });
}

const del = (url, callback)=>{
    return fetch(url, {
        method: 'DELETE',
        headers: requestHeaders.headers,
    }).then((response) => response.json())
}




export  {
    get,
    post,
    put,
    del,
    getCallBack,
    postCallBack,
    putCallBack
}