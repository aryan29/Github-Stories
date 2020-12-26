import requests
import bs4


def getFollowingList(name):
    print(f"https://github.com/{name}?tab=following")
    res = requests.get(f"https://github.com/{name}?tab=following")
    print(res)
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


getFollowingList("aryan29")
