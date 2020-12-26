document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        console.log(tabs[0].url)
        // Note: this requires "activeTab" permission to access the URL
        if (tabs[0].url == "https://github.com/") {
            document.getElementById("mylist").style.display = "block";
            document.getElementById("msg").style.display = "none";
        } else {
            document.getElementById("mylist").style.display = "none";
            document.getElementById("msg").style.display = "block";
        }
    });
});
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