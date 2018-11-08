---
title: Bitsets
---

# Bitsets

Nim comes with a built in way to build a set of ordinal types. In order for a type to be usable in a bitset, it must be an ordinal and <<\texttt{high(T)} < 2^{16}>>. For sets of non-ordinal types, see the [sets module](http://nim-lang.org/docs/sets.html), which contains hashsets.

However, best practice is to keep bitset size significantly smaller since each possible element in the set consumes one bit, therefore a bitset of <<2^{16}>> elements will consume 64KiB.

Bitsets have all the useful operations of mathematical sets:

| Operator    | Description                   | Example Code                                 |
|-------------|-------------------------------|----------------------------------------------|
| `a in B`    | is a an element of B?         | `'d' in {'a'..'z'}`                          |
| `a notin B` | is a not an element of B?     | `40 notin {2..20} `                          |
| `A + B`     | union of A with B             | `{'a'..'m'} + {'n'..'z'} == {'a'..'z'}`      |
| `A - B`     | relative complement of A in B | `{'a'..'z'} - {'b'..'d'} == {'a', 'e'..'z'}` |
| `A + {b}`   | add element b to set A        | `{'b'..'z'} + {'a'} == {'a'..'z'}`           |
| `A - {b}`   | remove element b from set A   | `{'a'..'z'} - {'a'} == {'b'..'z'}`           |
| `A * B`     | intersection of A with B      | `{'a'..'m'} * {'c'..'z'} == {'c'..'m'}`      |
| `A <= B`    | is A a subset of B?           | `{'a'..'c'} <= {'a'..'z'}`                   |
| `A < B`     | is A a strict subset of B?    | `{'b'..'c'} < {'a'..'z'}`                    |
