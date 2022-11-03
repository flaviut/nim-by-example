---
title: Parallelism
---

# Parallelism

There are a number of ways of achieving parallelism in Nim.

You need to enable threads at compile time, as follows:
``` console
$ nim --threads:on c threads.nim
```

This is needed for all the different ways shown below.

## Threads

``` nimrod
proc sayHi(num: int) {.thread.} =
  echo "Hi from " & $num

var threads: array[10, Thread[int]]

for i in threads.low..threads.high:
  createThread(threads[i], sayHi, i)
joinThreads(threads)
```

It is recommended that functions used with threads be marked using the `{.thread.}` [pragma](https://nim-lang.org/docs/manual.html#threads-thread-pragma).

## Spawn using threadpool

Instead of using threads directly, you can use the higher level abstraction provided by `std/threadpool`.

``` nimrod
import threadpool

proc sayHi(num: int) {.thread.} =
  echo "Hi from " & $num

for i in 0..9:
  spawn sayHi(i)
sync()
```

Note however, that `spawn` comes with a number of conditions documented [here](https://nim-lang.org/docs/manual_experimental.html#parallel-amp-spawn).

## Other options

You can also do the following:
1. The experimental `parallel` statement.
2. Return data from `spawn` calls.

Details for both of these can be found in [the `experimental` module's manual page](https://nim-lang.org/docs/manual_experimental.html#parallel-amp-spawn).
