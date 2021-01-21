elem1 = document.getElementById("show-stories")
elem2 = document.getElementById("show-aboutUs")
elem3 = document.getElementById("take-screenshot")
elem4 = document.getElementById("upload-textstory")
elem1.addEventListener("click", () => {
    console.log("Show stories message send from popup");
    chrome.runtime.sendMessage({
        show: "showStories"
    })
})
elem2.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        show: "aboutUs"
    })
})
elem3.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        show: "screenshot"
    })
})
elem4.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        show: "text-story"
    })
})
chrome.runtime.onMessage.addListener(function (req, sender, res) {
    if (req.show == "uploaded") {
        document.getElementsByTagName("body")[0].innerHTML = "<h5>Screenshot uploaded</h5>"
    }
})
