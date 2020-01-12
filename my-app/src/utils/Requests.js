const fetchGet = async function(url){
    console.log('fetching: ', url)
    let response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }})
    let json = await response.json();
    return json
}

// favorites ------------

export const toggleTeamFavorite = function(username, teamName){
    let url = process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_FAVORITES  + "/toggleTeam/" + username + "/" + teamName + "/"
    return fetchGet(url)
}

export const toggleLeagueFavorite = function(username, leagueId){
    let url = process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_FAVORITES  + "/toggleLeague/" + username + "/" + String(leagueId) + "/"
    return fetchGet(url)
}

export const getFavorite = function(username){
     let url = process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_FAVORITES  + "/getFavorites/" + username + "/"
     return fetchGet(url)
 }

export const getFavoriteTeamState = function(username, teamName){
     return getFavorite(username).then(ret => {
        if(ret['teams'].includes(teamName)){
            return true
        }else{
            return false
        }
     })
}

export const getFavoriteLeagueState = function(username, leagueId){
     return getFavorite(username).then(ret => {
        if(ret['leagues'].includes(String(leagueId))){
            return true
        }else{
            return false
        }
     })
}

// favorites ------------