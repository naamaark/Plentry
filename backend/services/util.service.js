

function randomNoRepeats(array) {
    var copy = array.slice(0);
    return function () {
        if (copy.length < 1) { copy = array.slice(0); }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        return item;
    };
}

function makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function pickRandomColor() {
    const colors = ['#FFAEBC', '#8585EC', '#A0E7E5', '#B4F8C8', '#FBE7C6', '#E67272', '#ECD282', '#6BC6EE', '#F09574', '#F7EA7B', '#c5f78c', '#ddf0a8'];
    // const colors = ['#27856a', '#8d67ab', '#e8115b', '#1e3264', '#477d95', '#af2896', '#503750', '#6BC6EE', '#148a08', '#ba5d07', '#ffc864', '#e13300', '#509bf5', '#907255', '#f59b23'];

    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}


function getTime(date) {
    const time = new Date(date)
    const createdAt = time.getDate() + '/' + (time.getMonth() + 1) + '/' + time.getFullYear()

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) return createdAt
    interval = Math.floor(seconds / 2592000);
    if (interval === 1) return interval + " month ago";
    if (interval > 1) return createdAt

    interval = Math.floor(seconds / 86400);
    if (interval === 1) return interval + " day ago";
    if (interval > 1) return interval + " days ago";

    interval = Math.floor(seconds / 3600);
    if (interval === 1) return interval + " hour ago";
    if (interval > 1) return interval + " hours ago";

    interval = Math.floor(seconds / 60);
    if (interval === 1) return interval + " minute ago";
    if (interval > 1) return interval + " minutes ago";


    return 'just now';
}

module.exports = {
    makeId,
    getRandomIntInclusive,
    getTime,
    randomNoRepeats,
    pickRandomColor
}

