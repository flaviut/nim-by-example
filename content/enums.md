---
title: Enums
---
# Enums
Enums in Nimrod are like enums in C, but are type-checked. There are no anonymous enums in Nimrod.

``` nimrod
type
  # Note the Hungarian notation, used to avoid conflicts
  CompassDirections = enum
    cdNorth, cdEast, cdSouth, cdWest
  # {.pure.} means it values must be prefixed with the enum's name
  Colors {.pure.} = enum
    Red = "FF0000", Green = (1, "00FF00"), Blue = "0000FF"
  # Enums can have holes in them
  # Not recommended, exists only for interoperability with C
  Signals = enum
    sigQuit = 3, sigAbort = 6, sigKill = 9

# Iterates through the values
for direction in cdNorth..cdWest:
  # `ord()` returns the integer value of the enum
  # `CompassDirections()` is the inverse of `ord()`
  echo CompassDirections(ord(direction)), " ord: ", ord(direction)

# `ord` gives the integer value, even if there are holes
echo ord(sigQuit)

# Enums are ordinal and have `inc` and `dec`
var ordinal = low(int)
inc ordinal
dec ordinal
echo high(char)

when false:
  var nonOrdinal = sigQuit
  # `Signals` has holes and so isn't ordinal,
  # so `inc` and `dec` don't work
  inc nonOrdinal
  dec nonOrdinal

# The custom `$` makes it echo the hex value
for color in Colors.Red..Colors.Blue:
  echo color
```

```console
$ nimrod c -r enums.nim
cdNorth ord: 0
cdEast ord: 1
cdSouth ord: 2
cdWest ord: 3
3
FF0000
00FF00
0000FF
```