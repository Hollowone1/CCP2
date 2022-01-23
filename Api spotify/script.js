let urlLogin = `https://accounts.spotify.com/authorize?response_type=token&client_id=643138f411f44ea9b8d00d8eadcd51ff&scope=user-top-read%20user-follow-read%20user-library-read&redirect_uri=${window.location.href}`

let login = document.getElementById('login');
login.href= urlLogin;

let hashParameters = new URLSearchParams(window.location.hash.replace("#","?"));
let token = hashParameters.get ('access_token');

if (token != null) {
    const date = new Date();
    date.setTime(date.getTime() + hashParameters.get('expires_in'));
    let expires = 'expires='+ date.toUTCString();
    document.cookie = 'accessToken' + "=" + token + ";" + expires + ";path=/";
} 

else {
    let name = 'accessToken' + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            let cookie = c.substring(name.length, c.length);
            if (cookie == "null") {
                token =  null;
                break
            }
        token = cookie;
        }
    }
}

let headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token ,
}

const limiter = 10;
let offset = 0;

// artistes top track
fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limiter}`, {headers})
.then(response => response.json())
.then(response => {
        let getGenre = document.getElementById('select_genre');
        let getPlaylist = document.getElementById('select_playlist');
        let albIndex ;
        for (let album of response.items){   
            let element = document.createElement('option');
            element.innerText = album.name
            getGenre.appendChild(element);  
        }
        getGenre.addEventListener("change", (event) => {
            const result = event.target.selectedIndex ;
            while (getPlaylist.childElementCount > 1){
                getPlaylist.removeChild(getPlaylist.lastChild);
            }
            for (let genres of response.items[result - 1].genres){
                let element2 = document.createElement('option');
                element2.innerText = genres
                getPlaylist.appendChild(element2);
                
            }
            albIndex = result ;
            getPlaylist.addEventListener("change", (event)=> {
                const songIndex = event.target.selectedIndex;
        
                let img = response.items[albIndex - 1].images[0].url;
                let artist = response.items[albIndex - 1].name;
        
        
                const html = 
          `
                    <div class="container">
                     <div class="row col-sm-3 d-fluid justify-content-center px-620">
                          <img src="${img}" alt="">        
                     </div>
                     <div class="row col-sm-6 px-0">
                          <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
                     </div>
                     `;
        
                      let element = document.createElement('div');
                      element.innerHTML = html;
                      document.body.appendChild(element);
        })
    })
});

// voir les artistes suivis
fetch(`https://api.spotify.com/v1/me/following?type=artist&limit=${limiter}`, {headers})
.then(response => response.json())
.then(response => {
    console.log(response);
    let getArtist = document.getElementById('select_followed');
    let getGenre = document.getElementById('select_followed-2');
    let albIndex ;
    for (let artists of response.artists.items){   
        let element = document.createElement('option');
        element.innerText = artists.name
        getArtist.appendChild(element);  
    }
    getArtist.addEventListener("change", (event) => {
        const result = event.target.selectedIndex ;
        while (getGenre.childElementCount > 1){
            getGenre.removeChild(getGenre.lastChild);
        }
        for (let genres of response.artists.items[result - 1].genres){
            let element2 = document.createElement('option');
            element2.innerText = genres
            getGenre.appendChild(element2);
            
        }
        albIndex = result ;
        getGenre.addEventListener("change", (event)=> {
            const songIndex = event.target.selectedIndex;
    
            let img = response.artists.items[albIndex - 1].images[0].url;
            let artist = response.artists.items[albIndex - 1].name;
    
    
            const html = 
      `
                <div class="container">
                 <div class="row col-sm-3 d-fluid justify-content-center px-620">
                      <img src="${img}" alt="">        
                 </div>
                 <div class="row col-sm-6 px-0">
                      <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
                 </div>
                 `;
    
                  let element = document.createElement('div');
                  element.innerHTML = html;
                  document.body.appendChild(element);
    })
    })
})
// voir les artistes sauvegardés
fetch(`https://api.spotify.com/v1/me/albums?limit=${limiter}&offset=${offset}`, {headers})
.then(response => response.json())
.then(response => {
    let getAlbum = document.getElementById('select_album');
    let getSong = document.getElementById('select_song');
    let albIndex ;
    for (let album of response.items){   
        let element = document.createElement('option');
        element.innerText = album.album.name
        getAlbum.appendChild(element);  
    }
    getAlbum.addEventListener("change", (event) => {
        const result = event.target.selectedIndex ;
        while (getSong.childElementCount > 1){
            getSong.removeChild(getSong.lastChild);
        }
        for (let song of response.items[result - 1].album.tracks.items){
            let element2 = document.createElement('option');
            element2.innerText = song.name
            getSong.appendChild(element2);
            
        }
        albIndex = result ;
    }) 
    getSong.addEventListener("change", (event)=> {
        const songIndex = event.target.selectedIndex;
        let img = response.items[albIndex - 1].album.images[0].url;
        let artist = response.items[albIndex - 1].album.artists[0].name;
        let title = response.items[albIndex - 1].album.tracks.items[songIndex - 1].name;
        let duration = response.items[albIndex - 1].album.tracks.items[songIndex - 1].duration_ms;
        let submit = document.getElementById('btn_submit');


        const html = 
  `
            <div class="container">
             <div class="row col-sm-3 d-fluid justify-content-center px-620">
                  <img src="${img}" alt="">        
             </div>
             <div class="row col-sm-6 px-0">
                  <label for="Genre" class="form-label col-sm-12">${title}:</label>
             </div>
             <div class="row col-sm-6 px-0">
                  <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
             </div>
             <div class="row col-sm-6 px-0">
                  <label for="artist" class="form-label col-sm-12">${duration}:</label>
             </div>
             </div> 
              `;

              let element = document.createElement('div');
              element.innerHTML = html;
              document.body.appendChild(element);
        }
    )
})