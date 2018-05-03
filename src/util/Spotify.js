let accessToken;
let expirationTime;

const clientID = 'c8b79be3c9df45358d525296da8d39c5';
const redirectURI = 'http://korora-jammming.surge.sh';
//const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    else {
      const url = window.location.href;
      const token = url.match(/access_token=([^&]*)/);
      const time = url.match(/expires_in=([^&]*)/);

      if (token && time) {
        accessToken = token[1];
        expirationTime = time[1];
        window.setTimeout(() => accessToken = '', expirationTime * 1000);
        window.history.pushState('Access Token', null, '/');
      }
      else {
        window.location =
        `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token&scope=playlist-modify-public`;
      }
    }
  },

  search(term) {
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {headers: {Authorization: `Bearer ${accessToken}`}}
    ).then(
      response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      },
      networkError => console.log(networkError.message)
    ).then(
      jsonResponse => {
        if (jsonResponse.tracks) {
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists,
            album: track.album,
            uri: track.uri
          }));
        }
        else {
          return [];
        }
      }
    );
  },

  savePlaylist(playlistName, trackURIs) {
    if(playlistName && trackURIs) {
      this.getAccessToken();
      let userID;
      let playlistID;

      return fetch(
        'https://api.spotify.com/v1/me',
        {
          headers: {Authorization: `Bearer ${accessToken}`}
        }
      ).then(
        response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        },
        networkError => console.log(networkError.message)
      ).then(
        jsonResponse => {
          return userID = jsonResponse.id
        }
      ).then(
        () => {
          return fetch(
            `https://api.spotify.com/v1/users/${userID}/playlists`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`
                // Content-type: 'application/json'
              },
              body: JSON.stringify({name: playlistName})
            }
          ).then(
          response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Request failed!');
          },
          networkError => console.log(networkError.message)
          ).then(
            jsonResponse => {
              return playlistID = jsonResponse.id;
            }
          ).then(
            () => {
              return fetch(
                `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // Content-type: 'application/json'
                  },
                  body: JSON.stringify({uris: trackURIs})
                }
              ).then(
                response => {
                  if (response.ok) {
                    return response.json();
                  }
                  throw new Error('Request failed!');
                },
                networkError => console.log(networkError.message)
              );
            }
          );
        }
      );
    }
    else {
      return;
    }
  }


};

export default Spotify;
