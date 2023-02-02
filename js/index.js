let vh = window.innerHeight * 0.01;
let vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

if (100*vw <= 1200){
    var ismobile = true;
} else {
    var ismobile = false;
}

// 리사이즈
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    loadcolorcodes(vw);

    if (100*vw <= 1200){
        var ismobile_next = true;
    } else {
        var ismobile_next = false;
    }
    if (ismobile !== ismobile_next){
        loadcontents(vw);
        ismobile = ismobile_next;
    }
})

function getToday(){
    var date = new Date();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return month + day;
}

function getYesterday(){
    var date = new Date();
    date.setDate(date.getDate() - 1);
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return month + day;
}

function getTomorrow(){
    var date = new Date();
    date.setDate(date.getDate() + 1);
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return month + day;
}

function getNthDay(n){
    var date = new Date();
    date.setDate(date.getDate() - n);
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + month + day;
}


function parseMd(md){

    //images with links
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<div class="gallery"><a href="$3"><img src="$2" alt="$1" width="100%" /></a></div>');
    
    //images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" width="100%" />');
    
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
    
    //code with colorcode
    md = md.replace(/[\`]{1}([^\`]+)[\s]{1}([^\`]+)[\`]{1}/g, '<code style="background-color: var(--$1);">$2</code>');
    
    //code
    md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, '<code>$1</code>');

    //br
    md = md.replace(/\n\n/g, '</p><p>');
    
    return md;
}

function findColor(md){
    var color = md.match(/\`\w+/gm);

    for (i=0; i<color.length; i++){
        color[i] = color[i].substring(1)
    }

    return color;
}


const grey = '#dbdbdb'
const red = '#ffadad'
const orange = '#ffd6a5'
const yellow = '#fdffb6'
const green = '#caffbf'
const sky = '#9bf6ff'
const blue = '#a0d4ff'
const purple = '#bdb2ff'
const pink = '#ffc6ff'

function makeColorString(color){
    var string = 'linear-gradient('
    for (j=0; j<color.length; j++){
        if (j == color.length-1){
            string += eval(color[j])+')'
        } else {
            string += eval(color[j])+','
        }
    }
    return string;
}

const year = new Date().getFullYear();
const today = getToday();
const yesterday = getYesterday();
const tomorrow = getTomorrow();
const dayTracker = document.querySelector("#daytracker")
const diary = document.querySelector("#diary")


function loadcolorcodes(vw){

    dayTracker.innerHTML = ""
    var colorCount = parseInt(100*vw/60)
    for (i=0; i<colorCount; i++){
        if (i == colorCount-1) {
            dayTracker.innerHTML += "<div class='todayColorCube' id='day"+(colorCount-i)+"'></div>"
        } else {
            dayTracker.innerHTML += "<div class='colorCube' id='day"+(colorCount-i)+"'></div>"
        }
        
    }

    var dayArray = []
    var colorArray = []

    for (i=0; i<colorCount; i++){
        dayArray.push(document.querySelector("#day"+(colorCount-i)))
        var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+getNthDay(colorCount-i-1)+".md"
            fetch(url)
            .then(res => res.text())
            .then((out) => {
                if (out.includes('404')){
                    colorArray.push(grey)
                } else {
                    color = findColor(out)
                    if (color.length < 2) {
                        colorArray.push(eval(color[0]))
                    } else {
                        colorArray.push(makeColorString(color))
                    }
                }
            })
            .catch(err => { throw err });
    }

    setTimeout(() => {
        for (i=0; i<colorCount; i++){
            console.log(colorArray)
            dayArray[i].style.background = colorArray[i]
        }
    }, 200);
}

function loadcontents(vw){
    
if (100*vw > 1200) {

    diary.innerHTML = "<div id='yesterdiary'></div><div id='todiary'></div><div id='tomorrowdiary'></div>";

    var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year)+yesterday+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        if (out == "404: Not Found"){
            document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year)+yesterday+"</h2>기록이 없습니다.</div>"
        } else {
            document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year)+yesterday+"</h2>"+parseMd(out)+"</div>"
        }
        var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-1)+yesterday+".md"
        fetch(url)
        .then(res => res.text())
        .then((out) => {
            if (out == "404: Not Found"){
                document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-1)+yesterday+"</h2>기록이 없습니다.</div>"
            } else {
                document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-1)+yesterday+"</h2>"+parseMd(out)+"</div>"
            }
            var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-2)+yesterday+".md"
            fetch(url)
            .then(res => res.text())
            .then((out) => {
                if (out == "404: Not Found"){
                    document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-2)+yesterday+"</h2>기록이 없습니다.</div>"
                } else {
                    document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-2)+yesterday+"</h2>"+parseMd(out)+"</div>"
                }
                var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-3)+yesterday+".md"
                fetch(url)
                .then(res => res.text())
                .then((out) => {
                    if (out == "404: Not Found"){
                        document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-3)+yesterday+"</h2>기록이 없습니다.</div>"
                    } else {
                        document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-3)+yesterday+"</h2>"+parseMd(out)+"</div>"
                    }
                    var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-4)+yesterday+".md"
                    fetch(url)
                    .then(res => res.text())
                    .then((out) => {
                        if (out == "404: Not Found"){
                            document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-4)+yesterday+"</h2>기록이 없습니다.</div>"
                        } else {
                            document.querySelector("#yesterdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-4)+yesterday+"</h2>"+parseMd(out)+"</div>"
                        }
                    })
                    .catch(err => { throw err });
                })
                .catch(err => { throw err });
            })
            .catch(err => { throw err });
        })
        .catch(err => { throw err });
    })
    .catch(err => { throw err });

var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year)+today+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        if (out == "404: Not Found"){
            document.querySelector("#todiary").innerHTML += "<div class='today'><h2 class='d'>"+(year)+today+"</h2>기록이 없습니다.</div>"
        } else {
            document.querySelector("#todiary").innerHTML += "<div class='today'><h2 class='d'>"+(year)+today+"</h2>"+parseMd(out)+"</div>"
        }
        var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-1)+today+".md"
        fetch(url)
        .then(res => res.text())
        .then((out) => {
            if (out == "404: Not Found"){
                document.querySelector("#todiary").innerHTML += "<div class='dates'><h2 class='d'>"+(year-1)+today+"</h2>기록이 없습니다.</div>"
            } else {
                document.querySelector("#todiary").innerHTML += "<div class='dates'><h2 class='d'>"+(year-1)+today+"</h2>"+parseMd(out)+"</div>"
            }
            var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-2)+today+".md"
            fetch(url)
            .then(res => res.text())
            .then((out) => {
                if (out == "404: Not Found"){
                    document.querySelector("#todiary").innerHTML += "<div class='dates'><h2 class='d'>"+(year-2)+today+"</h2>기록이 없습니다.</div>"
                } else {
                    document.querySelector("#todiary").innerHTML += "<div class='dates'><h2 class='d'>"+(year-2)+today+"</h2>"+parseMd(out)+"</div>"
                }
                var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-3)+today+".md"
                fetch(url)
                .then(res => res.text())
                .then((out) => {
                    if (out == "404: Not Found"){
                        document.querySelector("#todiary").innerHTML += "<div class='dates'><h2 class='d'>"+(year-3)+today+"</h2>기록이 없습니다.</div>"
                    } else {
                        document.querySelector("#todiary").innerHTML += "<div class='dates'><h2 class='d'>"+(year-3)+today+"</h2>"+parseMd(out)+"</div>"
                    }
                    var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-4)+today+".md"
                    fetch(url)
                    .then(res => res.text())
                    .then((out) => {
                        if (out == "404: Not Found"){
                            document.querySelector("#todiary").innerHTML += "<div class='dates'><h2 class='d'>"+(year-4)+today+"</h2>기록이 없습니다.</div>"
                        } else {
                            document.querySelector("#todiary").innerHTML += "<div class='dates'><h2 class='d'>"+(year-4)+today+"</h2>"+parseMd(out)+"</div>"
                        }
                    })
                    .catch(err => { throw err });
                })
                .catch(err => { throw err });
            })
            .catch(err => { throw err });
        })
        .catch(err => { throw err });
    })
    .catch(err => { throw err });

    var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year)+tomorrow+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        if (out == "404: Not Found"){
            document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year)+tomorrow+"</h2>기록이 없습니다.</div>"
        } else {
            document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year)+tomorrow+"</h2>"+parseMd(out)+"</div>"
        }
        var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-1)+tomorrow+".md"
        fetch(url)
        .then(res => res.text())
        .then((out) => {
            if (out == "404: Not Found"){
                document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-1)+tomorrow+"</h2>기록이 없습니다.</div>"
            } else {
                document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-1)+tomorrow+"</h2>"+parseMd(out)+"</div>"
            }
            var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-2)+tomorrow+".md"
            fetch(url)
            .then(res => res.text())
            .then((out) => {
                if (out == "404: Not Found"){
                    document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-2)+tomorrow+"</h2>기록이 없습니다.</div>"
                } else {
                    document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-2)+tomorrow+"</h2>"+parseMd(out)+"</div>"
                }
                var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-3)+tomorrow+".md"
                fetch(url)
                .then(res => res.text())
                .then((out) => {
                    if (out == "404: Not Found"){
                        document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-3)+tomorrow+"</h2>기록이 없습니다.</div>"
                    } else {
                        document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-3)+tomorrow+"</h2>"+parseMd(out)+"</div>"
                    }
                    var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-4)+tomorrow+".md"
                    fetch(url)
                    .then(res => res.text())
                    .then((out) => {
                        if (out == "404: Not Found"){
                            document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-4)+tomorrow+"</h2>기록이 없습니다.</div>"
                        } else {
                            document.querySelector("#tomorrowdiary").innerHTML += "<div class='nottoday'><h2 class='nd'>"+(year-4)+tomorrow+"</h2>"+parseMd(out)+"</div>"
                        }
                    })
                    .catch(err => { throw err });
                })
                .catch(err => { throw err });
            })
            .catch(err => { throw err });
        })
        .catch(err => { throw err });
    })
    .catch(err => { throw err });

} else {

    diary.innerHTML = "<div id='todiary1c'></div>";

var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year)+today+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        if (out == "404: Not Found"){
            document.querySelector("#todiary1c").innerHTML += "<div class='today1c'><h2 class='d'>"+(year)+today+"</h2>기록이 없습니다.</div>"
        } else {
            document.querySelector("#todiary1c").innerHTML += "<div class='today1c'><h2 class='d'>"+(year)+today+"</h2>"+parseMd(out)+"</div>"
        }
        var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-1)+today+".md"
        fetch(url)
        .then(res => res.text())
        .then((out) => {
            if (out == "404: Not Found"){
                document.querySelector("#todiary1c").innerHTML += "<div class='dates1c'><h2 class='d'>"+(year-1)+today+"</h2>기록이 없습니다.</div>"
            } else {
                document.querySelector("#todiary1c").innerHTML += "<div class='dates1c'><h2 class='d'>"+(year-1)+today+"</h2>"+parseMd(out)+"</div>"
            }
            var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-2)+today+".md"
            fetch(url)
            .then(res => res.text())
            .then((out) => {
                if (out == "404: Not Found"){
                    document.querySelector("#todiary1c").innerHTML += "<div class='dates1c'><h2 class='d'>"+(year-2)+today+"</h2>기록이 없습니다.</div>"
                } else {
                    document.querySelector("#todiary1c").innerHTML += "<div class='dates1c'><h2 class='d'>"+(year-2)+today+"</h2>"+parseMd(out)+"</div>"
                }
                var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-3)+today+".md"
                fetch(url)
                .then(res => res.text())
                .then((out) => {
                    if (out == "404: Not Found"){
                        document.querySelector("#todiary1c").innerHTML += "<div class='dates1c'><h2 class='d'>"+(year-3)+today+"</h2>기록이 없습니다.</div>"
                    } else {
                        document.querySelector("#todiary1c").innerHTML += "<div class='dates1c'><h2 class='d'>"+(year-3)+today+"</h2>"+parseMd(out)+"</div>"
                    }
                    var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-4)+today+".md"
                    fetch(url)
                    .then(res => res.text())
                    .then((out) => {
                        if (out == "404: Not Found"){
                            document.querySelector("#todiary1c").innerHTML += "<div class='dates1c'><h2 class='d'>"+(year-4)+today+"</h2>기록이 없습니다.</div>"
                        } else {
                            document.querySelector("#todiary1c").innerHTML += "<div class='dates1c'><h2 class='d'>"+(year-4)+today+"</h2>"+parseMd(out)+"</div>"
                        }
                    })
                    .catch(err => { throw err });
                })
                .catch(err => { throw err });
            })
            .catch(err => { throw err });
        })
        .catch(err => { throw err });
    })
    .catch(err => { throw err });

}


}

loadcolorcodes(vw);
loadcontents(vw);
