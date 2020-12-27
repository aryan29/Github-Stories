//--------------------Adding CSS stylesheet-----------------------------------------------------------
var css = `
::-webkit-scrollbar {display: none;    width: 0px;background: transparent; }
@keyframes moveGradient {
    50% {
      background-position: 100% 50%;
    }     
}   
#myAvatar{
    height:50px;
    width:50px;
    border-radius:50px;
    margin:10px 20px 10px 30px;
    background-size:contain;
    cursor:pointer;
}  
.av{
    --border-width:3px;
    --radius:50px;
    display:flex;
    cursor:pointer;
    position:relative;
    height:var(--radius);
    width:var(--radius);
    border-radius:var(--radius);
    margin:10px 20px 10px 30px;
    background-size:contain !important;
}
.inner-av{
    position: absolute;
    content: '';
    top: calc(-1 * var(--border-width));
    left: calc(-1 * var(--border-width));
    z-index: -1;
    width: calc(100% + var(--border-width) * 2);
    height: calc(100% + var(--border-width) * 2);
    background: linear-gradient(
      60deg,
      hsl(224, 85%, 66%),
      hsl(269, 85%, 66%),
      hsl(314, 85%, 66%),
      hsl(359, 85%, 66%),
      hsl(44, 85%, 66%),
      hsl(89, 85%, 66%),
      hsl(134, 85%, 66%),
      hsl(179, 85%, 66%)
    );
    background-size: 300% 300%;
    background-position: 0 50%;
    border-radius: calc(2 * var(--radius));
    animation: moveGradient 4s alternate infinite;
}
#stories{
    background-color:rgb(6,9,15);
    height:100px;
    overflow-x:scroll;
    position: relative;
    z-index:0;
    display:flex;
}
#moveLeft, #moveRight{
    height: 80%;
    width: 30px;
    color: white;
    background: black;
    border: none;
    margin: 0;
}
#closeIcon{
    font-size:20px;
    color:red;
    margin-left:auto;
    margin-right:10px;
}
.my-progress-bar{
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    background-color: #0d6efd;
    transition: width .6s ease;
    background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-size: 1rem 1rem;
    width: 0%;
    height: 1px;
    position: relative;
}
`
head = document.head || document.getElementsByTagName('head')[0];
style = document.createElement('style');
head.appendChild(style);
style.setAttribute("type", 'text/css')
if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'bootstrap.css';
head.appendChild(link)
//--------------------------------------------------------------------------------------------------



let userData = [] //Sotring data that came back from server
let username = ""; //Storing username
getFollowing = () => {
    username = $(".css-truncate-target.ml-1").first().text().trim(); //Extracting user name from github.com
    chrome.storage.sync.set({
        "github": username
    });

    //Sending name to server to get following and more data
    getStoriesDataFromServer(username)
}

//-------------------------Sending data to server------------------------------------------------
getStoriesDataFromServer = (name) => {
    $.ajax({
        type: "post",
        url: "http://127.0.0.1:5000/getImages",
        data: JSON.stringify({
            'name': name
        }),
        contentType: 'application/json;charset=UTF-8', //Sendign in json format
        success: (res) => {
            //console.log(res);
            userData = res;
            renderResult(res);
        },
        error: (...err) => console.log(err)
    })
}
//--------------------------------------------------------------------------------


//---------------------------------------------Render avatars on github-----------------------------
renderResult = (li) => {
    let elem = document.createElement("div");
    elem.innerHTML =
        `
        <div id="myAvatar" style="
        background:url(chrome-extension://ncgpaljlfimkdpmbpccgjemnjbfedaki/images/plus1.jpg);
        background-position:center;
        background-size: contain;
        "></div>
        `
    //---------------------Event Listener for file upload --------------
    $(elem).on("click", () => {
        $(myfile).trigger("click");
    })
    //------------------------------------------------------------------
    $('#stories').append(elem);
    //Adding all friends avatars
    for (let i = 0; i < li.length; i++) {
        let elem = document.createElement("div");
        elem.innerHTML = `
        <div 
        class="av"
        style="
        background:url(` + li[i]['avatar_url'] + `);">
        <div class="inner-av"></div></div>
        `
        $('#stories').append(elem);
    }
}
//-------------------------------------------------------------------------------------------------



header = $(".js-header-wrapper");
elem = `<div id="stories">
<input type="file" id="file1" style="display:none" ">
</div>`

$(elem).insertAfter(header);
li = getFollowing()

//------------------------------Stories uploading to server--------------------------------------------
myfile = $('#file1');
$('#file1').on("change", () => {
    if (myfile[0].files.length >= 1) {
        console.log("File submitted");
        console.log(myfile[0].files.length);
        let formData = new FormData();
        let file = myfile[0].files[0];
        formData.append('file', file);
        formData.append('name', username);
        //Send Ajax request to the server
        $.ajax({
            url: "http://127.0.0.1:5000/upload",
            type: "post",
            data: formData,
            processData: false,
            contentType: false,
            success: (res) => console.log(res),
            error: (...err) => console.log(err)
        })
    }
})
//-----------------------------------------------------------------------------------



//----------------------Adding some event listeners--------------------------------------
$(document).on("click", '.av', function () {
    ind = $(this).parent().parent().children().index($(this).parent());
    console.log(ind - 2);
    console.log("Story clicked");
    //Show all stories starting from this index in dictionary
    if (ind >= 2)
        showStories(ind - 2, userData);

})
$(document).on('click', '#closeIcon', () => {
    console.log("I am being pressed");
    location.reload();
})
//------------------------------------------------------------------------------------------



//----------------------Show story when avatar is clicked---------------------------------------
showStories = (start, data) => {
    console.log("Coming to show stroies");
    oldBody = $('body').html();
    $('body').css({
        "display": "flex",
        "height": "100vh",
        "margin": "0",
        "justify-content": "center",
        "background": "rgb(56,56,56)",
        "align-items": "center",
        "flex-wrap": "wrap",
        "align-content": "center"

    })
    console.log("Coming to show stories");
    let timerIdCopy = 0
    let name = data[0]['name']
    let elem = document.createElement("div");
    let userProf = document.createElement('div');
    let img = document.createElement("div");
    let leftButton = document.createElement('button');
    let rightButton = document.createElement('button');
    leftButton.id = "moveLeft";
    rightButton.id = "moveRight";
    $(leftButton).append('<i class="fas fa-chevron-left"></i>');
    $(rightButton).append('<i class="fas fa-chevron-right"></i>');
    let currentTimeout = 0;

    let wait = 5000; //Wait Time for opening next story
    (function repeat(data, i, j, immediate) {
        newWait = (immediate == true) ? 0 : wait;
        console.log("Before Loop coming", i, j);
        //------------------------------------Origin Indexes------------------------------------
        if (j < 0) {
            i -= 1;
            if (i >= 0) {
                if (data[i]['story'].length >= -1 * j)
                    j = data[i]['story'].length + j;
                else {
                    i -= 1;
                    if (i >= 0)
                        j = data[i]['story'].length - 1;
                }
            }
        }
        if (i >= 0 && i < data.length && j >= data[i]['story'].length) {
            i += 1;
            j = 0;
        }
        //-------------------------------------------------------------------------------------------
        $("#moveLeft").on("click", () => {
            //Cancel the current timeout and go to next
            console.log("Key press current timeout", currentTimeout);
            clearTimeout(currentTimeout);
            clearInterval(timerIdCopy);
            repeat(data, i, j - 2, true);
            return;
        });
        $("#moveRight").on("click", () => {
            //Cancel the current timeout and go to next
            console.log("Key press current timeout", currentTimeout);
            clearTimeout(currentTimeout);
            clearInterval(timerIdCopy);
            repeat(data, i, j, true);
            return;
        });

        //--------------------------------Terminating conditions-------------------------------------
        if (i >= data.length || i <= -1) {
            console.log(immediate);

            setTimeout(() => {
                $('#closeIcon').click()
            }, newWait)
            console.log("Lets end this", newWait);
            return;
        }
        //--------------------------------------------------------------------------------------------------


        currentTimeout = setTimeout(function () {
            console.log("Inside set timeout");
            console.log(i, j);
            name = data[i]['name'];
            $(elem).html('')
            $(userProf).html('')
            $(img).html('')
            $(elem).css({
                "height": "80%",
                "width": "80%",
                "margin": "0",
                "background": "black",
            })
            $(userProf).css({
                "height": "7%",
                "width": "calc(80% + 60px)",
                "top": 0,
                "left": 0,
                "margin": "auto",
                "position": "relative",
                "background-color": "rgb(26,26,26)",
                "display": "flex",
                "justify-content": "flex-start",
                "color": "white",
                "align-items": "center",
                "flex-flow": "wrap"

            });
            /////////////Progress Bar
            progressBar = document.createElement("div");
            $(progressBar).addClass("my-progress-bar")
            let percent = 0;
            let timerId = setInterval(() => {

                percent += 5;
                console.log(percent);
                $(progressBar).css('width', percent + "%")
                if (percent >= 100)
                    clearInterval(timerId);
            }, wait / 20.0)
            timerIdCopy = timerId;
            ////////////////
            $(userProf).append('<div style="margin:auto;max-height:80%;margin-left:20px;margin-right:20px;width:40px;height:40px;border-radius:40px;background:url(' + data[i]['avatar_url'] + ');background-position:center;background-size:contain;background-repeat:no-repeat"></div>');
            $(userProf).append('<div><h3>' + name + '</h3></div>');
            var closeIcon = $('<i id="closeIcon" class="fas fa-times-circle fa-5x"></i>')
            $(userProf).append(closeIcon);
            $(userProf).append('<div style="flex-basis:100%;height:0"></div>')
            $(userProf).append(progressBar); //Progress Bar
            $(elem).append(img);
            $(img).css({
                "background-image": "url(http://127.0.0.1:5000/" + data[i]['story'][j] + ")",
                "background-position": "center",
                "background-size": "contain",
                "background-repeat": "no-repeat",
                "width": "100%",
                "height": "90%",
                "margin-top": "15px",
            });
            $('body').empty();
            let nowelem = document.createElement("div");
            $(nowelem).css("flex-basis", "100%")
            $(nowelem).append(userProf)
            $('body').append(nowelem);
            $('body').append(leftButton);
            $('body').append(elem);
            $('body').append(rightButton);

            repeat(data, i, j + 1, false);
            console.log("Current Timeout", currentTimeout);
        }, newWait)
    })(data, start, 0, true)
}





//------Listening chrome extension message for opening user stories from his github page--------------------
// chrome.runtime.onMessage.addListener(function (req, a, b) {
//     console.log("Message received in content script");
//     if (req.show == "send-name") {
//         chrome.runtime.sendMessage({
//             show: "got-name",
//             userName: username
//         })
//     }
// })
chrome.runtime.sendMessage({
    show: "icon-change"
})
//------------------------------------------------------------------------------------------------------------