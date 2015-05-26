---
title: Getting Started
---
# Getting Started
When installing Nim, you have two options: downloading a copy directly from git, or downloading a prepackaged distribution from the website

## Downloading a Nim Distribution
To get started with Nim, head over to the [downloads page](http://nim-lang.org/download.html) and download the version you'd like.

The Windows distribution comes with the MinGW compiler, which is recommended, but if you'd like to use your own compiler, download the version without MinGW. If you get an error like `Error: unhandled exception: The system cannot find the file specified.`, then make sure that the C compiler is on your path.

On Mac and Linux, it is recommended to use either GCC or Clang.

Once you have downloaded the appropriate distribution and extracted the files somewhere convenient, feel free to place the `bin` directory in the path for easier access.

## Downloading from Git
To install Nim from git, ensure that you have gcc installed on Windows, Linux, and BSDs and clang on Mac. Afterwards, run the following series of commands to download and bootstrap Nim:

```console
$ git clone -b master git://github.com/Araq/Nim.git
$ cd Nim
$ git clone --depth 1 git://github.com/nim-code/csources
$ cd csources
$ sh build.sh # Replace with build.bat on windows
$ cd ..
$ bin/nim c koch
$ ./koch boot -d:release
```

Once compiled, you may want to add the `bin` directory to your path for easy access.
