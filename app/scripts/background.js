// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'
import manoTranslate from './mano_translate';

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

chrome.contextMenus.create({
  title: "ほわっむんっ",
  contexts: ["selection"],
  onclick: (info, tabs) => {
    let decodedText = manoTranslate.decode(info.selectionText);
    alert(decodedText);
  }
});

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.name === "manoTranslateDecode") {
      sendResponse(manoTranslate.decode(request.text));
    } else if (request.name === "manoTranslateEncode") {
      sendResponse(manoTranslate.encode(request.text));
    } else {
      sendMessage({});
    }
  }
);

function createEditTextContextMenu(name) {
  chrome.contextMenus.create({
    title: name,
    contexts: ["editable"],
    onclick: (info, tabs) => {
      var queryInfo = {
        active: true,
        windowId: chrome.windows.WINDOW_ID_CURRENT
      };

      chrome.tabs.query(queryInfo, function (result) {
        let tab = result.shift();
        chrome.tabs.sendMessage(tab.id, { name: "text" + name }, function (response) {
          if (response === undefined) {
            console.log(chrome.runtime.lastError);
            return;
          }
        });
      });
    }
  });
}

createEditTextContextMenu("Encode");
createEditTextContextMenu("Decode");