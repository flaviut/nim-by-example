---
title: Numbers
---
# Numbers

Nimrod has several primitive types:

* signed integers: `int8`, `int16`, `int32`, `int64`, and `int`, where `int` is the same size as a pointer
* unsigned integers are similar with `u` prepended to the type
* floating points numbers: `float32`, `float64`, and `float`, where `float` is the processor's fastest type

To indicate the size of an integer literal, append `u` or `i` and the size you'd like to the end. However, this is not typically necessary.

Integers can also have `0[xX]`, `0o`, `0[Bb]` prepended to indicate a hex, octal, or binary literal, respectively. Underscores are also valid in literals, and can help with readability.

``` nimrod
let
  a: int8 = 0x7F # Works
  b: uint8 = 0x1111_1111 # Works
  d = 0xFF # type is int
  c: uint8 = 256 # Compile time error
```

Precedence rules are the same as most other languages, but instead of `^`, `&`, `|`, `>>`, `<<`, the `xor`, `and`, `or`, `shr`, `shl` operators are used, respectively.

Another difference that may be surprising is that the `/` operator returns a floating point result, even when the operands are integers. This means that `3/2` will return something like `0.33`. If integer division is needed, the `div` operator should be used.