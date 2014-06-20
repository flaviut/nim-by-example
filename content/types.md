---
title: Types
---
# Types

Types are declared inside type sections, where multiple types can be declared. Note that aliased types are the same, and not in any way incompatible with their original type. If type safety is desired, [distinct types](/types/distinct/) should be used.

``` nimrod
type
  MyInteger* = int

let a: int = 2
discard a + MyInteger(4)
```

## Range Types

Range types that guarantee a value will always be within a given range also exist. Whenever possible, out-of-bounds values will fail at compile-time, otherwise they will fail at run-time.

``` nimrod
type
  TwoDigits* = range[10..99]

let a = 2
var b: TwoDigits = 99 + a  # Fails at run-time
let c: TwoDigits = 100  # Fails at compile-time
```

Also note that range types also work on any other ordinal type, so a range over an enum is also valid:

``` nimrod
type
  MyEnum = enum
    A, B, C, D, E
  BToD = range[B..D]

let value: BToD = C
```