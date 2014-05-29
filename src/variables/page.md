# Variables

Nimrod supports three different types of variables, `let`, `var`, and `const`. As with most things, multiple variables can be declared in the same section.

``` nimrod
proc getLetterA(): string =
  result = ""
  for letter in 'a'..'z':
    result.add(letter)

const abcs = getLetterA()
var
  foo = "bar"
  bar = "foo"
# oops, I need to fix the names
let temp = foo
foo = bar
bar = temp

echo "abcs is ", abcs
echo "foo is ", foo
echo "bar is ", bar
```

```
$ nimrod c -r ./assignment.nim
abcs is abcdefghijklmnopqrstuvwxyz
foo is foo
bar is bar
```

A `const` variable is evaluated at compile-time, so if you inspect the C sources, you'll see the following line:

``` C
STRING_LITERAL(TMP129, "abcdefghijklmnopqrstuvwxyz", 26);
```

The limitation with `const` is that it cannot interface with C because there is no compile-time foreign function interface at this time.

 `var` variables are the standard mutable variables, you can modify them after they've been assigned. `let` variables are also fairly standard immutable variables. This means you can assign to them at creation time and can't change them later on.