from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
app = Flask(__name__, static_url_path='/static')
CORS(app)

# Will be receiving image at this route


@app.route('/upload', methods=['POST'])
def upload():
    myfile = request.files['file']
    username = "Aryan"
    if not os.path.isdir(os.path.join("static", username)):
        os.mkdir(os.path.join("static", username))
    myfile.save(os.path.join(username, str(time.time())+".png"))
    return "Hello World!"

# Will get a list of users have to return stories for each user


@app.route('/getImages', methods=['POST'])
def getImages():
    print("Here inside get images")
    li = request.json
    mylist = []
    for elem in li:
        mydict = {}
        print(elem['login'])
        mydict["name"] = elem["login"]
        mydict["avatar_url"] = elem["avatar_url"]
        mydict["story"] = getStory(elem['login'])
        if(len(mydict["story"]) > 0):
            mylist.append(mydict)
    print(mylist)
    return jsonify(mylist)


# Will return all images in this directory i.e. stories
def getStory(name):
    try:
        li = os.listdir(os.path.join("static", name))
        return [f"static/{name}/{x}" for x in li]
    except:
        return []
    # Return all images in this directory


if __name__ == '__main__':
    app.run(debug=True)
