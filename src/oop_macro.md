<!--- Thanks to fowl for creating this page -->

# OOP Macro
This is the code that we currently must write to use OOP in nimrod:
```nimrod
type Animal =
  ref object {.inheritable.}
    name: string
method vocalize(self: Animal): string = "..."

type Dog =
  ref object of Animal
    lastRabiesDate: int
method vocalize(self: Dog): string = "woof"

type Cat = ref object of Animal
method vocalize(self: Cat): string = "meow"
```

All these typedefs and `self: T` parameters are repetitive, so it'd be good to write a macro to mask them. Something like this would be best:

```nimrod
class(Animal of TObject):
  var name: string
  method vocalize: string = "..."

class(Dog of Animal):
  var lastRabiesDate: int
  method vocalize: string = "woof"

class(Cat of Animal):
  method vocalize: string = "meow"

# a short test (used later)
proc run_test() =
  var pets: seq[Animal] = @[]
  pets.add Cat(name: "meowth")
  pets.add Dog(name: "ruffles")
  assert(@["meow", "woof"] == @[pets[0].vocalize,
                                pets[1].vocalize])
```

```nimrod
import macros

macro class*(): stmt {.immediate.} =
  # The macro is immediate so that it doesn't
  # resolve identifiers passed to it

  let cs = callsite()
  var
    class_name, in_stmts: PNimrodNode
    superclass: PNimrodNode

  # Manual parsing of arguments. Here we expect
  # a class name and attached stmts list
  if cs[1].kind == nnkInfix and $cs[1][0] == "of":
    # the expression is "class_name" of "superclass"
    # echo cs[1].treerepr
    # -------------------
    # Infix
    #   Ident !"of"
    #   Ident !"Animal"
    #   Ident !"TObject"

    class_name = cs[1][1]
    superclass = cs[1][2]
  else:
    class_name = cs[1]

  in_stmts = cs[2]

  if in_stmts.kind != nnkStmtList:
    quit "Malformed arguments for class() macro: expected nnkStmtList, got " &
      lisprepr(in_stmts)
  assert class_name.kind == nnkIdent

  # echo treerepr(class_name)
  # -----------------------------------------
  # Ident !"Animal"

  # echo treerepr(in_stmts)
  # ----------------------------------
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

  result = newStmtList()
  result.add newEmptyNode()
  # create a new stmtList for the result,
  # the first slot is a placeholder
  # the type definition we generate

  var rec_list = newNimNode(nnkRecList)
  # var declarations will be turned into object fields

  # Iterate over the statements, adding `self: T`
  # to the parameters of functions
  for node in children(in_stmts):
    case node.kind
    of nnkMethodDef, nnkProcDef:
      # inject self:T into the arguments
      let p = node.params.copyNimTree
      p.insert(1, newIdentDefs(ident"self", class_name))
      node.params = p
      result.add node

    of nnkVarSection:
      # variables get turned into fields on the type,
      # isn't that neat?
      # here we just collect them though
      for N in children(node):
        assert n.kind == nnkIdentDefs, "Invalid node " & lispRepr(N)
        rec_list.add N

    else:
      result.add node

  # The following prints out the AST structure:
  #
  # import macros
  # dumptree:
  #   type X = ref object of Y
  #     z: int
  # --------------------------
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

  var obj_ty = newNimNode(nnkObjectTy).add(
    newEmptyNode(),
    (if superclass.isNil: newEmptyNode() else: newNimNode(nnkOfInherit).add(superclass)),
    rec_list
  )
  result[0] = newNimNode(nnkTypeSection).add(
    newNimNode(nnkTypeDef).add(
      class_name,
      newEmptyNode(),
      newNimNode(nnkRefTy).add(obj_ty)
  ))

  # Lets inspect the human-readable version of the output
  # echo repr(result)
  # Output:
  #  type
  #    Animal = ref object of TObject
  #      name: string
  #      age: int
  #
  #  method vocalize(self: Animal): string =
  #    "..."
  #
  #  method age_human_yrs(self: Animal): int =
  #    self.age

  # more could be done here, it could be made an
  # option to use ref types, export type names, etc


class(Animal of TObject):
  var
    name: string
    age: int
  method vocalize: string = "..."
  method age_human_yrs: int = self.age
    # self is injected

class(Dog of Animal):
  method vocalize: string = "woof"
  method age_human_yrs: int = self.age * 7

class(Cat of Animal) do:
  method vocalize: string = "meow"

run_test()
echo "Tests passed!"
```