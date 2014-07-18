---
title: Case Statements
---
# Case Statements

Nimrod also supports case statements, which are like switches in other languages. There are several things to note here:

* You can use strings in the switch statement
* Sets and ranges of ordinal types are also usable
* case statements, like most things, are actually expressions
* It is required that every possible case be covered

``` nimrod
case "charlie":
  of "alfa":
    echo "A"
  of "bravo":
    echo "B"
  of "charlie":
    echo "C"
  else:
    echo "Unrecognized letter"

case 'h':
  of 'a', 'e', 'i', 'o', 'u':
    echo "Vowel"
  of '\127'..'\255':
    echo "Unknown"
  else:
    echo "Consonant"

proc positiveOrNegative(num: int): string =
  result = case num:
    of low(int).. -1:
      "negative"
    of 0:
      "zero"
    of 1..high(int):
      "positive"
    else:
      "impossible"

echo positiveOrNegative(-1)
```

``` console
$ nimrod c -r ./case_stmts.nim
C
Consonant
negative
```

Another feature of case statements is that the possible values are narrowed, meaning that no `else` statement is necessary in many cases:

``` nimrod
let x = 2
case (x and 3) + 7:
  of 7: echo "A"
  of 8: echo "B"
  of 9: echo "C"
  of 10: echo "D"
```
``` console
$ nimrod c -r ./case_stmts_1.nim
C
```
