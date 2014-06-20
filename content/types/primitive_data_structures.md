---
title: Primitive Data Structures
---
# Primitive Data Structures

Nimrod contains several basic builtin data structures: sequences, strings, bitsets, and arrays.

## Strings

``` nimrod
echo "words words words ⚑"
echo """
<html>
  <head>
  <head/>\n\n

  <body>
  <body/>
<html/> """

proc re(s: string): string = s

echo r" "" "
echo re"\b[a-z]++\b"
```
``` console
$ nimrod c -r strings.nim
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

There are several things to note about strings:

 - Quoted Strings: Created by wrapping the body in triple quotes, they never interpret escape codes
 - Raw Strings: created by prefixing the string with an `r`. Escape sequences don't work, except for `"`, which can be escaped as `""`
 - Proc Strings: raw strings, but the method name that prefixes the string is called