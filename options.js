document.getElementById("username").addEventListener("change", function () {
    if (this.checked) {
        console.log("CheckBox Checked");
        chrome.storage.sync.set({
            "showAll": "true"
        });
    } else {
        console.log("CheckBox Unchecked");
        chrome.storage.sync.set({
            "showAll": "false"
        });
    }
})