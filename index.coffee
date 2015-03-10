
{exec}  = require("child_process")
os      = require("os")

locale = undefined

# cb(err, lang-locale)
module.exports = (cb)->

  if locale then return setImmediate ()->cb(locale)
  platFormSpecific = {
    'win32'  : winLocale,
    'win64'  : winLocale,
  }
  platformGetLocale = platFormSpecific[os.platform()]
  if platformGetLocale
    platformGetLocale (err, _ret)->
      cb(err, locale = _ret)
  else
    nixLocale (err, _ret)->
      cb(err, locale = _ret)

_fmt = (loc)->
  loc.toLowerCase().replace("_", "-")

nixLocale = (cb)->
  exec "locale | grep LANG=", (err, stdout, stderr)->
    if err then return cb(err)
    m = /LANG="?(\w{2}[-_]\w{2}).*"?/.exec stdout
    if m then cb(null, _fmt(m[1]))
    else cb(new Error("Output parse failed"))

winLocale = (cb)->
  exec "systeminfo", (err, stdout, stderr)->
    if err then return cb(err)
    for line in stdout.split("\n") when /System Locale:/.test(line)
      m = /System Locale:\s*(\w{2}[-_]\w{2}).*/.exec line
      if m then cb(null, _fmt(m[1]))
      else cb(new Error("Output parse failed"))
      return
    cb(new Error("Output parse failed"))

if require.main == module
  module.exports (err, loc)->
    if err then console.log err
    else console.log loc