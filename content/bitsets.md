---
title: Bitsets
---

# Bitsets

Nimrod comes with a built in way to build a set of ordinal types. The requirements for a type to be usable inside a bitset is that it must be an ordinal and «\texttt{high(T)} < 2^{15}».

|Operator     | Operation                     | Example Code                                 |
|-------------|-------------------------------|----------------------------------------------|
| `A in B`    | is A an element of B?         | `'d' in {'a'..'z'}`                          |
| `A notin B` | is A not an element of B?     | `40 notin {2..20} `                          |
| `A + B`     | union of A with B             | `{'a'..'m'} + {'n'..'z'} == {'a'..'z'}`      |
| `A * B`     | intersection of A with B      | `{'a'..'m'} * {'c'..'z} == {'c'..'m'}`       |
| `A - B`     | relative complement of A in B | `{'a'..'z'} - {'b'..'d'} == {'a', 'e'..'z'}` |
| `A <= B`    | is A a subset of B?           | `{'a'..'c'} <= {'a'..'z'}`                   |
| `A < B`     | is A a strict subset of B?    | `{'b'..'c'} < {'a'..'z'}`                    |
| `A + b`     | add element b to set A        | `{'b'..'z'} + 'a' == {'a'..'z'}`             |
| `A - b`     | remove element b from set A   | `{'a'..'z'} - 'a' == {'b'..'z'}`             |