
function start() {
    let button = document.querySelector(".btn31");
    let name = document.querySelector(".user-name");
    let success = document.querySelector(".success");
    let text = document.querySelector(".text");
    function all_right() {
        console.log("动画，启动！");
        success.style.zIndex = 2;
        setTimeout("success.style.backgroundColor=\"white\";", 500)
        setTimeout("text.style.opacity=1", 2000)
        setTimeout("text.style.opacity=0", 4000)
        setTimeout("text.innerHTML=name.value+\" !\";text.style.opacity=1", 5000)
        setTimeout("window.location.reload()", 7500)
    }
    button.addEventListener('click', function () {
        //alert(name.value)
        console.log(name.value)
        if (name.value.length < 2) {
            alert("你的名字必须要多于两个字哦 awa")
        }
        else {
            fetch('/sign/' + name.value)
                .then(Response => {
                    if (!Response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return Response.text();
                })
                .then(data => {
                    // 处理响应
                    console.log(data);
                    if (data == 1) {
                        alert("你的 ip 已被使用！ :(")
                    }
                    else if (data == 2) {
                        alert("该名字已被注册 :(")
                    }
                    else {
                        //alert("Welcome!")
                        all_right()
                    }
                })

                .catch(error => {
                    // 处理错误
                    console.error('There has been a problem with your fetch operation:', error);
                    alert("远程服务器异常 QAQ")
                });
        }
    })
}