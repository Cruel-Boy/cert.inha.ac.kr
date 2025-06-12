$(document).ready(function() {
    var a = navigator.userAgent;
    if (!/mobile/i.test(a) ||
        !/android|iphone|ipad|ipod/i.test(a) ||
        !/inapp|KAKAOTALK|NAVER|Line\/|FB_IAB\/FB4A|FBAN\/FBIOS|Instagram|DaumDevice\/mobile|everytimeApp\/[^1]/i.test(a)) {} else {
        location.href = "https://m2license.icerti.com/index.jsp";
    }
});