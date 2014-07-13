---
title: Arrays
---

# Arrays

The arrays in Nimrod are like classic C arrays, their size is specified at compile-time and cannot given or changed at runtime.

``` nimrod
type
  ThreeStringAddress = array[3, string]
let names: ThreeStringAddress = ["Jasmine", "Ktisztina", "Kristof"]
let addresses: ThreeStringAddress = ["101 Betburweg", "66 Bellion Drive", "194 Laarderweg"]
```

The size of the array is encoded in its type and cannot be accidentally lost. Therefore, a procedure taking an array of variable length must encode the length in its type parameters.

``` nimrod
proc zip[I, T](a, b: array[I, T]):
               array[I, tuple[a, b: T]] =
  for i in low(A)..high(A):
    result[i] = (a[i], b[i])

let nameAndAddresses = names.zip(addresses)
```

Alternate methods of indexing arrays are also allowed, the first type parameter is actually a range (just a value, as above, is syntactic sugar for `0..N-1`). It's also possible to use ordinal values to index an array, effectively creating a lookup table:

``` nimrod
type
  PartsOfSpeech {.pure.} = enum
    Pronoun, Verb, Article, Adjective, Noun, Adverb
let partOfSpeechExamples: array[PartsOfSpeech] = [
  "he", "reads", "the", "green", "book", "slowly"
]
```

``` nimrod
type
  Matrix[W, H: static[int]] =
    array[1..W, array[1..H, int]]

let mat1: Matrix[2, 2] = [[1, 0],
                          [0, 1]]
let mat2: Matrix[2, 2] = [[0, 1],
                          [1, 0]]

proc `+`[W, H](a, b: Matrix[W, H]):
               Matrix[W, H] =
  for i in 1..high(a):
    for j in 1..high(a[0]):
      result[i][j] = a[i][j] + b[i][j]

proc `$`[W, H](a: Matrix[W, H]): string =
  result = ""
  for v in a:
    for vx in v:
      result.add($vx & ", ")
    result.add("\n")

echo mat1 + mat2
```

``` console
$ nimrod c -r matrix.nim
1, 1, 
1, 1, 

```