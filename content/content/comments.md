---
title: Comments
---
# Comments

Comments in Nim begin with the hash character. 

```nimrod
# This is a comment
echo "This is code" # This is another comment
```

Multiline or block comments begin with the hash and square bracket, `#[`, and are terminated with a closing square bracket followed by a hash, `]#`. Multi line comments can be nested.

```nimrod
#[ This is a multi line comment
it continues until it is terminated
]#
echo "This is code"
```
