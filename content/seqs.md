---
title: Seqs
---

# Seqs

Seqs provide dynamically expandable storage, they are extended as needed. There are two ways to create seqs, with the `@` operator and with the `newSeq[T](n: int)` method.

Seqs have value semantics, so

``` nimrod
let a = @[1, 2, 3]
a[1] = 5
```

will fail to compile because `a` cannot be assigned to. However, 

``` nimrod
var b = @[1, 2, 3]
b[1] = 5
```

will work without any problems. If wanted, a seq can be passed to a method with the `var` annotation to make it modifiable, so

``` nimrod
proc foo(mySeq: var seq[int]) =
  mySeq[0] = 999

var thisSeq = @[1, 2, 3, 4]
foo(thisSeq)

assert thisSeq[0] == 999
```