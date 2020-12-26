from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import requests
import bs4
app = Flask(__name__, static_url_path='/static')
CORS(app)

# Will be receiving image at this route


def getFollowingList(name):
    res = requests.get(f"https://github.com/{name}?tab=following")
    soup = bs4.BeautifulSoup(res.text, 'html.parser')
    l1 = soup.select(".mb-1 .link-gray")
    l2 = soup.select(".v-align-top .avatar-user")
    following = []
    for elem1, elem2 in zip(l1, l2):
        userInformation = {}
        userInformation['name'] = elem1.text
        userInformation['avatar_url'] = elem2['src']
        following.append(userInformation)
    return following


@app.route('/upload', methods=['POST'])
def upload():
    myfile = request.files['file']
    username = request.form['name']
    print(username)
    if not os.path.isdir(os.path.join("static", username)):
        os.mkdir(os.path.join("static", username))
    myfile.save(os.path.join("static", username, str(time.time())+".png"))
    return "Success"

# Will get a list of users have to return stories for each user


@app.route('/getImages', methods=['POST'])
def getImages():
    print("Here inside get images")
    print(request.json)
    li = getFollowingList(request.json["name"])
    mylist = []
    for elem in li:
        mydict = {}
        mydict["name"] = elem["name"]
        mydict["avatar_url"] = elem["avatar_url"]
        mydict["story"] = getStory(elem['name'])
        if(len(mydict["story"]) > 0):
            mylist.append(mydict)
    print(mylist)
    return jsonify(mylist)


@app.route('/individualUser', methods=['POST'])
def individualUser():
    print(request.json)
    print(getStory(request.json['name']))
    return jsonify(getStory(request.json['name']))

# Will return all images in this directory i.e. stories


@app.route('/deleteStory', methods=['POST'])
def deleteStory():
    try:
        print("Coming to delete story")
        print(request.json)
        name = request.json['name']
        index = request.json['index']
        li = os.listdir(os.path.join("static", name))
        print(li)
        print(li[index])
        os.remove(os.path.join('static', name, li[index]))
        return "Success"
    except:
        return "Failed"
    # Delete that index story from server

    return 200


def getStory(name):
    try:
        li = os.listdir(os.path.join("static", name))
        return [f"static/{name}/{x}" for x in li]
    except:
        return []
    # Return all images in this directory


if __name__ == '__main__':
    app.run(debug=True)
    # getFollowingList("aryan29")
