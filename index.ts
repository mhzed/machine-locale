
import { exec } from "child_process";
import { promisify } from "util";
import * as os from "os";

let cachedLocal = undefined;

let _fmt = loc => loc.toLowerCase().replace("_", "-");

// cb(err, lang-locale)
export async function machineLocale(): Promise<string> {
  if (cachedLocal) {
    return cachedLocal
  }
  if (/^win/.test(os.platform())) { // windows style
    let {stdout, } = await promisify(exec)("systeminfo")
    for (let line of stdout.split("\n")) {
      if (/System Locale:/.test(line)) {
        let m = /System Locale:\s*(\w{2}[-_]\w{2}).*/.exec(line);
        if (m) {
          cachedLocal = _fmt(m[1])
          return cachedLocal;
        }
      }
    }
  } else {  // unix style
    let {stdout, } = await promisify(exec)("locale | grep LANG=")
      let m = /LANG="?(\w{2}[-_]\w{2}).*"?/.exec(stdout);
      if (m) {
        cachedLocal = _fmt(m[1])
        return cachedLocal;
      }
  }
  throw new Error("Output parse failed")
};


