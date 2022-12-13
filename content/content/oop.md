---
title: Object Oriented Programming
---

# Object Oriented Programming

## Member functions or Method calls

Member functions, typically known as methods in OOP terminology, can be implemented directly using `proc`s, thanks to the Uniform Call Syntax.

``` nimrod
type Animal = object
  name: string
  age: int
  
proc speak(self: Animal, msg: string) = 
  echo self.name & " says:" & msg 
  
var sparky = Animal(name: "Sparky", age: 10)

sparky.speak("Hi")
# this is the same as the below
speak(sparky, "Hi")
```

As you might have guessed, the method call syntax is not restricted to object types.

``` nimrod
proc double(num: int):int =
  return num*2
  
double(10)
# same as
10.double()
# you can even drop the empty paranthesis
10.double
```

Now, when using UFCS to think about `proc`s as member functions, there is an important point to keep in mind about mutability. Consider this example.

``` nimrod
type Animal = object
  name: string
  age: int
  
proc incAge(self: Animal) =
  self.age += 1
  
var sparky = Animal(name: "Sparky", age: 3)
```

This fails compiling with the following error:
``` console
Error: type mismatch: got <int, int literal(1)>
but expected one of:
proc `+=`[T: SomeInteger](x: var T; y: T)
  first type mismatch at position: 1
  required type for x: var T: SomeInteger
  but expression 'self.age' is immutable, not 'var'
proc `+=`[T: float | float32 | float64](x: var T; y: T)
  first type mismatch at position: 1
  required type for x: var T: float or float32 or float64
  but expression 'self.age' is of type: int

expression: self.age += 1
```

If you try something simpler:
``` nimrod
proc setName(self: Animal, name: string) =
  self.name = name
```
the error message is a lot clearer:
``` console
Error: 'self.name' cannot be assigned to
```

This happens because arguments to `proc` are immutable by default. The error can be fixed by marking the argument as mutable using `var`:

``` nimrod
proc incAge(self: var Animal) =
  self.age += 1

proc setName(self: var Animal, name: string) =
  self.name = name
```

Now, everything works.

Note that `ref` objects can be mutated, and the following works correctly:
``` nimrod
type Animal = ref object
  name: string
  age: int
  
proc incAge(self: Animal) =
  self.age += 1
```

Why is this? This is because self is just a pointer and is not being mutated. If you try to change the self variable itself, it would not work.

## Inheritance

Nim supports inheritance and dynamically dispatched (also known as "virtual") methods. Methods work in the same way as [procs](/procs/), including UFCS, but the runtime type of the object that a method is called with is used to determine which version to call.

Inheritance is created with the `of` keyword in the type declaration of an object. Note that base objects that are going to be inherited have to inherit from RootObj since an object type with no ancestors are implicitly `final`.

A method is overridden by creating a new method with parameter types of the subtype.

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

### Should you use `proc`s or `method`s?

Since `proc`s are statically dispatched, they are more performant compared to the dynamic dispatched `method`s.

As [discussed in this blog](https://matthiashager.com/proc-method-nim), use `method`s only if you need the dynamic dispatch.

### Testing subtypes

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
