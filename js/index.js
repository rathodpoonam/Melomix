let currentSong = new Audio();
let songs;
let currFolder;

//functon for min sec
function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = remainingSeconds.toFixed(2).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}





async function getSongElements(folder) {
    currFolder = folder;
    try {
        // Make a fetch request to the server endpoint that returns the HTML content
        const response = await fetch(`${folder}/`);

        // Check if the request was successful (status code in the range of 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the HTML content from the response
        const htmlContent = await response.text();

        // Create a temporary div element to hold the parsed HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Get the parent element containing the song elements
        const filesList = tempDiv.querySelector('#files');

        // Check if the parent element exists
        if (filesList) {
            // Get all anchor (a) elements within the parent element
            const songElements = filesList.getElementsByTagName('a');

            // Log the HTML collection to the console
            // console.log(songElements);
            // let as= songElements.getElementsByTagName("a")
            songs = []

            // You can now loop through the HTML collection and access individual song elements
            for (let i = 0; i < songElements.length; i++) {
                const element = songElements[i]; // Accessing the text content of each song element
                // Add your logic to work with each song element
                //   var audio = new Audio('audio_file.mp3');
                //      audio.play()

                if (element.href.endsWith(".mp3")) {
                    songs.push(element.href.split(`/${folder}/`)[1])
                }

            }
            let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
            songUL.innerHTML = ""
            for (const song of songs) {
                songUL.innerHTML = songUL.innerHTML + ` <li>
                <img class="invert" src="./IMG/music.svg" alt="">
                <div class="info">
                    <div> ${song}</div>
                    <div>Harry</div>
                    
                    </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="./IMG/stopplay.svg" alt="">
                </div>
            </li>`
            }


            //attach  an event listner  toeach song
            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
                e.addEventListener("click", element => {

                    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

                })

            })
            return songs;
        }
    }
    catch (error) {
        // Handle errors
        console.error('Fetch error:', error.message);
    }

}

//playmusic function
const playMusic = (track, pause = false) => {

    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        playim.src = "./IMG/play.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = " 00:00 / 00:00"
}

async function displayAlbums() {
    let response = await fetch(`songs/`);

    // Check if the request was successful (status code in the range of 200-299)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the HTML content from the response
    const htmlContent = await response.text();

    // Create a temporary div element to hold the parsed HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    // console.log(tempDiv);
    let achors = tempDiv.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(achors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        // console.log(e.href);

        if (e.href.includes("songs/")) {
            let folder = e.href.split("/").slice(-1)[0];
            //get meta data of folders


            // http://127.0.0.1:5500/songs/
            let response = await fetch(`songs/${folder}/info.json`)
            let htmlContent = await response.json();
            console.log(htmlContent);
            cardContainer.innerHTML = cardContainer.innerHTML +
                `<div data-folder="${folder}" class="card ">
                    <div  class="play">
                        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                             <!-- Circular background -->
                             <circle cx="50" cy="50" r="50" fill="#1fdf64" />
                             <!-- Play symbol -->
                             <path d="M70.3125 50L31.25 77.9429V22.0571L70.3125 50Z" fill="#000000" />
                         </svg>
                     </div>
                         <img src="songs/${folder}/cover.jpg" alt="">
                         <h2> ${htmlContent.title} 2024</h2>
                         <p>${htmlContent.description}</p>
                </div>`




        }
    }
    // console.log(achors);
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            // console.log(item, item.target.dataset);
            songs = await getSongElements(`songs/${item.currentTarget.dataset.folder}`);
            playMusic (songs[0]);

        })
    })



}
displayAlbums()


// Call the async function to get the song elements
async function main() {
    //get the songs list 
    await getSongElements("songs/ncs");
    playMusic(songs[0], true)
    // console.log(songs);

    //attche an event listner to play next and previous
    playim.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playim.src = "IMGplay.svg"
        }
        else {
            currentSong.pause()
            playim.src = "IMG/stopplay.svg"
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);


        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    });

    //eventlistner for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //Add an eventListner for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    //
    //Add an eventListner for close button


    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })


    per.addEventListener("click", () => {
        console.log("pervious click");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        // console.log(songs, index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])

        }


    })


    next.addEventListener("click", () => {
        console.log("next click");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        // console.log(songs, index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])

        }

    })
    // //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("Setting volume- " + e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100

    })
    //load  the playlist whenever card is clicked

    //add eventlistner to mute track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        // console.log(e.target);
        if(e.target.src.includes("volume.svg")){
            e.target.src= e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = 1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }
        
    })
    


}
main()


