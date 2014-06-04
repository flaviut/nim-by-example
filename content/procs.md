---
title: Procedures
---
# Procedures

Procedures in Nimrod are declared using `proc` and require that their parameter and return types be annotated. After the types and parameters, an `=` is used to denote the start of the function body.

``` nimrod
proc fibonacci(a, b, n: int): int =
  if n > 1:
    result = fibonacci(b, a+b, n - 1)
  else
    a
```