---
title: Object Oriented Programming
---

# Object Oriented Programming

Object oriented programming is supported through inheritance and methods, which are virtual procedures. Methods work in the same was as [procs](/procs/), including UFCS, but the runtime type of the object that a method is called with is used to determine which version to call.

Inheritance is created with the `of` keyword in the type declaration of an object. A method is overridden by creating a new method with parameter types of the subtype. 

``` nimrod
type Animal = ref object of TObject
  name: string
  age: int
method vocalize(this: Animal): string = "..."
method ageHumanYrs(this: Animal): int = this.age

type Dog = ref object of Animal
method vocalize(this: Dog): string = "woof"
method ageHumanYrs(this: Dog): int = this.age * 7

type Cat = ref object of Animal
method vocalize(this: Cat): string = "meow"


var animals: seq[Animal] = @[]
animals.add(Dog(name: "Sparky", age: 10))
animals.add(Cat(name: "Mitten", age: 10))

for a in animals:
  echo a.vocalize()
  echo a.ageHumanYrs()
```
``` console
$ nim c -r oop.nim
woof
70
meow
10
```
