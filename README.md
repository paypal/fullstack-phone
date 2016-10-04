libphonenumber-builder
======================

Custom build system on top of Google libphonenumber to provide compressed version with dynamic regional metadata loading.

Extended from [Nathan Hammond's project](https://github.com/nathanhammond/libphonenumber).

Prerequisites
------------

Ant, Ant-Contrib, and Maven:
```bash
brew install ant
brew install ant-contrib # cf. http://ant-contrib.sourceforge.net/
brew install maven
```

Supporting Tools
---

(Installed by `build.sh`)

* [Google Closure Library](https://github.com/google/closure-library)
* [Google Closure Compiler](https://github.com/google/closure-compiler)
* [Google libphonenumber](https://github.com/googlei18n/libphonenumber)

Usage
-----

If running for the first time, execute:

```bash
./build.sh
```

This clones/updates all the supporting tools (google closure library, closure compiler, and libphonenumber), compiles the closure compiler (using Maven), and runs the libphonenumber builder in this repo using Ant (based on `build.xml`).


Thereafter, unless libphonenumber needs to be updated, execute:

```bash
./build_quick.sh
```

This runs only the Ant compilation tasks in `build.xml`.

Output
------

TODO


How it works
------------

TODO
