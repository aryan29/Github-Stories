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
        downloadImage() {
            elem = document.getElementById("preview")
            domtoimage.toJpeg(elem).then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            });
        }
    }

})