---
title: Procedures
---
# Procedures

Procedures in Nimrod are declared using `proc` and require that their parameter and return types be annotated. After the types and parameters, an `=` is used to denote the start of the function body.

``` nimrod
proc fibonacci(n: int): int =
  if n < 2:
    result = n
  else:
    result = fibonacci(n - 1) + fibonacci(n - 2)
```