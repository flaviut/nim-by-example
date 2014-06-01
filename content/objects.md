---
title: Objects
---
# Objects

In Nimrod, objects are like structs from C family languages and define a grouping of fields. They are by default traced by the garbage collector, so there is no need to explicitly free them when allocated.

``` nimrod
type
  Animal* = object
    name*, genus*, species*: string
    age: int # Not exported
  PAnimal* = ref Animal

proc sleep*(a: var Animal) =
  a.age += 1

# create a new Animal, mutable and not on the heap
var carl = Animal(name : "Carl",
                  genus : "Lama",
                  species : "glama",
                  age : 12)

# create a new Animal, immutable and not on the heap
let joe = Animal(name : "Joe",
                 genus : "Homo",
                 species : "sapiens",
                 age : 23)

when false:
  # Will not compile, Joe's value is immutable
  joe.age = 57

# Allocate an Animal on the heap
let mittens: ref Animal = new(Animal)
# Fill out all the fields, the start out as 0's
mittens.name = "Mittens"
mittens.genus = "Panthera"
mittens.species = "leo"
mittens.age = 6

# This also goes on the heap since PAnimal is a reference type.
# Initialization is much nicer this way
let spot = PAnimal(name: "Spot",
                   genus: "Canis",
                   species: "lupus",
                   age: 1)

# Same as before, only pointer value is unchangeable
# Pointee is modifiable
spot.age = 2

# Carl is copied, not a reference to Steve
var steve = carl
steve.name = "Steve"
# Carl's name is still "Carl"
assert carl.name == "Carl"
assert steve.name == "Steve"

# Value of the pointer is copied
let lucy = spot
lucy.name = "Lucy"
# Spot's name is now "Lucy"!
assert spot.name == "Lucy"
assert lucy.name == "Lucy"
```