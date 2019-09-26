---
title: Type Casting and Inference
---
# Type Casting and Inference

Nim is a statically typed language. As such, each variable has a type associated with it. As seen in the previous example these types are inferred in the `const`, `let` and `var` declarations by the compiler.

```nimrod
# These types are inferred.
var x = 5 # int
var y = "foo" # string

# Assigning a value of a different type will result in a compile-time error.
x = y
```

```console
$ nim c -r typeinference.nim
typeinference.nim(6, 4) Error: type mismatch: got (string) but expected 'int'
```

You may optionally specify the type after a colon (`:`). In some cases the compiler will expect you to explicitly cast types, for which multiple ways are available:

 - type conversion, which is safety checked by the compiler
 - annotating the variable type
 - the `cast` keyword, which is unsafe and should be used only where you know what you are doing, such as in interfacing with C

```nimrod
var x = int(1.0 / 3) # type conversion

var y: seq[int] = @[] # empty seq needs type specification

var z = "Foobar"
proc ffi(foo: ptr array[6, char]) = echo repr(foo)
ffi(cast[ptr array[6, char]](addr z[0]))
```

```console
$ nim c -r typecasting.nim
ref 002C8030 --> ['F', 'o', 'o', 'b', 'a', 'r']
```
