// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'
function manoTranslateDecode(text) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ name: "manoTranslateDecode", text: text }, function (response) {
            if (response === undefined) {
                reject(chrome.runtime.lastError);
                return;
            }
            resolve(response);
        });
    });
}

function manoTranslateEncode(text) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ name: "manoTranslateEncode", text: text }, function (response) {
            if (response === undefined) {
                reject(chrome.runtime.lastError);
                return;
            }
            resolve(response);
        });
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.name == "textDecode") {
        let current = document.activeElement;
        if (typeof current.value !== typeof 'str') {
            sendResponse({ responseText: "" });
            return;
        }
        manoTranslateDecode(current.value).then((response) => {
            current.value = response;
            sendResponse({ responseText: response });
        });
        return true;
    } else if (request.name == "textEncode") {
        let current = document.activeElement;
        if (typeof current.value !== typeof 'str') {
            sendResponse({ responseText: "" });
            return;
        }
        manoTranslateEncode(current.value).then((response) => {
            current.value = response;
            sendResponse({ responseText: response });
        });
        return true;
    }
    else {
        sendResponse({});
    }
});