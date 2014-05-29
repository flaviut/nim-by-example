# Control Flow

Nimrod many different control flow constructs, including the standard `if`s, `else`s, and `while`s.

``` Nimrod
import strutils

let
  answer = 4  # Chosen by a fair dice roll,
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
```