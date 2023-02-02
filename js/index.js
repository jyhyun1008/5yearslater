let vh = window.innerHeight * 0.01;
let vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// 리사이즈
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
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


function parseMd(md){

    var md0 = md;

    //images with links
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<div class="gallery"><a href="$3"><img src="$2" alt="$1" width="100%" /></a></div>');
    
    //images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" width="100%" />');
    
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
    
    //code
    md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, '<code>$1</code>');

    //br
    md = md.replace(/\n\n/g, '</p><p>');
    
    return md;
}

const year = new Date().getFullYear();
const today = getToday();
const yesterday = getYesterday();
const tomorrow = getTomorrow();
const diary = document.querySelector("#diary")

if (100*vw >= 700) {

var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-4)+today+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector("#diary").innerHTML += "<div class='dates'>"+parseMd(out)+"</div>"
        var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-3)+today+".md"
        fetch(url)
        .then(res => res.text())
        .then((out) => {
            document.querySelector("#diary").innerHTML += "<div class='dates'>"+parseMd(out)+"</div>"
            var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-2)+today+".md"
            fetch(url)
            .then(res => res.text())
            .then((out) => {
                document.querySelector("#diary").innerHTML += "<div class='dates'>"+parseMd(out)+"</div>"
                var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+(year-1)+today+".md"
                fetch(url)
                .then(res => res.text())
                .then((out) => {
                    document.querySelector("#diary").innerHTML += "<div class='dates'>"+parseMd(out)+"</div>"
                    var url = "https://raw.githubusercontent.com/jyhyun1008/5yearslater/main/diary/"+year+today+".md"
                    fetch(url)
                    .then(res => res.text())
                    .then((out) => {
                        document.querySelector("#diary").innerHTML += "<div class='dates'>"+parseMd(out)+"</div>"
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


}
