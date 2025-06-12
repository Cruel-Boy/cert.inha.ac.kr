var doneMsg = false;
const _cache = {};
var _speechSynth = window.speechSynthesis;
var _voices = null;
let locale = "ko-KR";
$(document).ready(function() {
    if ($("#lang").val() == "") {
        locale = "ko-KR";
    } else {
        locale = "en-US";
    }
    _voices = _speechSynth.getVoices();
    sayMsgStatus = $.cookie("sayMsgOnOff");
    setSayMsgIcon();

    $(document).on("click", ".exp_icon, #sayMsgIcon", function(event) {
        sayMsg(objectTextToArray($(".active .exp_icon_text")).join("\n"), 0);
    });
});

function sayAlert(msg) {
    sayMsg(msg);
    alert(msg);
}

function sayConform(msg) {
    sayMsg(msg);
    return confirm(msg);
}

function muteMsg() {
    _speechSynth.cancel();
}
$(window).on("beforeunload", function() {
    try {
        _speechSynth.cancel();
    } catch (e) {}
});
/* 목소리를 가져온다 */
function getVoices(locale) {
    if (!_speechSynth) {
        throw new Error('Browser does not support speech synthesis');
    }
    if (_cache[locale]) {
        return _cache[locale];
    }
    _cache[locale] = _voices.filter(voice => voice.lang === locale);
    return _cache[locale];
}
/* TTS 모듈 */
var utterance = new SpeechSynthesisUtterance();
/* 엔터나 컴마를 기준으로 문자을 배열로 저장 */
var sayMsgArr = [];
var sayMsgIdx = 0;
/* TTS 실행(sayMsgArr) */
function speakNextText() {
    if (sayMsgIdx < sayMsgArr.length) {
        let partMsg = sayMsgArr[sayMsgIdx].trim();
        if (partMsg == "") {
            sayMsgIdx++;
            speakNextText();
            return;
        }
        utterance.text = partMsg;
        utterance.onend = speakNextText; // Queue the next utterance
        _speechSynth.speak(utterance);
        sayMsgIdx++;
    }
}
/* 음성서비스 실행 */
function sayMsg(msg, isForce) {
    if (!'speechSynthesis' in window) {
        alert("현재 브라우져는 음성서비스가 지원되지 않습니다.\n크롬을 사용해주시기 바랍니다.");
        return;
    }
    if (navigator.userAgent.indexOf("Safari") > 0 && navigator.userAgent.indexOf("16.6") > 0) {
        let warnSafari = $.cookie("warnSafari");
        if (warnSafari == undefined || warnSafari == 0) {
            alert("현재 버젼의 사파리에서는 정상 음성서비스가 지원되지 않습니다.\n크롬을 사용해주시기 바랍니다.");
            $.cookie("warnSafari", "1", {
                expires: 365
            });
        }
        return;
    }
    muteMsg();
    if (sayMsgStatus == 0 && isForce == 0) {
        // 음성 서비스를 거부한 경우
        return;
    }
    // 괄호안의 문자는 제거
    msg = removeBracketContent(msg);
    // 특수문자를 제거
    msg = removeSpecialCharForSayMsg(msg);
    try {
        const voices = getVoices(locale);
        //  음성 출력 설정 (언어,  음성, 속도 등)
        utterance.lang = locale; // "ko-KR", "en-US"
        if ($("#lang").val() == "") {
            utterance.rate = 1.1; // 목소리 속도
            utterance.pitch = 0.8; // 톤
            utterance.volume = 1; // 볼륨크기
        } else {
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            /*
            			utterance.rate =  0.9;
            			utterance.pitch =  0.7;
            			utterance.volume = 0.7;
            */
        }
        utterance.voiceURI = 'native';
        utterance.voice = voices[0];

        // 기존에 진행중인 TTS는 중단
        _speechSynth.cancel();
        sayMsgIdx = 0;
        sayMsgArr = [];

        // 최대 170자까지 제한에 따라서 170자 이상의 경우는 잘라서 순차적으로 처리한다.
        if (msg.length > 100) {
            sayMsgArr = msg.split(/[\n]/)
            let arrMsgCnt = sayMsgArr.length;
            if (arrMsgCnt > 1) {
                speakNextText();
            } else {
                sayMsgArr = [];
                sayMsgArr.push(msg.substring(0, 160));
                sayMsgArr.push(msg.substring(160, msg.length));
                speakNextText();
            }
        } else {
            utterance.text = msg;
            _speechSynth.speak(utterance);
        }
    } catch (e) {
        console.log(e);
    }
}

function removeSpecialCharForSayMsg(str) {
    var regExp = /[\{\}\[\]\/?;:|)*~`!^\-_+<>@\#$%&\\\=\(\'\"“”※]/gi;
    if (regExp.test(str)) {
        // 특수문자가 있으면  제거
        return str.replace(regExp, "");
    } else {
        // 특수문자가 없으면  원래  문자열 반환
        return str;
    }
}
var sayMsgStatus = 1;

function sayMsgOnOff() {
    if (sayMsgStatus == null || sayMsgStatus == "1") {
        sayMsgStatus = 0;
    } else {
        sayMsgStatus = 1;
    }
    setSayMsgIcon();
    if (sayMsgStatus == 1) {
        if ($("#lang").val() == "") {
            sayMsg("음성안내 기능이 켜졌습니다.", 1);
        } else {
            sayMsg("Voice guidance function is turned on", 1);
        }
    } else {
        if ($("#lang").val() == "") {
            //			sayMsg("음성안내 기능이 꺼졌습니다.", 1);	
        } else {
            //			sayMsg("Voice guidance function is turned off", 1);
        }
        muteMsg();
    }
    $.cookie("sayMsgOnOff", sayMsgStatus, {
        expires: 3650
    });
}

function setSayMsgIcon() {
    if (sayMsgStatus == null || sayMsgStatus == "1") {
        $("#sayMsgOnOffIcon").removeClass("fa-volume-mute").addClass("fa-volume-up").css("color", "#337ab7");
    } else {
        $("#sayMsgOnOffIcon").removeClass("fa-volume-up").addClass("fa-volume-mute").css("color", "#999999");
    }
}

function objectTextToArray(obj) {
    var ret = []
    $(obj).each(function(index, item) {
        ret.push(item.innerText);
    });
    return ret;
}

function objectValToArray(obj) {
    var ret = []
    $(obj).each(function(index, item) {
        ret.push($(item).va());
    });
    return ret;
}

function objectValSum(obj) {
    var ret = 0;
    $(obj).each(function(index, item) {
        console.log($(item));
        ret += $(item).va();
    });
    return ret;
}

function getSelectedCertification() {
    let list = $(".tbl tbody tr");
    let listCnt = list.length;
    var msg = "";
    for (var i = 0; i < listCnt; i++) {
        certName = $(list[i]).find("th").text();
        certKoCnt = $(list[i]).find(".ko").val();
        certEnCnt = $(list[i]).find(".en").val();
        if ($("#lang").val() == "") {
            if (certKoCnt > 0) {
                msg += "국문 " + certName + " " + certKoCnt + "통, ";
            }
            if (certEnCnt > 0) {
                msg += "영문 " + certName + " " + certEnCnt + "통, ";
            }
        } else {
            if (certKoCnt > 0) {
                msg += " and " + certKoCnt + " Korean " + certName + (certKoCnt > 1 ? "s" : "");
            }
            if (certEnCnt > 0) {
                msg += " and " + certEnCnt + " English " + certName + (certEnCnt > 1 ? "s" : "");
            }
        }
    }
    if (msg != "") {
        if ($("#lang").val() == "") {
            msg = msg.substring(0, msg.length - 2) + "을 선택하셨습니다.";
        } else {
            msg = "You selected " + msg.substring(5, msg.length);
        }
    }
    return msg;
}

function checkCert() {
    muteMsg();
    msgText = getCheckedCertification();
    if (msgText != "") {
        sayMsg(msgText, 0);
    }
}

function getCheckedCertification() {
    let list = $(".tbl tbody tr");
    let listCnt = list.length;
    var msg = "";
    for (var i = 0; i < listCnt; i++) {
        certName = $(list[i]).find("th").text();
        certKoCnt = $(list[i]).find(".ko").prop("checked") ? 1 : 0;
        certEnCnt = $(list[i]).find(".en").prop("checked") ? 1 : 0;
        if ($("#lang").val() == "") {
            if (certKoCnt > 0) {
                msg += "국문 " + certName + " " + certKoCnt + "통, ";
            }
            if (certEnCnt > 0) {
                msg += "영문 " + certName + " " + certEnCnt + "통, ";
            }
        } else {
            if (certKoCnt > 0) {
                msg += " and " + certKoCnt + " Korean " + certName + (certKoCnt > 1 ? "s" : "");
            }
            if (certEnCnt > 0) {
                msg += " and " + certEnCnt + " English " + certName + (certEnCnt > 1 ? "s" : "");
            }
        }
    }
    if (msg != "") {
        if ($("#lang").val() == "") {
            msg = msg.substring(0, msg.length - 2) + "을 선택하셨습니다.";
        } else {
            msg = "You selected " + msg.substring(5, msg.length);
        }
    }
    return msg;
}

function getCertificationPayInfo() {
    let list = $(".pay_list");
    let listCnt = list.length;
    var msg = "";
    var certType;
    var certKoMoney = "",
        certEnMoney = "";
    var certKoCnt = 0,
        certEnCnt = 0;
    var sumMoney = 0;
    for (var i = 1; i < listCnt; i++) {
        if (list[i].firstElementChild.className == "ko") {
            certType = "ko";
            certName = $(list[i]).find(".ko").text();
            certKoCnt = $(list[i]).find(".apply").text();
            certKoMoney = $(list[i]).find(".money").text();
        } else {
            certType = "en";
            certName = $(list[i]).find(".en").text();
            certEnCnt = $(list[i]).find(".apply").text();
            certEnMoney = $(list[i]).find(".money").text();
        }
        if ($("#lang").val() == "") {
            if (certType == "ko") {
                msg += "국문 " + certName + " " + certKoCnt + "통, " + certKoMoney + ",";
                sumMoney += Number(certKoMoney.replaceAll(",", "").replace("원", ""));
            }
            if (certType == "en") {
                msg += "영문 " + certName + " " + certEnCnt + "통, " + certEnMoney + ",";
                sumMoney += Number(certEnMoney.replaceAll(",", "").replace("원", ""));
            }
        } else {
            if (certType == "ko") {
                msg += " and " + certKoCnt + " Korean " + certName + (certKoCnt > 1 ? "s" : "") + "," + certKoMoney.replace("KRW", "") + " won,";
                sumMoney += Number(certKoMoney.replaceAll(",", "").replace("KRW", ""));
            }
            if (certType == "en") {
                msg += " and " + certEnCnt + " English " + certName + (certEnCnt > 1 ? "s" : "") + "," + certEnMoney.replace("KRW", "") + " won,";
                sumMoney += Number(certEnMoney.replaceAll(",", "").replace("KRW", ""));
            }
        }
    }
    if (msg != "") {
        if ($("#lang").val() == "") {
            msg = msg.substring(0, msg.length - 1) + (sumMoney > 0 ? ", 전체 " + sumMoney + "원을 결재해야합니다." : "");
        } else {
            msg = "You selected " + msg.substring(5, msg.length) + (sumMoney > 0 ? ". You must pay the total amount of " + sumMoney + " won." : "");
        }
    }
    return msg;
}

function removeBracketContent(str) {
    // 괄호 안의 내용을 제거하는 정규 표현식
    // \((.*?)\) 는 괄호 안의 모든 내용을 찾습니다.
    // .*? 는 괄호 안의 모든 문자를 비게실하게 찾습니다.
    // \1 은 찾은 괄호 안의 내용을 제거하고, 괄호 외부의 내용을 그대로 유지합니다.
    return str.replace(/\((.*?)\)/g, '');
}