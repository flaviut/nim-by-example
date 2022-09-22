---
title: Object Oriented Programming
---

# Object Oriented Programming

Object oriented programming is supported through inheritance and methods, which are virtual procedures. Methods work in the same way as [procs](/procs/), including UFCS, but the runtime type of the object that a method is called with is used to determine which version to call.

Inheritance is created with the `of` keyword in the type declaration of an object. A method is overridden by creating a new method with parameter types of the subtype. 

``` nimrod
type Animal = ref object of RootObj
  name: string
  age: int
method vocalize(self: Animal): string {.base.} = "..."
method ageHumanYrs(self: Animal): int {.base.} = self.age

type Dog = ref object of Animal
method vocalize(self: Dog): string = "woof"
method ageHumanYrs(self: Dog): int = self.age * 7

type Cat = ref object of Animal
method vocalize(self: Cat): string = "meow"


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

## Testing subtypes

It is also possible to check if an object is of a given subtype with the `of` keyword. For example,

``` nimrod
echo(animals[0] of Dog)
echo(animals[0] of Cat)
echo(animals[0] of Animal)
```
``` console
$ nim c -r of_op.nim
true
false
true
```
