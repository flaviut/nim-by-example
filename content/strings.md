---
title: Strings
---
# Strings

``` nimrod
echo "words words words ⚑"
echo """
<html>
  <head>
  </head>\n\n

  <body>
  </body>
</html> """

proc re(s: string): string = s

echo r" "" "
echo re"\b[a-z]++\b"
```
``` console
$ nim c -r strings.nim
words words words ⚑
<html>
  <head>
  <head/>\n\n

  <body>
  <body/>
<html/>
 "
\b[a-z]++\b
```

There are several types of strings literals:

 - Quoted Strings: Created by wrapping the body in triple quotes, they never interpret escape codes
 - Raw Strings: created by prefixing the string with an `r`. There are no escape sequences don't work, except for `"`, which can be escaped as `""`
 - Proc Strings: raw strings, but the method name that prefixes the string is called

## A note about unicode
Unicode symbols are allowed in strings, but are not treated in any special way, so if you want count glyphs or uppercase unicode symbols, you must use the `unicode` module.

Strings are generally considered to be encoded as UTF-8, so because of unicode's backwards compatibility, can be treated exactly as ASCII, with all values above 127 ignored.