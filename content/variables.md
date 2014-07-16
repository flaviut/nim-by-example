---
title: Variables
---
# Variables

Nimrod supports three different types of variables, `let`, `var`, and `const`. As with most things, multiple variables can be declared in the same section.

``` nimrod
proc getAlphabet(): string =
  result = ""
  for letter in 'a'..'z':
    result.add(letter)

# Computed at compilation time
const alphabet = getAlphabet()

# Mutable variables
var
  a = "foo"
  b = 0
  # Works fine, initialized to 0
  c: int

# Immutable variables
let
  d = "foo"
  e = 5
  # Compile-time error, must be initialized at creation
  f: float

# Works fine, `a` is mutable
a.add("bar")
b += 1
c = 3

# Compile-time error, const cannot be modified at run-time
alphabet = "abc"

# Compile-time error, `d` and `e` are immutable
d.add("bar")
e += 1
```

``` console
$ nimrod c --verbosity:2 ./variables.nim
variables.nim(18, 2) Error: 'let' symbol requires an initialization
    e: float
    ^
```

Without `--verbosity:2` only the error will be shown without the position cursor.

## Const
A `const` variable's value will be evaluated at compile-time, so if you inspect the C sources, you'll see the following line:

``` c
STRING_LITERAL(TMP129, "abcdefghijklmnopqrstuvwxyz", 26);
```

The only limitation with const is that compile-time evaluation cannot interface with C because there is no compile-time foreign function interface at this time.
