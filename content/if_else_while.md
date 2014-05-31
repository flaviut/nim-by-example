# If, Else, While, Block

Nimrod many different control flow constructs, including the standard `if`s, `else`s, and `while`s.

When inside a loop or block, it is possible to use `continue` or `break` any point, where `continue` skips to the next iteration and `break` ends the loop. The break statement can also receive the name of the block to break out of, so it is possible to break out of nested loops.

~~~ Nimrod
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
~~~