---
title: JSON
---
# JSON

Nim's `json` module allows you to work with JSON data.

## Converting Data Into JSON

The `json` module provides the `%*` operator which is used to create JSON objects. Note the use of the `$` operator to convert the JsonObject to its string representation.

``` nim
import json

let element = "Hydrogen"
let atomicNumber = 1

let jsonObject = %* {"element": element, "atomicNumber": atomicNumber}
# This will print {"element":"Hydrogen", "atomicNumber": 1}
echo $jsonObject
```

## Parsing and accessing JSON

``` nim
import json

# We start with a string representation of a JSON object
let jsonObject = """{"name": "Sky", "age": 32}"""
let jsonArray = """[7, 8, 9]"""

let parsedObject = parseJson(jsonObject)
let name = parsedObject["name"].getStr()
# This will print Sky
echo name

let parsedArray = parseJson(jsonArray)
let eight = parsedArray[1].getInt()
# This will print 8
echo eight
```

The `parseJson` method takes in a string representing a JSON object or array and transforms it into a `JsonNode`. We can access the fields of a JsonNode object using the `[]` syntax.

The procs `getInt`, `getFloat`, `getStr` and `getBool` are used for converting JsonNode's into Nim data types.

## Parsing JSON into a Nim Object

In some cases you may want to convert from a JSON string directly to an object.

``` nim
import json

# First we'll define our types
type
  Element = object
    name: string
    atomicNumber: int


# Let's say this is the JSON we want to convert
let jsonObject = parseJson("""{"name": "Carbon", "atomicNumber": 6}""")

let element = to(jsonObject, Element)
# This will print Carbon
echo element.name
# This will print 6
echo element.atomicNumber
```

See the [json module documentation](https://nim-lang.org/docs/json.html) for more information.
