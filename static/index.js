function load_user() {
    fetch('/Me')
        .then(response => response.json())
        .then(data => {
            // 处理响应
            console.log(data);
            console.log(data.name);
            console.log(data.ip);
            me = data.name

            document.querySelector(".myname").innerHTML = data.name;
            document.querySelector(".myip").innerHTML = data.ip;
        }).catch(error => { console.error('There has been a problem with your fetch operation:', error); alert("远程服务器异常 QAQ") });
    mlist.innerHTML = ""
    message1.innerHTML = ""
    fetch('/List')
        .then(response => response.json())
        .then(data => {
            console.log("friend:", data);
            for (friendip in data) {
                (async function (friendip, data) {
                    friendname = await GetName(friendip)
                    ChatId = data[friendip]
                    console.log(friendip, "\n", friendname, "\n", ChatId);
                    var divElement = document.createElement("div");
                    divElement.setAttribute("class", "Sbox");
                    mlist.appendChild(divElement);
                    divElement.innerHTML = `<div class=\"name\">${friendname}</div><div class=\"ip\">${friendip}</div>`
                    divElement.addEventListener("click", function () { open(friendip); })
                    friends[divElement] = friendip
                })(friendip, data)
            }
            console.log("friend:", friends);
        }).catch(error => { console.error('There has been a problem with your fetch operation:', error); alert("远程服务器异常 QAQ") });
}
async function GetName(ip) {
    return fetch('/Name/' + ip)
        .then(response => response.json())
        .then(data => {
            return data
        }).catch(error => { console.error('There has been a problem with your fetch operation:', error); alert("远程服务器异常 QAQ") });
}
function open(friendip) {
    console.log(friendip)
    now = friendip
    fetch('/history/' + friendip)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            message1.innerHTML = ""
            for (i in data) {
                making = data[i]
                if (making.user == me) {
                    message1.innerHTML += `<div class="message my_message"><p><span class="GoodName">${making.user}</span>${making.message}<br><span>${making.time}</span></p></div>`
                }
                else {
                    message1.innerHTML += `<div class="message frnd_message"><p><span class="GoodName">${making.user}</span>${making.message}<br><span>${making.time}</span></p></div>`
                }
            }
        }).catch(error => { console.error('There has been a problem with your fetch operation:', error); alert("远程服务器异常 QAQ") });
}

/*----------分割----------*/
