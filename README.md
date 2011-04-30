#qHint - Integrating jsHint into qUnit

this is a fork from @gyoshev repo's that's integrates jsHint to qUnit.

This small script lets you integrate jsHint coding style validation into your qUnit unit tests. For more information, see the blog post [Enforcing coding conventions with jsHint and qUnit](http://blog.gyoshev.net/2011/04/enforcing-coding-conventions-with-jshint-and-qunit)

##Usage

1. Include the `qhint.js` file after qUnit and before calling it.

2. Call the `qHint` function like this:

    `qHint(*name*, *file* [, *options*]);`

 
