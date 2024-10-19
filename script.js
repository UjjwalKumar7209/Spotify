let songs = [];
let currentSong = new Audio();

// Time formatting
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    minutes = minutes.toString().padStart(2, '0');
    secs = secs.toString().padStart(2, '0');
    return minutes + ':' + secs;
}



// Fetching songs and storing the href in songs array
async function getSongs(folderName) {
    let URL = await fetch(`http://127.0.0.1:3000/songs/${folderName}/`);
    let response = await URL.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    document.querySelector(".songUL").innerHTML = ""
    songs = [];
    document.querySelector(".songUL").innerHTML = ""
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
            document.querySelector(".songUL").innerHTML = document.querySelector(".songUL").innerHTML + `
            <li data-href = "${element.href}" class = "songNameAside pointer"><span class="leftMusic"><img src="music.svg" alt="">${element.href.split(`/${folderName.replaceAll(" ", "%20")}/`)[1].replaceAll("%20", " ")}</span><span>Play Now <img width = "18" src="play.svg" width="20" alt=""></span></li>
            `
        }
    }
    playSong(folderName);
}



// Play song on tap and update the name of song and time in seek
async function playSong(folderName) {
    document.querySelectorAll(".songNameAside").forEach((e) => {
        e.addEventListener("click", () => {
            currentSong.src = e.getAttribute("data-href");
            currentSong.play()
            document.querySelector(".seekPlayPause").src = "pause.svg";
            setInterval(() => {


                document.querySelector(".songInfo").innerHTML = `<p>${currentSong.src.split(`/${folderName.replaceAll(" ", "%20")}/`)[1].replaceAll("%20", " ")}</p>`;
                document.querySelector(".duration").innerHTML = `<p>${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}</p>`
                document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`
            }, 1000);
        })
    })


    document.querySelector(".seekPlayPause").addEventListener("click", () => {
        if (currentSong.paused) {
            document.querySelector(".seekPlayPause").src = "pause.svg";
            currentSong.play();
        }
        else {
            document.querySelector(".seekPlayPause").src = "play.svg";
            currentSong.pause();
        }
    })

}

// Hamburger event
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector("aside").style.left = 0
})

// Close Hamburger event
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector("aside").style.left = "-115%"
})



// Dynamic loading of albums
async function dynamicAlbum(folderName) {
    let URL = await fetch(`http://127.0.0.1:3000/songs/${folderName}/assets/readme.txt`);
    let response = await URL.text();
    document.querySelector(".album").innerHTML += `
    <div id = "${folderName.replaceAll(" ", "_").replaceAll(".", "_")}" class="songAlbum pointer container">
        <div class="album-image"><img width="150" src="songs/${folderName}/assets/${folderName}.jpg" alt="">
            <div class="circlePlay">
                <img src="play.svg" alt="">
            </div>
        </div>
        <div class="album-text">${response}</div>
    </div>
    `
    document.querySelector(`#${folderName.replaceAll(" ", "_").replaceAll(".", "_")}`).addEventListener("click", () => {
        getSongs(`${folderName}`);
    })

    // Play previous Song
    document.querySelector(".previousButton").addEventListener("click", () => {
        let src = currentSong.src;
        let index = songs.indexOf(src);
        if (index >= 0) {
            currentSong.src = songs[index - 1]
            currentSong.play();
        }
    })



    // Play next Song
    document.querySelector(".nextButton").addEventListener("click", () => {
        let src = currentSong.src;
        let index = songs.indexOf(src);
        if (index < songs.length) {
            currentSong.src = songs[index + 1]
            currentSong.play();
        }
    })
}

dynamicAlbum("Desi Kalakaar");
dynamicAlbum("Honey 3.0");
dynamicAlbum("Ek Tha Raja");