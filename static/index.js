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
                    divElement.addEventListener("click", function () { open(friendip, true); })
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
async function open(friendip, down) {
    now = friendip
    fetch('/history/' + friendip)
        .then(response => response.json())
        .then(data => {
            if (now == undefined) { return }
            else {
                if (over == undefined || last != now) {
                    message1.innerHTML = ""
                    console.log("全更新");
                    more = data
                }
                else {
                    more=compareObjects(over,data)
                    if (Object.keys(more).length == 0) return;
                    console.log("差异更新");
                }
            }
            for (i in more) {
                making = more[i]
                if (making.user == me) {
                    message1.innerHTML += `<div class="message my_message"><p><span class="GoodName">${making.user}</span>${making.message}<br><span>${making.time}</span></p></div>`
                }
                else {
                    message1.innerHTML += `<div class="message frnd_message"><p><span class="GoodName">${making.user}</span>${making.message}<br><span>${making.time}</span></p></div>`
                }
            }
            last = now;
            over = data
            if (down) { setTimeout("under()", 500) }

        }).catch(error => { console.error('There has been a problem with your fetch operation:', error); alert("远程服务器异常 QAQ") });
}
function under() {
    message1.scrollTo({
        top: message1.scrollHeight,
        behavior: "smooth",
    });
}
function compareObjects(a, b) {
    result = {};

    for (key in b) {
        if (!a.hasOwnProperty(key)) {
            result[key] = b[key];
        }
    }
    return result;
}
/*
function compareObjects(obj1, obj2) {
    // 首先判断两个对象是否为null或undefined
    if (obj1 === null || typeof obj1 !== 'object' || obj2 === null || typeof obj2 !== 'object') {
        return false;
    }
    
    // 获取obj1和obj2的所有属性名称
    const keys = Object.keys(obj1);
  
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      
      // 如果obj2中没有与obj1相同的属性，则返回false
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
          return false;
      }
      
      // 如果当前属性值不相等，则返回false
      if ((typeof obj1[key] === 'object' && typeof obj2[key] === 'object')) {
          if (!compareObjects(obj1[key], obj2[key])) {
              return false;
          }
      } else if (obj1[key] !== obj2[key]) {
          return false;
      }
    }
    
    // 最后再次确认obj2中没有多余的属性
    const keys2 = Object.keys(obj2);
    for (let j = 0; j < keys2.length; j++) {
      const key = keys2[j];
      if (!Object.prototype.hasOwnProperty.call(obj1, key)) {
          return false;
      }
    }
    
    return true;
}
*/

/*----------分割----------*/
