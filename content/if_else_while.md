---
title: If, Else, While
---

# If, Else, While

Nimrod has many different control flow constructs, including the standard `if`s, `else`s, and `while`s. However, Nimrod does not use an `else if` construct like many languages, it uses a more condensed `elif`.

When inside a loop, `continue` can be used to skip the rest of the loop body and to begin the next iteration; `break` can be used to immediately leave the loop body.

Along with [its other uses](/block/), the `block` statement can be used to create a label so that it's possible to break out of nested loops.

``` nimrod
import strutils

let answer = 4  # Chosen by a fair dice roll,
                # guaranteed to be random
while true:
  echo "I have a number from 1 to 10, what is it? "
  let guess = parseInt(stdin.readLine)

  if guess < answer:
    echo "Too low, try again"
  elif guess > answer:
    echo "Too high, try again"
  else:
    echo "Correct!"
    break

block busyloops:
  while true:
    while true:
      break busyloops
```
