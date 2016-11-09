---
title: OOP Macro
---
<!--- Thanks to fowl for creating this page, filwit for fixing some oddities -->

# OOP Macro
This is the code that we currently must write to use OOP in Nim:

```nimrod
type Animal = ref object of RootObj
  name: string
  age: int
method vocalize(this: Animal): string = "..."
method ageHumanYrs(this: Animal): int = this.age

type Dog = ref object of Animal
method vocalize(this: Dog): string = "woof"
method ageHumanYrs(this: Dog): int = this.age * 7

type Cat = ref object of Animal
method vocalize(this: Cat): string = "meow"
```

All these typedefs and `this: T` parameters are repetitive, so it'd be good to write a macro to mask them. Something like this would be best:

```nimrod
class Animal of RootObj:
  var name: string
  var age: int
  method vocalize: string = "..."
  method age_human_yrs: int = this.age # `this` is injected

class Dog of Animal:
  method vocalize: string = "woof"
  method age_human_yrs: int = this.age * 7

class Cat of Animal:
  method vocalize: string = "meow"
```

To get that nice notation, we can use a macro:

```nimrod
import macros

macro class*(head, body: untyped): untyped =
  # The macro is immediate, since all its parameters are untyped.
  # This means, it doesn't resolve identifiers passed to it.

  var typeName, baseName: NimNode

  if head.kind == nnkIdent:
    # `head` is expression `typeName`
    # echo head.treeRepr
    # --------------------
    # Ident !"Animal"
    typeName = head
    baseName = ident("RootObj")

  elif head.kind == nnkInfix and $head[0] == "of":
    # `head` is expression `typeName of baseClass`
    # echo head.treeRepr
    # --------------------
    # Infix
    #   Ident !"of"
    #   Ident !"Animal"
    #   Ident !"RootObj"
    typeName = head[1]
    baseName = head[2]

  else:
    quit "Invalid node: " & head.lispRepr

  # The following prints out the AST structure:
  #```nimrod
  # import macros
  # dumptree:
  #   type X = ref object of Y
  #     z: int
  # --------------------
  # StmtList
  #   TypeSection
  #     TypeDef
  #       Ident !"X"
  #       Empty
  #       RefTy
  #         ObjectTy
  #           Empty
  #           OfInherit
  #             Ident !"Y"
  #           RecList
  #             IdentDefs
  #               Ident !"z"
  #               Ident !"int"
  #               Empty

  # create a type section in the result
  result =
    quote do:
      type `typeName` = ref object of `baseName`

  # echo treeRepr(body)
  # --------------------
  # StmtList
  #   VarSection
  #     IdentDefs
  #       Ident !"name"
  #       Ident !"string"
  #       Empty
  #     IdentDefs
  #       Ident !"age"
  #       Ident !"int"
  #       Empty
  #   MethodDef
  #     Ident !"vocalize"
  #     Empty
  #     Empty
  #     FormalParams
  #       Ident !"string"
  #     Empty
  #     Empty
  #     StmtList
  #       StrLit ...
  #   MethodDef
  #     Ident !"age_human_yrs"
  #     Empty
  #     Empty
  #     FormalParams
  #       Ident !"int"
  #     Empty
  #     Empty
  #     StmtList
  #       DotExpr
  #         Ident !"this"
  #         Ident !"age"

  # var declarations will be turned into object fields
  var recList = newNimNode(nnkRecList)

  # Iterate over the statements, adding `this: T`
  # to the parameters of functions
  for node in body.children:
    case node.kind:

      of nnkMethodDef, nnkProcDef:
        # inject `this: T` into the arguments
        let p = copyNimTree(node.params)
        p.insert(1, newIdentDefs(ident("this"), typeName))
        node.params = p
        result.add(node)

      of nnkVarSection:
        # variables get turned into fields of the type.
        for n in node.children:
          recList.add(n)

      else:
        result.add(node)

  # Inspect the tree structure:
  #
  # echo result.treeRepr
  # --------------------
  # StmtList
  #   TypeSection
  #     TypeDef
  #       Ident !"Animal"
  #       Empty
  #       RefTy
  #         ObjectTy
  #           Empty
  #           OfInherit
  #             Ident !"RootObj"
  #           Empty   <= We want to replace this
  # MethodDef
  # ...

  result[0][0][2][0][2] = recList

  # Lets inspect the human-readable version of the output
  # echo repr(result)
  # Output:
  #  type
  #    Animal = ref object of RootObj
  #      name: string
  #      age: int
  #
  #  method vocalize(this: Animal): string {.base.} =
  #    "..."
  #
  #  method age_human_yrs(this: Animal): int {.base.} =
  #    this.age

# ---

class Animal of RootObj:
  var name: string
  var age: int
  method vocalize: string {.base.} = "..." # use `base` pragma to annonate base methods
  method age_human_yrs: int {.base.} = this.age # `this` is injected

class Dog of Animal:
  method vocalize: string = "woof"
  method age_human_yrs: int = this.age * 7

class Cat of Animal:
  method vocalize: string = "meow"

# ---

var animals: seq[Animal] = @[]
animals.add(Dog(name: "Sparky", age: 10))
animals.add(Cat(name: "Mitten", age: 10))

for a in animals:
  echo a.vocalize()
  echo a.age_human_yrs()
```
``` console
$ nim c -r oopmacro.nim
woof
70
meow
10
```

If we try to add construction proc to a class:

```nimrod
import oopmacro

class Animal of RootObj:
  var name: string
  var age: int
  method vocalize: string {.base.} = "..."

class Rabbit of Animal:
  proc newRabbit(name: string, age: int): Rabbit = # good practise!
    result = Rabbit(name: name, age: age)
  method vocalize: string = "Meep"

let r = newRabbit("Fluffy", 3)
```
we will run into the following error:

``` console
Error: type mismatch: got (string, int literal(3))
but expected one of: 
proc newRabbit(self: Person; name: string; age: int): Rabbit
```

This happens because class macro injects this 
We can counter this

```nimrod
import oopmacro

macro init*(p: untyped): untyped =
  # echo p.treeRepr
  # --------------------
  # ProcDef
  # Ident !"newPerson"
  # Empty
  # Empty
  # FormalParams
  #   Ident !"Person"
  #   IdentDefs       <= This is unwanted
  #     Ident !"self"
  #     Ident !"Person"
  #     Empty
  #   IdentDefs
  #     Ident !"name"
  #     Ident !"string"
  #     Empty
  #   IdentDefs
  #     Ident !"age"
  #     Ident !"int"
  #     Empty
  # ...

  # remove self from the construction proc
  if $p.params[1][0] == "self":
    del(p.params, 1)
  result = p

class Animal of RootObj:
  var name: string
  var age: int
  method vocalize: string {.base.} = "..." 

class Rabbit of Animal:
  proc newRabbit(name: string, age: int): Rabbit {.init.} =
    result = Rabbit(name: name, age: age)
  method vocalize: string = "meep"

let r = newRabbit("Fluffy", 3)
echo r.vocalize()
```

``` console
$ nim c -r oopmacro2.nim
meep
```
