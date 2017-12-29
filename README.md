machine-locale
--------

Get OS's default locale language code.

The returned locale language code is normalized to the format "ll-cc":

1. all lower cases
2. _ is replaced with -
3. ll is language code, cc is country code

## Install

npm install machine-locale


## Example

    require("machine-locale")(function(err, locale) {
      console.log(locale)
    })

## Caveat

In windows, first run will take quite a while, due to the slowness of "systeminfo" command.