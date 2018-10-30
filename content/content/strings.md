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

echo r".""."
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
.".
\b[a-z]++\b
```

There are several types of string literals:

 - Quoted Strings: Created by wrapping the body in triple quotes, they never interpret escape codes
 - Raw Strings: created by prefixing the string with an `r`. They do not interpret escape sequences, except for `""`, which is interpreted as `"`. This means that `r"\b[a-z]\b"` is interpreted as `\b[a-z]\b` instead of failing to compile with a syntax error.
 - Proc Strings: raw strings, but the method name that prefixes the string is called, so that `foo"12\"` -> `foo(r"12\")`.

Strings are null-terminated, so that `cstring("foo")` requires zero copying. However, you should be careful that the lifetime of the cstring does not exceed the lifetime of the string it is based upon.

Strings can also almost be thought of as `seq[char]` with respect to assignment semantics. See [seqs][]

[seqs]: /seqs/#immutability

The `strutils` module provides procs for handling strings.

``` nimrod
import strutils

var a = "hello welcome,friend"

# The split proc takes a sequence of characters and splits a string based on them
echo a.split({' ', ','})

# The contains proc determines whether a string contains a substring or character
echo a.contains("hello")

```

``` console
$ nim c -r strutils.nim
@["hello", "welcome", "friend"]
true
```

## A note about Unicode
Unicode symbols are allowed in strings, but are not treated in any special way, so if you want count glyphs or uppercase Unicode symbols, you must use the `unicode` module.

Strings are generally considered to be encoded as UTF-8, so because of Unicode's backwards compatibility, can be treated exactly as ASCII, with all values above 127 ignored.
