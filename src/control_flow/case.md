# Case Statements

Nimrod also supports case statements, which are like switches in other languages. There are several things to note here:

* You can use strings in the switch statement
* Sets and ranges of ordinal types are also usable
* case statements, like most things, are actually expressions

``` Nimrod
case "charlie"
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
  echo "Maybe, but I only know English"
else:
  echo "Consonant"

proc positiveOrNegative(num: int): string =
  result = case num
  of low(int)..-1:
    "negative"
  of 0:
    "zero"
  of 1..high(int):
    "positive"

echo positiveOrNegative(-1)
```

```
$ nimrod c -r ./case_stmts.nim
C
Consonant
negative
```