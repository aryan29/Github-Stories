//Self executing function
var style = document.createElement('style');
let userData = []
// add the CSS as a string
style.innerHTML = "::-webkit-scrollbar {display: none;    width: 0px;background: transparent; }";
let userAvatars = {};
let counter1 = 0;
let counter2 = 0;
// add it to the head
document.getElementsByTagName('head')[0].appendChild(style);
getFriends = () => {
    username = $(".css-truncate-target.ml-1").first().text().trim();
    console.log(username);
    $.ajax({
        url: "https://api.github.com/users/" + username + "/following",
        dataType: "json",
        method: "GET",
        data: {
            authorization: "token e75064dead9a148752ea665e2676c32875866e39"
        },
        headers: {
            authorization: "token e75064dead9a148752ea665e2676c32875866e39"
        },
        success: (res) => {
            //renderResult(res);
            getStoriesDataFromServer(res)
        },
        error: (...err) => {
            console.log(err)
        }
    })
}

getStoriesDataFromServer = (li) => {
    $.ajax({
        type: "post",
        url: "http://127.0.0.1:5000/getImages",
        data: JSON.stringify(li),
        contentType: 'application/json;charset=UTF-8',
        success: (res) => {
            //console.log(res);
            userData = res;
            renderResult(res);
        },
        error: (...err) => console.log(err)
    })
}
renderResult = (li) => {
    //Adding User avatar
    //This avatar is clickable and adds story for this particular user
    let elem = document.createElement("div");
    myAvatar = $('.avatar-user').attr("src");

    console.log(myAvatar);
    elem.innerHTML = `
    <div id="myAvatar" style="
    background:url(` + myAvatar + `);
    height:50px;
    width:50px;
    border-radius:50px;
    margin:10px 20px 10px 30px;
    background-size:contain;
    "></div>
    `
    $(elem).on("click", () => {

        $(myfile).trigger("click");
    })
    $('#stories').append(elem);
    //Adding all friends avatars
    for (let i = 0; i < li.length; i++) {
        let elem = document.createElement("div");
        elem.innerHTML = `
        <div 
        class="av"
        style="
        background:url(` + li[i]['avatar_url'] + `);
        --border-width:3px;
        --radius:50px;
        display:flex;
        position:relative;

        height:var(--radius);
        width:var(--radius);
        border-radius:var(--radius);
        margin:10px 20px 10px 30px;
        background-size:contain;
        ">
        <div style="
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
        "></div></div>
        `
        $('#stories').append(elem);
    }


}
header = $(".js-header-wrapper");
elem = `<div id="stories" style='
background-color:rgb(6,9,15);
height:100px;
overflow-x:scroll;
position: relative;
z-index:0;
display:flex;
'>
<input type="file" id="file1" style="display:none" ">
</div>`

$(elem).insertAfter(header);
li = getFriends()

myfile = $('#file1');
$('#file1').on("change", () => {
    if (myfile[0].files.length >= 1) {
        console.log("File submitted");
        console.log(myfile[0].files.length);
        let formData = new FormData();
        let file = myfile[0].files[0];
        formData.append('file', file);
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
showStories = (start, data) => {
    console.log("Coming to show stroies");
    oldBody = $('body').html();
    $('body').css({
        "display": "flex",
        "height": "100vh",
        "margin": "0",
        "justify-content": "center",
        "background": "rgb(56,56,56)",
        "align-items": "center"

    })
    console.log("Coming to show stories");
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

    let wait = 5000;
    (function repeat(data, i, j, immediate) {
        wait = (immediate == true) ? 0 : 5000;
        console.log("Before Loop coming", i, j);
        //////////////////////////////////////////////////=>Origin Indexes
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
        //////////////////////////////////////////////////////////////////
        console.log("After Loop coming", i, j);
        $("#moveLeft").on("click", () => {
            //Cancel the current timeout and go to next
            console.log("Key press current timeout", currentTimeout);
            clearTimeout(currentTimeout);
            repeat(data, i, j - 2, true);
            return;
        });
        $("#moveRight").on("click", () => {
            //Cancel the current timeout and go to next
            console.log("Key press current timeout", currentTimeout);
            clearTimeout(currentTimeout);
            repeat(data, i, j, true);
            return;
        });
        //////////////////////////////////////////////////////////Terminating Conditions
        if (i >= data.length || i <= -1) {
            console.log(immediate);
            setTimeout(() => {
                $('#closeIcon').click()
            }, wait)
            console.log("Lets end this", wait);
            return;
        }
        //////////////////////////////////////////////////////////


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
                "height": "5%",
                "width": "100%",
                "top": 0,
                "left": 0,
                "position": "relative",
                "background-color": "rgb(26,26,26)",
                "display": "flex",
                "justify-content": "flex-start",
                "color": "white",
                "align-items": "center"

            });
            $(userProf).append('<div style="margin:auto;max-height:80%;margin-left:20px;margin-right:20px;width:40px;height:40px;border-radius:40px;background:url(' + data[i]['avatar_url'] + ');background-position:center;background-size:contain"></div>');
            $(userProf).append('<div><h3>' + name + '</h3></div>');
            var closeIcon = $('<i id="closeIcon" class="fas fa-times-circle fa-5x" style="font-size:20px;color:red;margin-left:auto;margin-right:10px"></i>')
            $(userProf).append(closeIcon);
            $(elem).html(userProf);
            $(elem).append(img);

            //Adding image to elem
            $(img).css({
                "background-image": "url(http://127.0.0.1:5500/" + data[i]['story'][j] + ")",
                "background-position": "center",
                "background-size": "contain",
                "background-repeat": "no-repeat",
                "width": "100%",
                "height": "90%",
                "margin-top": "15px"
            });
            $(leftButton).css({
                "height": "80%",
                "width": "30px",
                "color": "white",
                "background": "black",
                "border": "none",
                "margin": "0"
            })
            $(rightButton).css({
                "height": "80%",
                "width": "30px",
                "color": "white",
                "background": "black",
                "border": "none",
                "margin": "0"
            })

            // console.log(elem);

            $('body').empty();
            $('body').append(leftButton);
            $('body').append(elem);
            $('body').append(rightButton);

            repeat(data, i, j + 1, false);
            console.log("Current Timeout", currentTimeout);
        }, wait)
    })(data, start, 0, true)


}