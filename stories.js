var vm = new Vue({
    el: '#app',
    data: {
        userName: 'aryan29',
        stories: [],
    },
    mounted() {
        // Adding event listener
        // chrome.runtime.onMessage.addListener((req, a, b) => {
        //     console.log("Message received");
        //     if (req.show == "send-name") {
        //         console.log(req.userName)
        //         this.userName = req.userName
        //         this.getStories();
        //     }

        // })
        chrome.storage.sync.get("github", (data) => {
            console.log(this.github);
            this.userName = data.github;
            this.getStories();
        })
        //this.getStories();
        // this.sendMessage();

    },
    methods: {
        // sendMessage() {
        //     console.log('All assets are loaded');
        //     //Message sent asking for name to bg
        //     chrome.runtime.sendMessage({
        //         show: "ask-name"
        //     })
        // },
        getStories() {
            console.log("Coming to get stories");
            console.log(this.userName);
            axios.post("http://127.0.0.1:5000/individualUser", {
                name: this.userName
            }).then((res) => {
                console.log(res.data);
                this.stories = res.data;
            }, (err) => console.log(err))
        },
        removeElement(index) {
            //Make a delete request to sever if successfull delete it from here too
            axios.post('http://127.0.0.1:5000/deleteStory', {
                name: this.userName,
                index: index,

            }).then(
                (res) => {
                    console.log(res)
                    if (res.data == "Success")
                        console.log("Success")
                    // this.$delete(this.stories, index);
                    else
                        console.log("Some error occcured on server side")
                },
                (err) => console.log(err)
            )

        }
    }

});