---
title: Blocks
---

# Blocks

There are two ways to introduce a block, with the `block: ` statement or with `()`s.

The block statement can also be labeled, making it useful for breaking out of loops and is useful for general scoping as well. 

``` nimrod
block outer:
  for i in 0..2000:
    for j in 0..2000:
      if i+j == 3145:
        echo i, ", ", j
        break outer

let b = 3
block:
  let b = "3"  # Probably a dumb idea
```

Parentheses can be used as an expression, but they do not provide end of statement inference, so it is necessary to place semicolons yourself.

``` nimrod
square((
  var result = newSeq[float]();
  for i in 0..1000:
  	result[i] = i;
  result
))
```

An interesting and unexpected side effect of this syntax is that Nimrod is suitable even for brace purists!

``` nimrod
proc square(inSeq: seq[float]): seq[float] = (
  result = newSeq[float](len(inSeq));
  for i, v in inSeq: (
    result[i] = v*v;
  )
)
```