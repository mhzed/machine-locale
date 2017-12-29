"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const os = require("os");
let cachedLocal = undefined;
let _fmt = loc => loc.toLowerCase().replace("_", "-");
// cb(err, lang-locale)
function machineLocale() {
    return __awaiter(this, void 0, void 0, function* () {
        if (cachedLocal) {
            return cachedLocal;
        }
        if (/^win/.test(os.platform())) {
            let { stdout, } = yield util_1.promisify(child_process_1.exec)("systeminfo");
            for (let line of stdout.split("\n")) {
                if (/System Locale:/.test(line)) {
                    let m = /System Locale:\s*(\w{2}[-_]\w{2}).*/.exec(line);
                    if (m) {
                        cachedLocal = _fmt(m[1]);
                        return cachedLocal;
                    }
                }
            }
        }
        else {
            let { stdout, } = yield util_1.promisify(child_process_1.exec)("locale | grep LANG=");
            let m = /LANG="?(\w{2}[-_]\w{2}).*"?/.exec(stdout);
            if (m) {
                cachedLocal = _fmt(m[1]);
                return cachedLocal;
            }
        }
        throw new Error("Output parse failed");
    });
}
exports.machineLocale = machineLocale;
;
//# sourceMappingURL=index.js.map