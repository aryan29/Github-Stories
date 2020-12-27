var vm = new Vue({
    el: '#app',
    data: {
        text: "",
        fontSelected: "font1",
        maxLengthInCars: 85,
        bgSelected: "images/bg0.jpg",
        colorSelected: "white",
        fonts: [
            "font1",
            "font2",
            "font3",
            "font4",
            "font5",
            "font6"
        ],
        background: [
            "images/bg0.jpg",
            "images/bg1.jpg",
            "images/bg2.jpg",
            "images/bg3.jpg",
            "images/bg4.jpg",
            "images/bg5.jpg",
            "images/bg6.jpg",
            "images/bg7.jpg",
        ],
        colors: [
            "black",
            "red",
            "white",
            "yellow",
            "cyan",
            "blue",
            "pink",
            "orange"
        ]
    },
    methods: {
        assertMaxChars() {
            if (this.text.length >= this.maxLengthInCars) {
                this.text = this.text.substring(0, this.maxLengthInCars);
            }
        },
        uploadImage() {
            elem = document.getElementById("preview")
            domtoimage.toJpeg(elem, {
                height: 400,
                width: 1200,
                style: {
                    "width": "600px",
                    "margin": "auto",
                    "height": "400px",
                    "text-align": "center"
                }
            }).then(function (url) {
                chrome.storage.sync.get("github", (data) => {
                    let username = data.github;
                    let formData = new FormData();
                    formData.append("file", url)
                    formData.append("name", username)
                    $.ajax({
                        url: "http://127.0.0.1:5000/upload",
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
            });
        },
        downloadImage() {
            elem = document.getElementById("preview")
            domtoimage.toJpeg(elem, {
                height: 400,
                width: 1500,
                style: {
                    "width": "600px",
                    "margin": "auto",
                    "height": "400px",
                    "text-align": "center"
                }
            }).then(function (dataUrl) {
                var link = document.createElement('a');
                var img = new Image()
                img.src = dataUrl;
                document.body.appendChild(img);
                // link.download = 'my-image-name.jpeg';
                // link.href = dataUrl;
                // link.click();

            });
        }
    }

})