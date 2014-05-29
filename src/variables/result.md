# Result

The `result` variable is a special variable that serves as an implicit return. This is useful because in most cases, the control flow semantics of the `return` statement are unneeded. `result` is initialized with the default value for a given return type, so the the following code it starts as `0`, before being initialized to `number`

``` nimrod
proc expr(number, power: int): int =
  result = number
  for i in 1..power:
    result *= number
```

A common gotcha is declaring a variable called result and expecting it to have the same semantics.

``` nimrod
proc unexpected(): int =
  var result = 5
  result += 5

echo unexpected()  # Prints 0, not 10
```