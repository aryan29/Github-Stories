let userName = "" //Stores username temp in memory

//---------------------------Message passing---------------------------------------------------
chrome.runtime.onMessage.addListener(function (req, sender, res) {
    console.log("Message Received here in background");
    if (req.show == "showStories") {
        // userName = "";
        // chrome.tabs.query({
        //     active: true,
        //     currentWindow: true
        // }, function (tabs) {
        //     chrome.tabs.sendMessage(tabs[0].id, {
        //         show: "send-name"
        //     });
        // });
        // console.log("Message send to get name of the person");


        chrome.tabs.create({
            url: chrome.runtime.getURL("stories.html")
        })
    } else if (req.show == "text-story") {

        chrome.tabs.create({
            url: chrome.runtime.getURL("text-story.html")
        })
    } else if (req.show == "aboutUs") {
        chrome.tabs.create({
            url: chrome.runtime.getURL("aboutUs.html")
        })
    } else if (req.show == "screenshot") {
        chrome.tabs.captureVisibleTab((url) => {
            let formData = new FormData();
            chrome.storage.sync.get("github", (data) => {
                let username = data.github;
                formData.append("file", url)
                formData.append("name", username)
                $.ajax({
                    url: "https://githubstories.herokuapp.com/upload",
                    type: "post",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: (res) => {
                        console.log(res);
                        if (res == "Success") {
                            console.log("Message sent");
                            //Send message to popup informing about upload done
                            chrome.runtime.sendMessage({
                                show: "uploaded",
                            })
                        }
                    },
                    error: (...err) => console.log(err)
                })
            })

        })
    }
    //  else if (req.show == "got-name") {
    //     console.log("Got name from content script")
    //     //Open new tab now
    //     chrome.tabs.create({
    //         url: chrome.runtime.getURL("stories.html")
    //     })
    //     userName = req.userName;
    // } else if (req.show == "ask-name") {
    //     console.log("Message received asking for name and sending res back");
    //     chrome.runtime.sendMessage({
    //         show: "send-name",
    //         userName: userName
    //     })
    // chrome.tabs.query({
    //     active: true,
    //     currentWindow: true
    // }, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {
    //         show: "send-name",
    //         userName: userName
    //     });
    // });
    //}
    else if (req.show == "icon-change") {
        console.log("Icon change req received");
        chrome.browserAction.setIcon({
            path: "/images/logoa.png",
            tabId: sender.tab.id
        })
    }
})

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        y = tab.url;
        console.log("you are here: " + y);
        disableHeaders(y);
    });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (tab.active && change.url) {
        y = change.url;
        console.log("you are here: " + change.url);
        disableHeaders(y);
    }
});

//--------------------------------------------------------------------------------------




//-------------------Disabling cors headers to github to enable showing any image---------------------
var editHeaders = function (details) {
    for (var i = 0; i < details.responseHeaders.length; i++) {
        if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
            details.responseHeaders[i].value = '';
        }
    }
    return {
        responseHeaders: details.responseHeaders
    };
};

function disableHeaders(url) {
    console.log("Coming inside disabling headers");
    chrome.browsingData.remove({}, {
        serviceWorkers: true
    }, function () {});

    var onHeaderFilter = {
        urls: ['*://*/*'],
        types: ['main_frame', 'sub_frame']
    };
    if (url == "https://github.com/") {
        //Disable headers
        chrome.webRequest.onHeadersReceived.addListener(
            editHeaders, onHeaderFilter, ['blocking', 'responseHeaders']
        );
    }
}
//----------------------------------------------------------------------------------------------------