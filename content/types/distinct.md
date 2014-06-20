---
title: Distinct Types
---
# Distinct Types

Distinct types are like other type aliases, but they provide type safety so that it is impossible to coerce a distinct type into its base type without explicit conversion.

``` nimrod
type
  Dollars* = distinct float

var a = 20.Dollars
a = 25  # Doesn't compile
a = 25.Dollars  # Works fine
```

However, when using distinct types, none of the base type's procedures follow the type. To solve this, it is possible to create lots of procedures that basically act as a thin wrapper for the underlying types, or the `{.borrow.}` pragma can be used to automate generation of procedures.

``` nimrod
proc `*` *(a, b: Dollars): Dollars {.borrow.}
proc `+` *(a, b: Dollars): Dollars {.borrow.}
a = 20.Dollars * 20.Dollars
```
<!--- XXX Uug, {.borrow: `.`.} -->