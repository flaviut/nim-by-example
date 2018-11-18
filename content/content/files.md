---
title: Files
---
# Files

## Reading from a File

Suppose we have a file in the same directory as our nim program, `kittens.txt` with the following contents.

```
Spitfire
Vivian
Motor
```

We can use the `readFile` proc to read the entire file into memory.

``` nimrod
# This will read the entire file into the string entireFile
let entireFile = readFile("kittens.txt")
echo entireFile  # prints the entire file
```

We can also read the lines of a file by opening a `File` object and using the `readLine` proc to read individual lines.

``` nimrod
let f = open("kittens.txt")
# Close the file object when you are done with it
defer: f.close()

let firstLine = f.readLine()
echo firstLine  # prints Spitfire
```

## Writing to a File

We can write a string to a file using the `writeFile` proc.

``` nimrod
let text = "Cats are very cool!"
writeFile("cats.txt", text)
```

This will create a file on the system named `cats.txt` containing "Cats are very cool!"

We can also write a file line by line using a `File` object and the `writeLine` proc.

``` nimrod
let lines = ["Play", "Eat", "Sleep"]
# The fmWrite constant specifies that we are opening the file for writing.
let f = open("catactivities.txt", fmWrite)
defer: f.close()

for line in lines:
  f.writeLine(line)
```

After running this program there should be a file called `catactivities.txt` with the following contents.

```
Play
Eat
Sleep
```
