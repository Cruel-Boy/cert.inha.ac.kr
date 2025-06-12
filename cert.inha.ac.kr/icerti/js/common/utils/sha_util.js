let hashVal = "";
var langType = $("#lang").val();

function checkFile() {
    if (hashVal == "") {
        if (langType == "en") {
            sayAlert("First select the PDF file you want to verify.");
        } else {
            sayAlert("검증할 PDF파일을 우선 선택하세요.");
        }
        $("#orgfile").css("color", "red")
        return;
    }
    if ($("#fileissuedNum1").val() == "" || $("#fileissuedNum2").val() == "" || $("#fileissuedNum3").val() == "" || $("#fileissuedNum4").val() == "") {
        if (langType == "en") {
            sayAlert("Please enter the original issued number.");
        } else {
            sayAlert("원본번호를 입력하세요.");
        }
        return;
    }

    let docNumber = $("#fileissuedNum1").val() + "-" + $("#fileissuedNum2").val() + "-" + $("#fileissuedNum3").val() + "-" + $("#fileissuedNum4").val();

    if (hashVal == "") {
        if (langType == "en") {
            sayAlert("Please upload the original PDF file first.");
        } else {
            sayAlert("원본 PDF 파일을 우선 업로드하세요.");
        }
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/icerti/cert/issued.cert?cmd=checkHashValue",
        data: {
            "issuedNum": docNumber,
            "hashVal": hashVal
        },
        success: function(data) {
            if (data == "error_param") {
                if (langType == "en") {
                    sayAlert("There is an error in the parameter.\nPlease refresh and try again.");
                } else {
                    sayAlert("파라메터에 오류가 있습니다.\n새로고침하고 다시 시도해주세요.");
                }
                return;
            } else if (data == "error_not_original") {
                if (langType == "en") {
                    sayAlert("This is not the original PDF file issued by the certificate issuance system.");
                } else {
                    sayAlert("증명발급시스템에서 발급된 원본 PDF 파일이 아닙니다.");
                }
                return;
            } else if (data == "error_exception") {
                if (langType == "en") {
                    sayAlert("An exception occurred.\nPlease try again later.");
                } else {
                    sayAlert("예외상황이 발생했습니다.\n잠시후에 다시 한번 시도해보세요.");
                }
                return;
            } else if (data == "error_not_exist") {
                if (langType == "en") {
                    sayAlert("This is when the original search period has passed or the document does not exist on the server.");
                } else {
                    sayAlert("원본조회 기간이 지났거나 해당문서가 증명발급시스템에 존재하지 않는 경우입니다.");
                }
                return;
            } else if (data == "error_empty_hash") {
                if (langType == "en") {
                    sayAlert("The original file comparison function through PDF files is a recent feature, so it cannot be checked with previously issued files.\nPlease use the check original content function above.");
                } else {
                    sayAlert("PDF 파일을 통한 원본파일 비교 기능은 최근 기능이라서 이전에 발급받은 파일로는 확인이 불가능합니다.\n위에 있는 원본내용 확인 기능을 이용해주세요.");
                }
                return;
            }
            if (langType == "en") {
                sayAlert("It is the same as the original document issued by the certificate issuance system.");
            } else {
                sayAlert("증명발급시스템에서 발급된 원본문서와 동일합니다.");
            }
        },
        error: function(xhr, status, error) {
            errorMsg(xhr, status, error);
        }
    });
}
// 업로드 파일의 hash값 추출(서버에 저장된 원본파일의 hash값과 비교 목적)
function hashfile(fileselector) {
    let filename = fileselector.files[0].name;
    if (filename.indexOf(".pdf") < 0) {
        if (langType == "en") {
            sayAlert("Verification of the original document is only possible with PDF files officially issued by the certificate issuance system.");
        } else {
            sayAlert("원본문서 여부 검증은 증명발급시스템에서 정식 발급된 PDF 파일만 가능합니다.");
        }
        return;
    }
    var checkCnt = 0;
    filename = filename.replace(".pdf", "");
    let docnum = filename.split("-");
    if (docnum.length == 4) {
        for (var i = 1; i <= 4; i++) {
            if (i == 1 || i == 3) {
                if (docnum[i - 1].length == 4) {
                    $("#fileissuedNum" + i).val(docnum[i - 1]);
                    checkCnt++;
                }
            } else if (i == 2 || i == 4) {
                if (docnum[i - 1].length == 5) {
                    $("#fileissuedNum" + i).val(docnum[i - 1]);
                    checkCnt++;
                }
            }
        }
    }
    $("#orgfile").css("color", "black");
    readbinaryfile(fileselector.files[0])
        .then(function(result) {
            result = new Uint8Array(result);
            return window.crypto.subtle.digest('SHA-512', result);
        }).then(function(result) {
            result = new Uint8Array(result);
            hashVal = Uint8ArrayToHexString(result);
            if (checkCnt == 4) {
                checkFile();
            }
        });
}

function readbinaryfile(file) {
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result)
        };
        fr.readAsArrayBuffer(file);
    });
}

function Uint8ArrayToHexString(ui8array) {
    var hexstring = '',
        h;
    for (var i = 0; i < ui8array.length; i++) {
        h = ui8array[i].toString(16);
        if (h.length == 1) {
            h = '0' + h;
        }
        hexstring += h;
    }
    var p = Math.pow(2, Math.ceil(Math.log2(hexstring.length)));
    hexstring = hexstring.padStart(p, '0');
    return hexstring;
}