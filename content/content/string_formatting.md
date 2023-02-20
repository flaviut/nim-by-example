---
title: String Formatting
---

# String Formatting

The `&` operator can be used for simple string concatenation:

``` nimrod
let msg = "hello" & "world"
```
The `strutils` module provides string interpolation from a format string using the [`%` operator](https://nim-lang.org/docs/strutils.html#%25%2Cstring%2CopenArray%5Bstring%5D).

``` nimrod
import std/strutils

# numbered arguments
echo "$1 $2" % ["hello", "world"]
# you can fetch the next argument using #
echo "$# $#" % ["hello", "world"]
# can support named arguments
echo "$first $second" % ["first", "hello", "second", "world"]
```

Alternatively, you can use the functionality provided by the [`strformat` module](https://nim-lang.org/docs/strformat.html).

``` nimrod
import std/strformat

let
  h = "hello"
  w = "world"

echo fmt"{h} {w}"
echo &"{h} {w}"
```
The `fmt` and `&` operators have [a slight difference in usuage](https://nim-lang.org/docs/strformat.html#nimfmt-vsdot-nimamp): namely, the `fmt` operator results in a raw string literal which does not interpret escape sequences. Using the `&` operator is the simplest way around this; other options are listed in the docs.

## Non-string arguments

We have seen 3 different string formatting options above. How do you format non-string built-in types?

``` nimrod
import std/strutils, std/strformat

let 
  num = 42

# does not work
echo "hello" & num
# this does not work either
echo "hello $1" % [num]
# this works fine
echo &"hello {num}"

# use the $ operator to convert to string
assert $num == "42"

# these work now
echo "hello" & $num
echo "hello $1" % [$num]
```

That is, the first two methods expect string arguments, the third works with any types. Refer to the [docs for format specifiers](https://nim-lang.org/docs/strformat.html#standard-format-specifiers-for-strings-integers-and-floats) for alignments, integer and floating presentation types.

## Formatting object types

The `$` operator is Nim's version of the string or toString function. You can create string representations for object types as shown below.

``` nimrod
import std/strutils, std/strformat

type Fruit = object
  name: string
  color: string
  
proc `$`(self: Fruit): string =
  &"Fruit({self.name}, {self.color})"
  
let apple = Fruit(name: "apple", color: "red")
  
echo apple  # Fruit("apple", "red")
echo $apple # Fruit("apple", "red")

echo "hello " & apple # does not work, like before
echo "hello " & $apple # hello Fruit("apple", "red")

echo "hello $1" % [apple] # does not work, like before
echo "hello $1" % [$apple] # hello Fruit("apple", "red")

# note the difference here
echo &"hello {apple}" # hello (name: "apple", color: "red")
echo &"hello {$apple}" # hello Fruit("apple", "red")
```

Note that the first line in the last section formats object types (and other types) using an in-built representation and you need to use the `$` operator—as in the second line of the last section—if you want to coerce it to a format of your choosing.
