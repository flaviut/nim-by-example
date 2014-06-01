# Objects

In Nimrod, objects are like structs from C family languages and define a grouping of fields.

``` nimrod
type
  Animal* = object
    name*, genus*, species*: string
    age: int # None of your business!
  PAnimal* = ref Animal

proc sleep*(a: var Animal) =
  a.age += 1

# create a new Animal, not allocated on the heap
var carl = Animal(name : "Carl",
                  genus : "Lama",
                  species : "glama",
                  age : 12)

# Allocate an Animal on the heap
# Note that the pointer is immutable, not the pointee
let mittens: ref Animal = new(Animal)
mittens.name = "Mittens"
mittens.genus = "Panthera"
mittens.species = "Leo"
mittens.age = 6

# This also goes on the heap since PAnimal is a
# reference type
let spot = PAnimal(name: "Spot",
                   genus: "Canis",
                   species: "Lupus",
                   age: 1)

# Same as before, only pointer value is unchangeable
spot.age = 2
```
