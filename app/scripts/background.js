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
