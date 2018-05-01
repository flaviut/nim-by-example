---
title: Procs
---
# Procs

Procedures in Nim are declared using `proc` and require that their parameter and return types be annotated. After the types and parameters, an `=` is used to denote the start of the function body. Another thing to note is that procedures have uniform function call syntax, which means that they can called as both `foo(a, b)` or `a.foo(b)`.

``` nimrod
proc fibonacci(n: int): int =
  if n < 2:
    result = n
  else:
    result = fibonacci(n - 1) + (n - 2).fibonacci
```

## Exporting symbols

<!-- XXX Move into module topic -->
Encapsulation is also supported, not by conventions such as perpending the name with underscores but by annotating a procedure with `*`, which exports it and makes it available for use by modules.

``` nimrod
# module1:
proc foo*(): int = 2
proc bar(): int = 3

# module2:
echo foo()  # Valid
echo bar()  # will not compile
```

## Side effect analyses

Nim provides support for functional programming and so includes the `{.noSideEffect.}` pragma, which statically ensures there are no side effects.

``` nimrod
proc sum(x, y: int): int {. noSideEffect .} =
  x + y

proc minus(x, y: int): int {. noSideEffect .} =
  echo x  # error: 'minus' can have side effects
  x - y
```

## Operators

To create an operator, the symbols that are to be used must be encased inside `` ` ``s to signify they are operators.

``` nimrod
proc `$`(a: array[2, array[2, int]]): string =
  result = ""
  for v in a:
    for vx in v:
      result.add($vx & ", ")
    result.add("\n")

echo([[1, 2], [3, 4]])  # See varargs for
                        # how echo works

proc `^&*^@%`(a, b: string): string =
  ## A confusingly named useless operator
  result = a[0] & b[high(b)]

assert("foo" ^&*^@% "bar" == "fr")

``` 

## Generic Functions

<!-- XXX Needs own section -->
Generic functions are like C++'s templates and allow for the same statically checked duck-typing semantics as templates. 

``` nimrod
# Treesort, but in Nim

# Tree Node
# Nodes in a tree represented with a ref object type. Left
# and right with point to subtrees, leaves, or nil. 
type TNode*[T] = ref object
    data: T
    left, right: TNode[T]

# TNode ctor
# Constructs a new TNode object.
proc newNode*[T](data: T): TNode[T] = 
    new(result)
    result.data = data

# insertSub
# Inserts a given node as a left or right child of a parent.
proc insertSub*[T](node: var TNode[T], data: T): void = 
    if (data < node.data):
        if (node.left == nil):
            node.left = newNode(data)
            #echo "Inserted: " & $data
        else:
            insert(node.left, data)
    else:
        if (node.right == nil):
            node.right = newNode(data)
            #echo "Inserted: " & $data
        else:
            insert(node.right, data)

# insert
# Sets a given node as root if root is nil, or as a subtree
# otherwise.
proc insert*[T](root: var TNode[T], data: T): void =
    #echo "Inserting: " & $data
    if (root == nil):
        root = newNode(data)
        #echo "Inserted: " & $data
    else:
        root.insertSub(data)

# inorderTraverseCopy
# Performs an inorder traversal of a given tree and copies 
# the values into a sequence.
proc inorderTraverseCopy*[T](node: TNode[T]): seq[T] = 
    if (node == nil): 
        @[]
    else: 
        inorderTraverseCopy(node.left) & @[node.data] & inorderTraverseCopy(node.right)

# treesort
# Takes a range which it inserts into a tree, which then is
# traversed inorder and returns a sequence of values returned
# from the traversal, which is a sorted sequence.
proc treesort*[T](range: var seq[T]): seq[T] = 
    var root: TNode[T]
    for i in range.low()..range.high():
        root.insert(range[i])

    result = newSeq[T](range.len())
    result = inorderTraverseCopy(root)


proc main(): void = 
    echo "********** Treesort Demo **********"

    var range = @[2, 5, 4, 6, 8, 1, 3, 7, 0, 9]
    echo "Range to sort: " & $range

    range = treesort(range)

    echo "Range sorted: " & $range & "\n"

    echo "Ints are cool, but what about floats?"
    var range2 = @[49.2, 49.4, 49.6, 49.3, 49.05, 49.1, 45.5]
    echo "Range to sort: " & $range2

    range2 = treesort(range2)

    echo "Range sorted: " & $range2 & "\n"

    echo "Numbers are neat, but will it work for chars?"
    var rangeChar = @['d', 'r', 'f', 'y', 'e', 't', 'm', 'k']
    echo "Range to sort: " & $rangeChar

    rangeChar = treesort(rangeChar)

    echo "Range sorted: " & $rangeChar & "\n"

    echo "Strings even!"
    var rangeString = @["Paul", "Percy", "Buttermilk", "Nutmeg", "Hamsters"]
    echo "Range to sort: " & $rangeString

    rangeString = treesort(rangeString)

    echo "Range sorted: " & $rangeString & "\n"


main()
```
