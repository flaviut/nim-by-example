---
title: Type casting and inference
---
# Type casting and inference

Nimrod is a statically typed language. As such, each variable has a type associated with it. As seen in the previous example these types are inferred in the `const`, `let` and `var` declarations by the compiler.

```nimrod
# These types are inferred.
var x = 5 # int
var y = "foo" # string

# Assigning a value of a different type will result in a compile-time error.
x = y
```

```console
$ nimrod c -r typeinference.nim
typeinference.nim(6, 4) Error: type mismatch: got (string) but expected 'int'
```

You may optionally specify the type after a colon (`:`). In some cases the compiler will expect you to explicitly cast types though. This can be done in two ways. One is to use "type conversion", this is the safe method, the compiler will ensure that it is safe to convert to that type. The other is to use the `cast` keyword, this is the unsafe method and should only be used when working with hardware or interfacing with C.

```nimrod
var x: int = int(1 / 3) # Type conversion. `/` returns a Float. The `: int` is superfluous.

var y = "Foobar"
proc ffi(foo: ptr array[6, char]) = echo repr(foo)
ffi(cast[ptr array[6, char]](addr y[0]))
```

```console
$ nimrod c -r typecasting.nim
ref 002C8030 --> ['F', 'o', 'o', 'b', 'a', 'r']
```
