# For Loops & Iterators

Nimrod has first class iterators and syntax to use them, for loops. The `continue` and `break` keywords also work inside of for loops. There are two kinds of iterator, and two special methods that for loops work with.

## `items` and `pair`

When iterating over an object with one item, Nimrod will call an iterator called `items` with the first parameter the type you want to iterate over. The same thing happens when iterating with two items, but in that case, the `pairs` iterator is called.

``` nimrod
type
  TRange = object
    low: int
    high: int

iterator items(range: TRange): int =
  var i = range.low
  while i <= range.high:
    yield i
    inc i

iterator pairs(range: TRange): tuple[a: int, b: char] =
  for i in range:
    yield (i, char(i + ord('a')))

for i, c in TRange(low: 1, high: 3):
  echo c
```
``` console
$ nimrod c -r items_pair.nim
b
c
d
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
$ nimrod c -r ./inline_iter.nim
0
1
2
3
4
5
```


## Closure Iterators
Closure iterators hold on to their state and can be resumed at any time. The `finished()` function can be used to check if there are any more elements available in the iterator.

``` nimrod
proc countTo(n: int): iterator(): int =
  return iterator (): int =
    var i = 0
    while i <= n:
      yield i
      inc i

let countTo20 = countTo(20)

echo countTo20()

var output = ""
while not finished(countTo20):
  output.add($countTo20())
echo output

output = ""
let countTo9 = countTo(9)
for i in countTo9:
  output.add($i)
echo output
```
```console
$ nimrod c -r ./closure_iter.nim
0
12345678910111213141516171819200
0123456789
```