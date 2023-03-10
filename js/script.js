let comments = [];

//loadComments();

document.getElementById("comment_add").onclick = function (event) {
    event.preventDefault();

    const error = document.getElementById("error");
    let commentName = document.getElementById("input_name").value;
    let commentBody = document.getElementById("input_comment").value;
    let commentData = document.getElementById("input_date").valueAsDate;

    error.innerText = "";

    let messages = [];
    if (commentName ===""){
        messages.push('вы не ввели имя');
    }
    if (commentBody ===""){
        messages.push('вы пытаетесь отправить пустой комментарий');
    }
    if(messages.length > 0) {
        error.innerText = messages.join("\n ");
        return false;
    }

    if (commentData === null) {
        commentData = Date.now();
    }
    const uid = function(){
        return Date.now().toString(36) + Math.random().toString(16).slice(2);
    }
    let comment = {
        id: uid(),
        name: commentName,
        body: commentBody,
        time: Math.floor(commentData/1000),
        like: '/img/no_like.png'
    }

    console.log(comment); //-----------------------

    commentName.value = '';
    commentBody.value = '';
    comments.push(comment);

    getComments();
    showComments();
}

function getComments() {
    localStorage.setItem("comments", JSON.stringify(comments));
}

function loadComments(){
    if (localStorage.getItem('comments'))
        comments = JSON.parse(localStorage.getItem('comments'));
    showComments();
}

function createDivWithClassName(children, className) {
    const div = document.createElement('div');
    div.classList.add(className);

    if (Array.isArray(children)) {
        children.forEach((child) => {
            div.append(child);
        });
    } else {
        div.append(children)
    }
    return div;
}

function createLikeButton() {
    const like = './img/icon-like.png';
    const no_like = './img/no_like.png';
    const img = document.createElement('img');
    img.alt = '';
    img.src = no_like;

    const btn = document.createElement('button');
    btn.classList.add('like');
    btn.append(img);

    btn.onclick = () => {
        if (img.src.match(no_like)){
            img.src = like
        } else img.src = no_like;
    };

    return btn;
}

function findParentByClassName(className, child) {
    const parent = child.parentElement;

    if (parent === null || parent.classList.contains(className)) {
        return parent;
    }
    return findParentByClassName(className, parent);
}

function createDeleteButton() {
    const img = document.createElement('img');
    img.alt = '';
    img.src = './img/icon_del.png';

    const btn = document.createElement('button');
    btn.classList.add('icon_del');
    btn.append(img);

    btn.onclick = () => {
        const container = findParentByClassName('container', btn);
        container.remove();
    };
    return btn;
}

function createButtonsGroup() {
    const likeButton = createDivWithClassName(createLikeButton(), 'button_column');
    const deleteButton = createDivWithClassName(createDeleteButton(), 'button_column');
    return createDivWithClassName([likeButton, deleteButton], 'buttons_group');
}


function showComments() {
    const commentsField = document.getElementById("comments_field");
    commentsField.innerHTML = '';
    comments.forEach(function (item) {
        const outputDateName = createDivWithClassName(`${timeConverter(item.time)} \n ${item.name}`, 'output_date_name');
        const outputBody = createDivWithClassName(item.body, 'output_body');
        const buttonsGroup = createButtonsGroup();

        const container =  createDivWithClassName([outputDateName, outputBody, buttonsGroup], 'container');
        commentsField.append(container);
    })
}
function timeConverter(time){
    let a = new Date(time * 1000);
    let today = new Date();
    let months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let todayOrTomorrow = '';
    if (date === today.getDate() && a.getMonth() === today.getMonth() && year === today.getFullYear()){
        todayOrTomorrow = "Сегодня, ";
    }
    if (isYesterday(a)){
        todayOrTomorrow = "Вчера, ";
    }
    return todayOrTomorrow + date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
}
function isYesterday (date) {
const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
}