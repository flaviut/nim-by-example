---
title: Macros
redirect_from:
  - /oop_macro
---
<!--- Thanks to fowl for creating this page, filwit for fixing some oddities -->

# Macros

Nim's syntax is incredibly versatile, and macros can be used to rewrite the abstract syntax tree of a program. The general process for writing a macro consists of two steps that are repeated until the desired results are achieved:

1. Dump and examine the AST
2. Modify the AST to match the desired shape

The example shown here describes how to create new class syntax in Nim, purely through a library.

This is the code that we currently must write to use OOP in Nim:

```nimrod
type Animal = ref object of RootObj
  name: string
  age: int
method vocalize(this: Animal): string {.base.} = "..."
method ageHumanYrs(this: Animal): int {.base.} = this.age

type Dog = ref object of Animal
method vocalize(this: Dog): string = "woof"
method ageHumanYrs(this: Dog): int = this.age * 7

type Cat = ref object of Animal
method vocalize(this: Cat): string = "meow"
```

All these typedefs and `this: T` parameters are repetitive, so it'd be good to write a macro to mask them. Something like this would be nice:

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

  # flag if object should be exported
  var isExported: bool

  if head.kind == nnkInfix and eqIdent(head[0], "of"):
    # `head` is expression `typeName of baseClass`
    # echo head.treeRepr
    # --------------------
    # Infix
    #   Ident !"of"
    #   Ident !"Animal"
    #   Ident !"RootObj"
    typeName = head[1]
    baseName = head[2]

  elif head.kind == nnkInfix and eqIdent(head[0], "*") and
       head[2].kind == nnkPrefix and eqIdent(head[2][0], "of"):
    # `head` is expression `typeName* of baseClass`
    # echo head.treeRepr
    # --------------------
    # Infix
    #   Ident !"*"
    #   Ident !"Animal"
    #   Prefix
    #     Ident !"of"
    #     Ident !"RootObj"
    typeName = head[1]
    baseName = head[2][1]
    isExported = true

  else:
    error "Invalid node: " & head.lispRepr

  # The following prints out the AST structure:
  #
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

  # create a new stmtList for the result
  result = newStmtList()

  # create a type section in the result
  template typeDecl(a, b): untyped =
    type a = ref object of b

  template typeDeclPub(a, b): untyped =
    type a* = ref object of b

  if isExported:
    result.add getAst(typeDeclPub(typeName, baseName))
  else:
    result.add getAst(typeDecl(typeName, baseName))

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
  #         Ident !"self"
  #         Ident !"age"

  # var declarations will be turned into object fields
  var recList = newNimNode(nnkRecList)

  # expected name of constructor
  let ctorName = newIdentNode("new" & $typeName)

  # Iterate over the statements, adding `self: T`
  # to the parameters of functions, unless the
  # function is a constructor
  for node in body.children:
    case node.kind:

    of nnkMethodDef, nnkProcDef:
      # check if it is the ctor proc
      if node.name.kind != nnkAccQuoted and node.name.basename == ctorName:
        # specify the return type of the ctor proc
        node.params[0] = typeName
      else:
        # inject `self: T` into the arguments
        node.params.insert(1, newIdentDefs(ident("self"), typeName))
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
  #   MethodDef
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
  #  method vocalize(self: Animal): string {.base.} =
  #    "..."
  #
  #  method age_human_yrs(self: Animal): int {.base.} =
  #    self.age
  # ...
  #
  # type
  #   Rabbit = ref object of Animal
  #
  # proc newRabbit(name: string; age: int): Rabbit =
  #   result = Rabbit(name: name, age: age)
  #
  # method vocalize(self: Rabbit): string =
  #   "meep"

# ---

class Animal of RootObj:
  var name: string
  var age: int
  method vocalize: string {.base.} = "..." # use `base` pragma to annotate base methods
  method age_human_yrs: int {.base.} = self.age # `self` is injected
  proc `$`: string = "animal:" & self.name & ":" & $self.age

class Dog of Animal:
  method vocalize: string = "woof"
  method age_human_yrs: int = self.age * 7
  proc `$`: string = "dog:" & self.name & ":" & $self.age

class Cat of Animal:
  method vocalize: string = "meow"
  proc `$`: string = "cat:" & self.name & ":" & $self.age

class Rabbit of Animal:
  proc newRabbit(name: string, age: int) = # the constructor doesn't need a return type
    result = Rabbit(name: name, age: age)
  method vocalize: string = "meep"
  proc `$`: string = "rabbit:" & self.name & ":" & $self.age

# ---

var animals: seq[Animal] = @[]
animals.add(Dog(name: "Sparky", age: 10))
animals.add(Cat(name: "Mitten", age: 10))

for a in animals:
  echo a.vocalize()
  echo a.age_human_yrs()

let r = newRabbit("Fluffy", 3)
echo r.vocalize()
echo r.age_human_yrs()
# `$` is not dynamically dispatched--if `r`'s type was
# Animal instead of Rabbit, 'animal:…' would be printed.
echo r
```
``` console
$ nim c -r oopmacro.nim
woof
70
meow
10
meep
3
rabbit:Fluffy:3
```
