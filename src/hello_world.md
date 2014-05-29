# Hello World

The code for a simple hello world program is as follows:

``` nimrod
echo "Hello World"
```

To compile and execute the program, the following command should be run

```
$ nimrod c -r ./helloworld.nim
Hello World
```

The command has several elements:

* `c` is an alias for `compile`, which compiles the Nimrod sources into C and then invokes the C compiler on them
* `-r` is an alias for `--run`, which runs the program
* `./helloworld.nim` is the path to the source you want to compile