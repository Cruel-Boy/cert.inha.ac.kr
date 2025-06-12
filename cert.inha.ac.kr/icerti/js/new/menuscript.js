$('ul li:has(ul)').addClass('has-submenu');
$('ul li ul').addClass('sub-menu');
$('ul.dropdown li').hover(function() {
    $(this).addClass('hover');
}, function() {
    $(this).removeClass('hover');
});
var $menu = $('#menu'),
    $menulink = $('#spinner-form'),
    $search = $('#search'),
    $search_box = $('.search_box'),
    $menuTrigger = $('.has-submenu > a');
$menulink.click(function(e) {
    $menulink.toggleClass('active');
    $menu.toggleClass('active');
    if ($search.hasClass('active')) {
        $('.menu.active').css('padding-top', '50px');
    }
});
$search.click(function(e) {
    e.preventDefault();
    $search_box.toggleClass('active');
});
$menuTrigger.click(function(e) {
    e.preventDefault();
    var t = $(this);
    t.toggleClass('active').next('ul').toggleClass('active');
});
$('ul li:has(ul)');
$(function() {
    var e = $(document).scrollTop();
    var t = $('.nav_wrapper').outerHeight();
    $(window).scroll(function() {
        var n = $(document).scrollTop();
        if ($(document).scrollTop() >= 50) {
            $('.nav_wrapper').css('position', 'relative;');
        } else {
            $('.nav_wrapper').css('position', 'relative;');
        }
        if (n > t) {
            $('.nav_wrapper').addClass('scroll');
        } else {
            $('.nav_wrapper').removeClass('scroll');
        }
        if (n > e) {
            $('.nav_wrapper').removeClass('no-scroll');
        } else {
            $('.nav_wrapper').addClass('no-scroll');
        }
        e = $(document).scrollTop();
    });

    try {
        $('#main_slider .slide').bxSlider({
            mode: 'horizontal', // 가로 방향 수평 슬라이드
            speed: 500, // 이동 속도를 설정
            pager: false, // 현재 위치 페이징 표시 여부 설정
            auto: true, // 자동 실행 여부
            autoHover: true, // 마우스 호버시 정지 여부
            controls: true // 이전 다음 버튼 노출 여부
        });
    } catch (e) {}

    $('ul.choice_tabs li').click(function() {
        var tab_id = $(this).attr('data-tab');

        $('ul.choice_tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });

    //tab 탭스크립트
    $('ul.tabs li').click(function() {
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });


    //faq
    var $faqBtn = $('.faq_list dl dt'),
        faqSpd = '250',
        faqAni = 'easeInOutExpo';
    $faqBtn.on('click', function(event) {
        muteMsg();
        var $this = $(this),
            $faqA = $this.next('dd');
        $faqParent = $this.parents('dl');
        if ($faqA.is(':hidden')) {
            $faqA.slideDown(faqSpd, faqAni);
            $faqParent.addClass('active').siblings().removeClass('active');
            $faqParent.siblings().removeClass('active').find('dd').not(':hidden').slideUp(faqSpd, faqAni);

            let clickObj = event.target;
            if (clickObj != null && clickObj.className.indexOf("sayQIcon") >= 0) {
                if (!doneMsg) {
                    let obj = event.target.parentNode.parentNode.parentNode;
                    let msg = objectTextToArray($(obj).find(".msgtext")).join("\n");
                    sayMsg(msg, 0);
                }
                //			return;
            }
        } else {
            $faqA.slideUp(faqSpd, faqAni);
            $faqParent.removeClass('active')
        }
    });

    //lang change
    $("#lang").on('change', function() {
        setCookieLang('clientlanguage', $(this).val(), 365);
    });
    if (document.cookie == "") {
        // 한국어 사이트가 우선
        setCookieLang('clientlanguage', '', 365);
    }
    $("#lang").val($.cookie('clientlanguage'));
});

function setCookieLang(cName, cValue, cDay) {
    $.removeCookie(cName);
    $.cookie(cName, cValue, {
        expires: 365,
        path: "/"
    });
    if (location.href.indexOf("/cert/certificateInfo.cert") > 0) {
        location.reload(true);
        //    history.go(-1);
    } else {
        location.reload(true);
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    var c;
    for (var i = 0; i < ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
var timeCount = 30 * 60; // 타이머 시작시의 시간
/* 타이머를 시작하는 함수 */
var timerID = setInterval("decrementTime()", 1000);
/* 세션이 필요없는 페이지에서 세션체크 동작을 중지시킴 */
function timerClear() {
    clearInterval(timerID);
    document.getElementById("nowTimes").innerHTML = "";
    $("#nowTimes").hide();
}
// 세션 연장
function resetTimer() {
    timeCount = 30 * 60;
    $("#checkSession").attr("src", "/icerti/check.jsp?type=1");
    $("#nowTimes").show();
}
/* 타이머 감소*/
function decrementTime() {
    var lang = $("#lang").val();
    var x1 = document.getElementById("nowTimes");
    if (x1 == null || x1 == undefined) {
        return;
    }
    if (lang == "") {
        x1.innerHTML = "로그아웃 : " + toHourMinSec(timeCount, lang) +
            "<a href='javascript:resetTimer()' style='font-weight:bold'>[연장]</a>";
    } else {
        x1.innerHTML = "Logout : " + toHourMinSec(timeCount, lang) +
            "<a href='javascript:resetTimer()' style='font-weight:bold'>[Extend]</a>";
    }
    if (timeCount < 60) {
        $("#nowTimes").css("color", "red");
    } else {
        $("#nowTimes").css("color", "blue");
    }
    if (timeCount > 0) timeCount--;
    else {
        // 시간이 0이 되었으므로 타이머를 중지함
        clearInterval(timerID);
        // 시간이 만료되고 나서 할 작업을 여기에 작성
        if (parent.document.domain == "cert.icerti.com") {
            location.href = "/icerti/auth/login.lgn?cmd=loginForm"
        } else if (top.document.domain == "cert.icerti.com") {
            parent.location.href = "/icerti/auth/login.lgn?cmd=loginForm"
        } else {
            top.location.href = "/icerti/auth/login.lgn?cmd=loginForm"
        }
    }
}
/* 정수형 숫자(초 단위)를 "시:분:초" 형태로 표현하는 함수 */
function toHourMinSec(t, lang) {
    var hour = Math.floor(t / 3600);
    // 정수로부터 남은 시, 분, 초 단위 계산
    var min = Math.floor((t - (hour * 3600)) / 60);
    var sec = t - (hour * 3600) - (min * 60);
    // hh:mm:ss 형태를 유지하기 위해 한자리 수일 때 0 추가
    //	if(hour < 10) hour = "0" + hour;
    //	if(min < 10) min = "0" + min;
    //	if(sec < 10) sec = "0" + sec;
    if (lang == "") {
        return (min + "분 " + sec + "초");
    } else {
        return (min + "Min " + sec + "Sec");
    }
}
var zoomValue = 100;
//화면확대
function zoomIn() {
    zoomValue += 10;
    if (zoomValue > 200) {
        zoomValue = 200;
        alert("더 이상 확대할 수 없습니다.");
    }
    //	console.log(zoomValue);
    $.cookie('zoom', zoomValue);
    document.body.style.zoom = zoomValue + "%";
}

function zoomOut() { // 화면크기축소
    zoomValue -= 10;
    if (zoomValue < 50) {
        zoomValue = 50;
        alert("더 이상 축소할 수 없습니다.");
    }
    //	console.log(zoomValue);
    $.cookie('zoom', zoomValue);
    document.body.style.zoom = zoomValue + "%";
}

function initZoom() {
    zoomValue = 100;
    $.cookie('zoom', 100);
    document.body.style.zoom = "100%";
}

function isMobile() {
    var mobileCookie = $.cookie("isMobile");
    var filterWin = "win16|win32|win64";
    var filterMac = "mac|macintel";
    var agent = navigator.userAgent.toLowerCase();
    if (navigator.platform && filterWin.indexOf(navigator.platform.toLowerCase()) >= 0) {
        return false;
    } else {
        if (mobileCookie != undefined && mobileCookie == "1") {
            return true;
        }
        if (navigator.platform && filterMac.indexOf(navigator.platform.toLowerCase()) >= 0) {
            if (navigator.maxTouchPoints > 0 && (mobileCookie == undefined || mobileCookie == "1")) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    }
}
$(document).ready(function() {
    if (!isMobile()) {
        try {
            var cValue = $.cookie('zoom');
            zoomValue = cValue == undefined ? 100 : parseInt(cValue);
            $.cookie('zoom', zoomValue);
            document.body.style.zoom = zoomValue + "%";
        } catch (e) {

        }
    }
})