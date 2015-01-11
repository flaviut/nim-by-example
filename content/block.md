---
title: Blocks
---

# Blocks

Blocks can be introduced in two different ways: by indenting statements or with `()`s.

The first way ist to use indenting, e.g. using `if-elif-else`, `while`, `for` statements, or the `block`  statement.

``` nimrod
if true:
  echo "Nimrod is great!"

while false:
  echo "This line is never output!"

block:
  echo "This line, on the other hand, is always output"
```

The `block` statement can also be labeled, making it useful for breaking out of loops and is useful for general scoping as well. 

``` nimrod
block outer:
  for i in 0..2000:
    for j in 0..2000:
      if i+j == 3145:
        echo i, ", ", j
        break outer

let b = 3
block:
  let b = "3"  # shadowing is probably a dumb idea
```

Parentheses can be used as an expression, but they do not provide end of statement inference, so it is necessary to place semicolons yourself. An interesting and unexpected side effect of this syntax is that Nim is suitable even for die-hard brace purists!

While possible, it doesn't mean it's a good idea. Most Nim code does not use parentheses in that way, and it would not be seen as idiomatic.

``` nimrod
proc square(inSeq: seq[float]): seq[float] = (
  result = newSeq[float](len(inSeq));
  for i, v in inSeq: (
    result[i] = v*v;
  )
)

```

<!-- XXX FIX
square((  # A 1001 long sequence to be squared
  var result = newSeq[float]();
  for i in 0..1000:
    result.add(i);
  result
))-->
