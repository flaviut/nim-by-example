---
title: Varargs
---
# Varargs

Standard varargs simply allows you to pass multiple parameters to your function.

``` nim
proc printThings(things: varargs[string]) =
  for thing in things:
    echo thing

printThings "words", "to", "print"
```
```console
$ nim c -r ./varargs1.nim
words
to
print
```

However, trying to run

``` nim
printThings 1, "string", @[1, 2, 3]
```

will fail to compile because the compiler won't coerce anything into strings. Luckily enough, there is a tool to fix this, the coercing varargs:

``` nim
proc printThings(things: varargs[string, `$`]) =
  for thing in things:
    echo thing

printThings "thing 1", 2, @[4, 5, 6]
```

```console
$ nim c -r ./varargs2.nim
thing 1
2
@[4, 5, 6]
```

It works by finding a function `` `$` `` that returns string for each argument type, and applying it to each argument.