---
title: Primitives
---
# Primitives

Nim has several primitive types:

* signed integers: `int8`, `int16`, `int32`, `int64`, and `int`, where `int` is the same size as a pointer
* unsigned integers are similar with `u` prepended to the type
* floating points numbers: `float32`, `float64`, and `float`, where `float` is the processor's fastest type
* characters: `char`, which is basically an alias for uint8

To indicate the size of an integer literal, append `u` or `i` and the size you'd like to the end. However, usually this is not necessary.

Integers can also have `0[xX]`, `0o`, `0[Bb]` prepended to indicate a hex, octal, or binary literal, respectively. Underscores are also valid in literals, and can help with readability.

``` nim
let
  a: int8 = 0x7F # Works
  b: uint8 = 0b1111_1111 # Works
  d = 0xFF # type is int
  c: uint8 = 256 # Gets truncated to 0, 257 will be 1...
```

Precedence rules are the same as in most other languages, but instead of `^`, `&`, `|`, `>>`, `<<`, the `xor`, `and`, `or`, `shr`, `shl` operators are used, respectively.

``` nim
let
  a: int = 2
  b: int = 4
echo 4/2
```
``` console
$ nim c -r numbers2.nim
2.0
```
Another difference that may be surprising is that the `/` operator returns a floating point result, even when the operands are integers.  If integer division is needed, the `div` operator should be used.
