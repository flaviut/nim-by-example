---
title: Concurrency
---

# Concurrency

Concurrency is provided in Nim, using `async`/`await` syntax. This feature is powered by [the `asyncdispatch` module](https://nim-lang.org/docs/asyncdispatch.html).

Note that, concurrency is not [parallelism](/parallelism/). All the examples here are async functions that run on a single thread. This is mainly useful for IO intensive tasks.

A general example looks like this:
``` nim
import asyncdispatch

proc ioManager(id: string) {.async.} =
  for i in 1..10:
    # wait for some some async process
    await sleepAsync(10)
    echo id & " - run: " & $i

let
  ma = ioManager("a")
  mb = ioManager("b")

waitFor ma and mb
```

You should see an output like:
``` console
a - run: 1
b - run: 1
a - run: 2
b - run: 2
a - run: 3
b - run: 3
```
showing interleaved function completions.

Async functions are tagged with the `{.async.}` pragma. These functions can now use the `await` keyword to wait for async procedures.

In the example above, we have used `waitFor` on 2 async functions, so the execution blocks until both functions are run to completion.

An alternative option is:
``` nim
runForever()
```
which blocks, waiting indefinitely for all asynchronous functions.

You may also find [Peter's article on async programming](https://peterme.net/asynchronous-programming-in-nim.html) helpful.

## Higher Async modules

The underlying `asyncdispatch` modules is used by several higher level modules:

1. [`asyncfile`](https://nim-lang.org/docs/asyncfile.html) for async file operations.
2. [`asyncnet`](https://nim-lang.org/docs/asyncnet.html) for async networking operations.
3. [`asynchttpserver`](https://nim-lang.org/docs/asynchttpserver.html) for an async http server.
