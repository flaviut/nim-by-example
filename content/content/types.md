---
title: Types
---
# Types

Types are declared inside type sections, where multiple types can be declared. Note that aliased types are the same, and not in any way incompatible with their original type. If type safety is desired, [distinct types](/types/distinct/) should be used.

``` nim
type
  MyInteger* = int

let a: int = 2
discard a + MyInteger(4)
```
