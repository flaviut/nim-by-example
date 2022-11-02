---
title: Procs
---
# Procs

Procedures in Nim are declared using `proc` and require that their parameter and return types be annotated. After the types and parameters, an `=` is used to denote the start of the function body. Another thing to note is that procedures have uniform function call syntax, which means that they can called as both `foo(a, b)` or `a.foo(b)`.

``` nimrod
proc fibonacci(n: int): int =
  if n < 2:
    result = n
  else:
    result = fibonacci(n - 1) + (n - 2).fibonacci
```

## Exporting symbols

<!-- XXX Move into module topic -->
Encapsulation is also supported, not by conventions such as prepending the name with underscores but by annotating a procedure with `*`, which exports it and makes it available for use by modules.

``` nimrod
# module1:
proc foo*(): int = 2
proc bar(): int = 3

# module2:
echo foo()  # Valid
echo bar()  # will not compile
```

## Side effect analyses

Nim provides support for functional programming and so includes the `{.noSideEffect.}` pragma, which statically ensures there are no side effects.

``` nimrod
proc sum(x, y: int): int {. noSideEffect .} =
  x + y

proc minus(x, y: int): int {. noSideEffect .} =
  echo x  # error: 'minus' can have side effects
  x - y
```

## Operators

To create an operator, the symbols that are to be used must be encased inside `` ` ``s to signify they are operators.

``` nimrod
proc `$`(a: array[2, array[2, int]]): string =
  result = ""
  for v in a:
    for vx in v:
      result.add($vx & ", ")
    result.add("\n")

echo([[1, 2], [3, 4]])  # See varargs for
                        # how echo works

proc `^&*^@%`(a, b: string): string =
  ## A confusingly named useless operator
  result = a[0] & b[high(b)]

assert("foo" ^&*^@% "bar" == "fr")

``` 

## Generic Functions

<!-- XXX Needs own section -->
Generic functions are like C++'s templates and allow for the same statically checked duck-typing semantics as templates. 

``` nimrod
proc `+`(a, b: string): string =
  a & b

proc `*`[T](a: T, b: int): T =
  result = default(T)
  for i in 0..b-1:
    result = result + a  # calls `+` from line 2

assert("a" * 10 == "aaaaaaaaaa")
```
