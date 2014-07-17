---
title: Main
---

# Nimrod by Example

Nimrod is a powerful statically typed language that allows the programmer expressiveness without compromising run-time performance. As a general purpose programming language, it gives the same sort of power and performance as C++, but in a nicer package and with even more powerful tools!

Getting started? Head over to the [installation instructions](/getting_started/)!

``` nimrod
import tables, strutils

var wordFrequencies = newCountTable[string]()

for line in stdin.lines:
  for word in line.split(", "):
    wordFrequencies.inc(word)

echo "The most frequent word is '", wordFrequencies.largest, "'"
```