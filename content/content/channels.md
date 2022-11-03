---
title: Channels
---

# Channels

Nim provides [channels](https://nim-lang.org/docs/channels_builtin.html), used to communicate between threads.

Here is an example with plain threads.

``` nimrod
import std/os # for sleep

var
  # create a channel to send/recv strings
  commChan: Channel[string]
  sender: Thread[void]
  recver: Thread[void]

proc sendMsg() =
  sleep(500)
  # send a message in the channel
  commChan.send("Hi")

proc recvMsg() =
  # block on the channel, waiting for output
  let msg: string = commChan.recv()
  echo "Received message: " & msg

# very important: channels must be opened before they can be used
commChan.open()
createThread(sender, sendMsg)
createThread(recver, recvMsg)
joinThreads(sender, recver)
```

Usually, channels are created as global variables. That means you must [follow a certain procedure](https://nim-lang.org/docs/channels_builtin.html#example-passing-channels-safely) if you wish to manually allocate shared memory for channels.

The same example, using the higher level `spawn`:

``` nimrod
import threadpool, std/os

var commChan: Channel[string]

proc sendMsg() =
  sleep(500)
  commChan.send("Hi there!")

proc recvMsg() =
  let msg = commChan.recv()
  echo "Received msg: " & msg

commChan.open()
spawn recvMsg()
spawn sendMsg()
sync()
```

Note that all messages are deep copied when sent.

Channels can be used in a non-blocking way as follows:
``` nimrod
while true:
  let tried = commChan.tryRecv()
  if tried.dataAvailable:
    echo tried.msg
```

When a channel is opened, it can be set with a max number of items:
``` nimrod
# create a channel to transfer ints
var chan Channel[int]
# allow max of 10 items in channel
chan.open(10)
```
The default is set to 0, which means unlimited queue size.

When the channel size is limited, new `sends` will be blocked if there is not enough space. You can use the `trySend` function instead, which returns immediately with a `bool` representing success of the operation.

See the [documentation](https://nim-lang.org/docs/channels_builtin.html).
