import { parseString } from "xml2js";

function pFileReader(file) {
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.readAsText(file);
    });
}

class ManoTranslator {
    async initialize() {
        chrome.runtime.getPackageDirectoryEntry(root => {
            root.getFile('scripts/dic.xml', { create: false }, (sample) => {
                sample.file(async file => {
                    const text = await pFileReader(file);

                    parseString(text, (err, result) => {
                        let map = {};
                        result["ArrayOfSerial"]["Serial"].forEach(elm => {
                            map[elm["value"]] = elm["key"];
                        });
                        this.decodeMap = map;
                        console.log(this.decodeMap);
                    });
                });
            }, (sample) => console.log("error"));
        });
    }

    decode(str) {
        let ret = "";
        let seek = 0;
        let howa = "ほわっ";
        let munn = "むんっ";
        let match = "";
        while (seek < str.length) {
            const c = str[seek];
            if (c != howa[0] && c != munn[0]) {
                ret += match;
                match = "";
                ret += c;
                seek++;
                continue;
            }

            if (str.length - seek < 3) {
                ret += str.substring(seek);
                break;
            }

            const s = str.substring(seek, seek + 3);
            if (s != howa && s != munn) {
                ret += match;
                ret += c;
                seek++;
                match = "";
                continue;
            }

            match += s;
            seek += 3;

            if (this.decodeMap[match]) {
                ret += String.fromCharCode(this.decodeMap[match]);
                match = "";
                continue;
            }
        }
        return ret;
    }
}
const translator = new ManoTranslator()
translator.initialize()
export default translator
