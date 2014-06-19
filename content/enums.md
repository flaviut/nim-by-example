---
title: Enums
---
# Enums
Enums in Nimrod are like enums in C, but are type-checked. There are no anonymous enums in Nimrod.

``` nimrod
type
  CompassDirections = enum
    cdNorth, cdEast, cdSouth, cdWest

  Colors {.pure.} = enum
    Red = "FF0000", Green = (1, "00FF00"), Blue = "0000FF"

  Signals = enum
    sigQuit = 3, sigAbort = 6, sigKill = 9
```
Notice that each element in `CompassDirections` is prepended with `cd` to avoid name conflicts since references to the enum value do not need to be qualified. The `{.pure.}` pragma that `Colors` has requires that all references to `Colors`'s values be qualified, therefore making a prefix unnecessary.

Enums can be given custom values and stringify values, as shown by `Colors` and `Signals`.

While enums can also have disjoint values, it should not be used for any other reason than compatibility with C because it breaks the idea that enums are ordinal.

``` nimrod
for direction in ord(low(CompassDirections))..
                 ord(high(CompassDirections)):
  echo CompassDirections(direction), " ord: ", direction

var ordinal = low(int)
inc ordinal
dec ordinal
echo high(char)
```
```console
$ nimrod c -r enums.nim
cdNorth ord: 0
cdEast ord: 1
cdSouth ord: 2
cdWest ord: 3
3
�
```

Because enums are ordinals, they have the `low`, `high`, `inc`, `dec`, and `ord` methods defined, where

 - `low` gives the lowest possible value
 - `high` give the highest possible value
 - `inc` increments
 - `dec` decrements
 - `ord` gives the integer value of the enum
 - `CompassDirections` is a cast that gives an enum from an integer

It is also possible to iterate through all possible values of ordinal enums, either as shown above, or `cdNorth..cdWest`, which is equivalent.


``` nimrod
when false:
  var nonOrdinal = sigQuit
  inc nonOrdinal
  dec nonOrdinal
```

`Signals` is not an ordinal type, and so doesn't have the `inc` and `dec` procedures.