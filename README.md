This repo contains the sources for the Nim by Example book.

If you'd like, use `nanoc` to build. However, its easiest to simply write things and wait for the webpage at http://nim-by-example.github.io/ to update.

## Building

First, make sure that you have the following dependencies installed and on your PATH:

- [Pygments](https://pygments.org/)
- Ruby & Bundler

Then, to build & run the site, use:

```console
$ bundle config set --local path 'vendor/bundle'
$ bundle install
$ bundler exec nanoc
$ bundler exec nanoc view
```
