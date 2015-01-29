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
method vocalizeAnimal(this: Animal): string = "..."
method ageHumanYrs(this: Animal): int = this.age

type Dog = ref object of Animal
method vocalize(this: Dog): string = "woof"
method ageHumanYrs(this: Dog): int = this.age * 7

type Cat = ref object of Animal
method vocalize(this: Cat): string = this.vocalize_animal() & "meow"
method vocalizeCat(this: Cat): string = this.vocalize_animal() & "meow"

type Tiger = ref object of Cat
method vocalize(this: Tiger): string = this.vocalize_animal() & "Rawr!"
```

All these typedefs, `this: T` parameters, and extra methods are repetitive, so it'd be good to write a macro to mask them. Something like this would be best:

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
  method vocalize: string =
      # call the base class method
      this.vocalize_animal() & "meow"

class Tiger of Cat:
  method vocalize: string =
      # no need for super.super!
      this.vocalize_animal() & "Rawr!"
```

To get that nice notation, we can use a macro. Note that this looks pretty complicated, and it is, but it will give us almost full OOP capabilities like other languages such as Java and Python. Here's the macro in all it's glory:

```nimrod
import macros

macro class*(head: expr, body: stmt): stmt {.immediate.} =
  # The macro is immediate so that it doesn't
  # resolve identifiers passed to it

  # object reference name inside methods.
  # ie: self, this
  let obj_reference = "this"

  var typeName, baseName: PNimrodNode

  if head.kind == nnkIdent:
    # `head` is expression `typeName`
    # echo head.treeRepr
    # --------------------
    # Ident !"Animal"
    typeName = head

  elif head.kind == nnkInfix and $head[0] == "of":
    # `head` is expression `typeName of baseClass`
    # echo head.treeRepr
    # --------------------
    # Infix
    #   Ident !"of"
    #   Ident !"Animal"
    #   Ident !"TObject"
    typeName = head[1]
    baseName = head[2]

  else:
    quit "Invalid node: " & head.lispRepr

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

  # create a new stmtList for the result
  result = newStmtList()

  # var declarations will be turned into object fields
  var recList = newNimNode(nnkRecList)

  # Make forward declarations so that function order
  # does not matter, just like in real OOP!
  for node in body.children:
    case node.kind:
      of nnkMethodDef, nnkProcDef:
        # inject `this: T` into the arguments
        let n = copyNimTree(node)
        n.params.insert(1, newIdentDefs(ident(obj_reference), typeName))
        # clear the body so we only get a
        # declaration
        n.body = newEmptyNode()
        result.add(n)

        # forward declare the inheritable method
        let n2 = copyNimTree(n)
        let proc_name = $(n2.name.toStrLit())
        let type_name = $(typeName.toStrLit())
        let new_name = ident(proc_name & type_name)
        n2.name = new_name
        result.add(n2)
      else:
          discard

  # Iterate over the statements, adding `this: T`
  # to the parameters of functions
  for node in body.children:
    case node.kind:
      of nnkMethodDef, nnkProcDef:
        # inject `this: T` into the arguments
        let n = copyNimTree(node)
        n.params.insert(1, newIdentDefs(ident(obj_reference), typeName))

        # Copy the proc or method for inheritance
        # ie: procName_ClassName()
        let n2 = copyNimTree(node)
        n2.params.insert(1, newIdentDefs(ident(obj_reference), typeName))
        let proc_name = $(n2.name.toStrLit())
        let type_name = $(typeName.toStrLit())
        let new_name = ident(proc_name & type_name)
        n2.name = new_name
        result.add(n2)

        # simply call the class method from here
        # proc procName=
        #    procName_ClassName()
        var p: seq[PNimrodNode] = @[]
        for i in 1..n.params.len-1:
            p.add(n.params[i][0])
        n.body = newStmtList(newCall(proc_name & type_name, p))

        result.add(n)

      of nnkVarSection:
        # variables get turned into fields of the type.
        for n in node.children:
          recList.add(n)
      else:
        result.add(node)

  # The following prints out the AST structure:
  #
  # import macros
  # dumptree:
  #   type X = ref object of Y
  #     z: int
  # --------------------
  # TypeSection
  #   TypeDef
  #     Ident !"X"
  #     Empty
  #     RefTy
  #       ObjectTy
  #         Empty
  #         OfInherit
  #           Ident !"Y"
  #         RecList
  #           IdentDefs
  #             Ident !"z"
  #             Ident !"int"
  #             Empty

  var type_decl: PNimrodNode
  if baseName == nil:
    type_decl = quote do:
      type `typeName` = ref object of RootObj
  else:
    type_decl = quote do:
      type `typeName` = ref object of `baseName`

  # Inspect the tree structure:
  #
  # echo type_decl.treeRepr
  # --------------------
  #   StmtList
  #     TypeSection
  #       TypeDef
  #         Ident !"Animal"
  #         Empty
  #         RefTy
  #           ObjectTy
  #             Empty
  #             OfInherit
  #               Ident !"TObject"
  #             Empty   <= We want to replace this
  type_decl[0][0][2][0][2] = recList
  result.insert(0, type_decl)
  
  # Lets inspect the human-readable version of the output
  # echo repr(result)
  # Output:
  #  type 
  #    Animal = ref object of RootObj
  #      name: string
  #      age: int
  #
  #  method vocalize(this: Animal): string
  #  method vocalizeAnimal(this: Animal): string   <= this is the magic for calling base class methods
  #  method age_human_yrs(this: Animal): int
  #  method age_human_yrsAnimal(this: Animal): int <= this is the magic for calling base class methods
  #   method vocalize(this: Animal): string = 
  #     "..."
  #
  #  method vocalizeAnimal(this: Animal): string = 
  #    "..."
  #
  #  method age_human_yrs(this: Animal): int = 
  #    this.age
  #
  #  method age_human_yrsAnimal(this: Animal): int = 
  #    this.age
  #
  #
  #  type 
  #    Dog = ref object of Animal
  #  
  #  method vocalize(this: Dog): string
  #  method vocalizeDog(this: Dog): string
  #  method age_human_yrs(this: Dog): int
  #  method age_human_yrsDog(this: Dog): int
  #  method vocalize(this: Dog): string = 
  #    "woof"
  #
  #  method vocalizeDog(this: Dog): string = 
  #    "woof"
  #
  #  method age_human_yrs(this: Dog): int = 
  #    this.age * 7
  #
  #  method age_human_yrsDog(this: Dog): int = 
  #    this.age * 7
  #
  #
  #  type 
  #    Cat = ref object of Animal
  #  
  #  method vocalize(this: Cat): string
  #  method vocalizeCat(this: Cat): string
  #  method vocalize(this: Cat): string = 
  #    this.vocalize_animal() & "meow"
  #
  #  method vocalizeCat(this: Cat): string = 
  #    this.vocalize_animal() & "meow"
  #
  #
  #  type 
  #    Tiger = ref object of Cat
  #  
  #  method vocalize(this: Tiger): string
  #  method vocalizeTiger(this: Tiger): string
  #  method vocalize(this: Tiger): string = 
  #    this.vocalize_animal() & "Rawr!"
  #
  #  method vocalizeTiger(this: Tiger): string = 
  #    this.vocalize_animal() & "Rawr!"


class Animal of RootObj:
  var name: string
  var age: int
  method vocalize: string = "..."
  method age_human_yrs: int = this.age # `this` is injected

class Dog of Animal:
  method vocalize: string = "woof"
  method age_human_yrs: int = this.age * 7

class Cat of Animal:
  method vocalize: string =
      # call the base class method
      this.vocalize_animal() & "meow"

class Tiger of Cat:
  method vocalize: string =
      # no need for super.super!
      this.vocalize_animal() & "Rawr!"

var animals: seq[Animal] = @[]
animals.add(Dog(name: "Sparky", age: 10))
animals.add(Cat(name: "Mitten", age: 10))
animals.add(Tiger(name: "Jean", age: 2))

for a in animals:
  echo a.name, " says ", a.vocalize()
  echo a.age_human_yrs()
```
``` console
$ nim c -r oopmacro.nim
Sparky says woof
70
Mitten says ...meow
10
Jean says ...Rawr!
2
```
