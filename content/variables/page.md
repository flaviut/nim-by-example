# Variables

Nimrod supports three different types of variables, `let`, `var`, and `const`. As with most things, multiple variables can be declared in the same section.

``` nimrod
proc getAlphabet(): string =
  result = ""
  for letter in 'a'..'z':
    result.add(letter)

const abcs = getAlphabet()

var
  a = "foo"
  b = 0

let
  c = "foo"
  d = 5

a.add "bar" # This is fine because ``a`` is mutable.
b.inc # This is also fine.

c.add "bar" # This will result in an error.
d.inc # As will this.
```

``` console
$ nimrod c --verbosity:2 ./assignment.nim
a20.nim(19, 0) Error: for a 'var' type a variable needs to be passed
  c.add "bar" # This will result in an error.
  ^
```

Without `--verbosity:2` only the error will be shown.

A `const` variable's value will be evaluated at compile-time, so if you inspect the C sources, you'll see the following line:

``` c
STRING_LITERAL(TMP129, "abcdefghijklmnopqrstuvwxyz", 26);
```

The limitation with this is that procedures which are evaluated at compile-time cannot interface with C because there is no compile-time foreign function interface at this time.

As seen in the example, `var` variables are standard mutable variables, you can modify them after they've been assigned. `let` variables on the other hand are immutable variables. This means you can assign to them at creation time and can't change them later on. The difference between `let` and `const` is that a `const`'s expression must be evaluated at compile-time, a `let`'s expression doesn't have this requirement.
