(function(window, undefined) {
    var document = window.document;

    var qHint = (function(name, sourceFile, options) {

        var qHintAjaxError = function (message) {
            start();
            ok(false, 'Ajax error: ' + message);
        };


        // now I check which JS Library is on to make the ajax request
        var callback = function(sourceFile) {
            var isPrototype    = (window.Prototype && window.Prototype.version
                                && window.Ajax && typeof window.Ajax.Request === 'function'), // Prototype should be loaded without losing the Ajax object
                isjQuery   = (window.jQuery && typeof jQuery.ajax === 'function'),
                isDojo     = (window.dojo && typeof dojo.xhrGet === 'function'),
                isMootools = (window.Request && typeof window.Request.HTML);

            var cbPrototype = function(sourceFile) {
                return new Ajax.Request( sourceFile, {
                   onSuccess : function(transport) {
                       start();
                       validateFile(transport.responseText);
                   },
                   onError : function(message) {
                       qHintAjaxError(message);
                   }
                });
            },
            cbjQuery = function(sourceFile) {
                jQuery.ajax({
                    url: sourceFile,
                    success: function(source) {
                        start();
                        validateFile(source);
                    },
                    error: function(a, b, message) {
                        qHintAjaxError(message);
                    }

                });
            },
            cbDojo = function(sourceFile) {
                dojo.xhrGet({
                    url: sourceFile,
                    load: function(source) {
                        start();
                        validateFile(source);
                    },
                    error: function(message) {
                        qHintAjaxError(message);
                    }
                });
            },
            cbMootools = function(sourceFile) {
                var MooToolsRequest = Request({
                    url: sourceFile,
                    onSuccess: function(source) {
                        start();
                        validateFile(source);
                    },
                    onFailure: function(message) {
                        qHintAjaxError(message);
                    }
                });

                MooToolsRequest.send();
            };


            return ( (isjQuery && cbjQuery) || (isDojo && cbDojo) || (isPrototype && cbPrototype) || (isMootools && cbMootools) );

        };

        function validateFile(source) {
            var i, len, err,
                    result = JSHINT(source, options);

            expect(1); // You should aways expect 1 test, you should WIN!

            ok(result, "qHint got the source file, if you see more errors you're not a Jedi yet");

            if (result) {
                return;
            }

            for (i = 0,len = JSHINT.errors.length; i < len; i++) {
                err = JSHINT.errors[i];
                if (!err) {
                    continue;
                }

                ok(false, err.reason
                        + " on line " + err.line
                        + ", character " + err.character);
            }
        }

        // defining the test routine
        var jsHintTest = function (name, sourceFile, options) {


            return asyncTest(name, function() {
                callback()(sourceFile);
            });
        };


        return jsHintTest;

    })();

    window.qHint = qHint;


//    module("jsHint tests");
//    jsHintTest("File that adheres to style guidelines", "demoScripts/pass.js");
//    jsHintTest("File without any style", "demoScripts/fail.js");


})(window);