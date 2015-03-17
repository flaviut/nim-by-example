---
title: Templates in macros
---

# Templates in macros

The AST of a template or macro can be retrieved by calling `macros.getAst`:

```nimrod
import macros

macro echoStuff: stmt =
  template echo1 =
    echo(1)

  template echo2 =
    echo(2)

  result = newStmtList(
    getAst(echo1()),
    getAst(echo2())
  )

  # echo result.treeRepr
  # --------------------
  # StmtList
  #   StmtList
  #     Call
  #       Sym "echo"
  #       IntLit 1
  #   StmtList
  #     Call
  #       Sym "echo"
  #       IntLit 2

  # echo result.repr
  # ---------------
  # echo(1)
  # echo(2)

echoStuff()
```
The use of templates should result in a macro that is easier to reason about. Here's an equivalent macro without templates:

```nimrod
import macros

macro echoStuff: stmt =
  result = newStmtList(
    newCall(newIdentNode(!"echo"), newIntLitNode(1)),
    newCall(newIdentNode(!"echo"), newIntLitNode(2))
  )

  # echo result.treeRepr
  # --------------------
  # StmtList
  #   Call
  #     Ident !"echo"
  #     IntLit 1
  #   Call
  #     Ident !"echo"
  #     IntLit 2

  # echo result.repr
  # ----------------
  # echo(1)
  # echo(2)

echoStuff()
```
