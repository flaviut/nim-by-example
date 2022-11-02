---
title: For Loops & Iterators
---
# For Loops & Iterators

Nim has first class iterators and syntax to use them, for loops. The `continue` and `break` keywords also work inside of for loops. There are two kinds of iterator, and two special methods that for loops work with.

## `items` and `pairs`

When iterating over an object with one item, Nim will call an iterator called `items` with the first parameter the type you want to iterate over. The same thing happens when iterating with two items, but in that case, the `pairs` iterator is called.

``` nimrod
type
  CustomRange = object
    low: int
    high: int

iterator items(range: CustomRange): int =
  var i = range.low
  while i <= range.high:
    yield i
    inc i

iterator pairs(range: CustomRange): tuple[a: int, b: char] =
  for i in range:  # uses CustomRange.items
    yield (i, char(i + ord('a')))

for i, c in CustomRange(low: 1, high: 3):
  echo c
```
``` console
$ nim c -r items_pair.nim
b
c
d
```

## Operators
Iterators can also be operators [in the standard way](/procs/#operators), with the name enclosed in backticks. For example, the standard library defines the slice iterator, which allows iterating through [ordinal types](/types/enums/#ordinals).

``` nimrod
# Give it a different name to avoid conflict
iterator `...`*[T](a: T, b: T): T =
  var res: T = a
  while res <= b:
    yield res
    inc res

for i in 0...5:
  echo i
```
``` console
$ nim c -r operatoriterator.nim
0
1
2
3
4
5
```

## Inline Iterators
Inline iterators basically take the body of the for loop and inline it into the iterator. This means that they do not have any overhead from function calling, but if carelessly created may increase code size dramatically.

``` nimrod
iterator countTo(n: int): int =
  var i = 0
  while i <= n:
    yield i
    inc i

for i in countTo(5):
  echo i
```
```console
$ nim c -r ./inline_iter.nim
0
1
2
3
4
5
```


## Closure Iterators
Closure iterators hold on to their state and can be resumed at any time. The `finished()` function can be used to check if there are any more elements available in the iterator, however raw iterator usage is unintuitive and difficult to get right.

``` nimrod
proc countTo(n: int): iterator(): int =
  return iterator(): int =
    var i = 0
    while i <= n:
      yield i
      inc i

let countTo20 = countTo(20)

echo countTo20()

var output = ""
# Raw iterator usage:
while true:
  # 1. grab an element
  let next = countTo20()
  # 2. Is the element bogus? It's the end of the loop, discard it
  if finished(countTo20):
    break
  # 3. Loop body goes here:
  output.add($next & " ")

echo output

output = ""
let countTo9 = countTo(9)
for i in countTo9():
  output.add($i)
echo output
```
```console
$ nim c -r ./closure_iter.nim
0
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
0123456789
```
