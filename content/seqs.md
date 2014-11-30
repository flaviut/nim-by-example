---
title: Seqs
---

# Seqs

Seqs, abbreviated from "sequence", provide dynamically expandable storage.

There are two ways to create seqs, with the `@` operator and with the `newSeq[T](n: int)` method. Once a seq is created, it can be modified using the `add(item: T)`, `delete(idx: int)`. The length of a seq can be found through `len: int`, and the maximum index through `high: int`. The standard `items: T` and `pairs: tuple[i: int, v: T]` iterators are also available.

``` nimrod
var
  a = @[1, 2, 3]
  b = newSeq[int](3)

for i, v in a:
  b[i] = v*v

for i in 4..100:
  b.add(i * i)

b.delete(0)  # takes «O(n)» time
b = a[0] & b  # Same as original b
```


## Immutability

While sequences are dynamiclly allocated, they are still immutable.

``` nimrod
let a = @[1, 2, 3]
a.add(4)
```

will fail to compile because `a` cannot be assigned to. However, 

``` nimrod
var b = @[1, 2, 3]
b.add(4)
```

will work without any problems. If wanted, a seq can be passed to a method with the `var` or `ref` annotation to make it modifiable, so

``` nimrod
proc foo(mySeq: var seq[int]) =
  mySeq[9] = 999

var thisSeq = newSeq[int](10)
foo(thisSeq)

assert thisSeq[9] == 999
```
