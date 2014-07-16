---
title: Result
---
# Result

The `result` variable is a special variable that serves as an implicit return variable, which exists because the control flow semantics of the `return` statement are rarely needed. The result variable is initialized in the standard way, as if it was declared with `var result: T`.

``` nimrod
proc `**`(number, power: int): int =
  result = 1
  for i in 1..power:
    result *= number
```

A possible gotcha is declaring a new variable called `result` and expecting it to have the same semantics.

``` nimrod
proc unexpected(): int =
  var result = 5
  result += 5

echo unexpected()  # Prints 0, not 10
```
