elem1 = document.getElementById("show-stories")
elem2 = document.getElementById("show-settings")
elem3 = document.getElementById("take-screenshot")
elem1.addEventListener("click", () => {
    console.log("Show stories message send from popup");
    chrome.runtime.sendMessage({
        show: "showStories"
    })
})
elem2.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        show: "settings"
    })
})
elem3.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        show: "screenshot"
    })
})