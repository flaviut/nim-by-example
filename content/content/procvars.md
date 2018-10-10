---
title: First Class Functions
---

# First Class Functions

Nim supports closures as well as passing functions. Two different syntaxes available for closures:

- proc syntax, which is identical to regular procedure syntax
- "do notation", which is a bit shorter

``` nimrod
import sequtils

let powersOfTwo = @[1, 2, 4, 8, 16, 32, 64, 128, 256]

echo(powersOfTwo.filter do (x: int) -> bool: x > 32)
echo powersOfTwo.filter(proc (x: int): bool = x > 32)

proc greaterThan32(x: int): bool = x > 32
echo powersOfTwo.filter(greaterThan32)
```
``` console
$ nim c -r filterclosure.nim
@[64, 128, 256]
@[64, 128, 256]
```

The stdlib also makes a [third option available by using macros][lib-sugar]:

[lib-sugar]: https://nim-lang.org/docs/sugar.html

``` nimrod
import sugar

# sugar provides a "->" macro that simplifies writing type
# declarations, e.x. (char) -> char
proc map(str: string, fun: (char) -> char): string =
  for c in str:
    result &= fun(c)

# sugar also provides a "=>" macro for the actual lambda
# value
echo "foo".map((c) => char(ord(c) + 1))
# the following code is exactly equvilent:
echo "foo".map(proc (c: char): char = char(ord(c) + 1))
```
``` console
$ nim c -r sugarlambda.nim
gpp
gpp
```
