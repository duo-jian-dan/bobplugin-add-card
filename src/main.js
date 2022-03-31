var ADD_CARD_URL = "https://djd-api.eleduck.com/study/open/entries";

var languageList = [
    ['auto', 'auto'],
    ['zh-Hans', 'zh-CN'],
    ['zh-Hant', 'zh-TW'],
    ['en', 'en'],
    ['yue', 'zh'],
    ['wyw', 'zh'],
    ['en', 'en'],
    ['ja', 'ja'],
    ['ko', 'ko'],
    ['fr', 'fr'],
    ['de', 'de'],
    ['es', 'es'],
    ['it', 'it'],
    ['ru', 'ru'],
    ['pt', 'pt'],
    ['nl', 'nl'],
    ['pl', 'pl'],
    ['ar', 'ar'],
    ['af', 'af'],
    ['am', 'am'],
    ['az', 'az'],
    ['be', 'be'],
    ['bg', 'bg'],
    ['bn', 'bn'],
    ['bs', 'bs'],
    ['ca', 'ca'],
    ['ceb', 'ceb'],
    ['co', 'co'],
    ['cs', 'cs'],
    ['cy', 'cy'],
    ['da', 'da'],
    ['el', 'el'],
    ['eo', 'eo'],
    ['et', 'et'],
    ['eu', 'eu'],
    ['fa', 'fa'],
    ['fi', 'fi'],
    ['fj', 'fj'],
    ['fy', 'fy'],
    ['ga', 'ga'],
    ['gd', 'gd'],
    ['gl', 'gl'],
    ['gu', 'gu'],
    ['ha', 'ha'],
    ['haw', 'haw'],
    ['he', 'he'],
    ['hi', 'hi'],
    ['hmn', 'hmn'],
    ['hr', 'hr'],
    ['ht', 'ht'],
    ['hu', 'hu'],
    ['hy', 'hy'],
    ['id', 'id'],
    ['ig', 'ig'],
    ['is', 'is'],
    ['jw', 'jw'],
    ['ka', 'ka'],
    ['kk', 'kk'],
    ['km', 'km'],
    ['kn', 'kn'],
    ['ku', 'ku'],
    ['ky', 'ky'],
    ['la', 'lo'],
    ['lb', 'lb'],
    ['lo', 'lo'],
    ['lt', 'lt'],
    ['lv', 'lv'],
    ['mg', 'mg'],
    ['mi', 'mi'],
    ['mk', 'mk'],
    ['ml', 'ml'],
    ['mn', 'mn'],
    ['mr', 'mr'],
    ['ms', 'ms'],
    ['mt', 'mt'],
    ['my', 'my'],
    ['ne', 'ne'],
    ['no', 'no'],
    ['ny', 'ny'],
    ['or', 'or'],
    ['pa', 'pa'],
    ['ps', 'ps'],
    ['ro', 'ro'],
    ['rw', 'rw'],
    ['si', 'si'],
    ['sk', 'sk'],
    ['sl', 'sl'],
    ['sm', 'sm'],
    ['sn', 'sn'],
    ['so', 'so'],
    ['sq', 'sq'],
    ['sr', 'sr'],
    ['sr-Cyrl', 'sr'],
    ['sr-Latn', 'sr'],
    ['st', 'st'],
    ['su', 'su'],
    ['sv', 'sv'],
    ['sw', 'sw'],
    ['ta', 'ta'],
    ['te', 'te'],
    ['tg', 'tg'],
    ['th', 'th'],
    ['tk', 'tk'],
    ['tl', 'tl'],
    ['tr', 'tr'],
    ['tt', 'tt'],
    ['ug', 'ug'],
    ['uk', 'uk'],
    ['ur', 'ur'],
    ['uz', 'uz'],
    ['vi', 'vi'],
    ['xh', 'xh'],
    ['yi', 'yi'],
    ['yo', 'yo'],
    ['zu', 'zu'],
  ];

function buildResult(res) {
    var result = {
        "from": "en",
        "to": "zh-Hans",
        "fromParagraphs": [
            "add card success"
        ],
        "toParagraphs": [res]
    }
    return result;
}

function buildError(res) {
    var result = {
        'type': 'param',
        'message': res,
        'addtion': '无'
    }
    return result;
}

// override
function supportLanguages() {
    return languageList.map(([standardLang]) => standardLang);
}

// override
function translate(query, completion) {
    var text = query.text;
    // var fromLanguage = query.detectFrom;
    var addFlag = $option.addFlag;
    var splitFlag = $option.splitFlag;
    var token = $option.token;

    if (!token) {
        completion({'error': buildError('「Token」缺失')});
        return;
    }

    if (addFlag && !text.endsWith(addFlag)) {
        completion({'result': buildResult("未检测到添加标志："+addFlag)});
        return;
    }

    var front = text.replace(addFlag, '')
    var back = ''
    if (splitFlag) {
        let textArr = front.split(splitFlag)
        front = textArr[0]
        back = textArr[1] || ''
    }

    addCard(front, back, completion);
}

function addCard(front, back, completion) {
    var token = $option.token;
    var bookName = $option.bookName;

    $http.post({
        url: ADD_CARD_URL,
        header: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
        body: {
            front,
            back,
            "book_name" : bookName,
        },
        handler: function (res) {
            var data = res.data;
            var response = res.response;
            var statusCode = response.statusCode;
            if (statusCode === 200) {
                if (data.code === 200) {
                    completion({'result': buildResult(data.data)});
                } else {
                    completion({'error': buildError('卡片添加失败：'+data.message)});
                }
            } else {
                completion({'error': buildError('卡片添加失败：'+statusCode)});
            }
        }
    });
}
