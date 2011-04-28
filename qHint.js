(function(window, undefined) {
    var document = window.document;

    var qHint = (function(name, sourceFile, options) {

        var qHintAjaxError = function (message) {
            start();
            ok(false, 'Ajax error: ' + message);
        };


        // now I check which JS Library is on to make the ajax request
        var callback = function(sourceFile) {
            var isjQuery   = (window.jQuery && typeof jQuery.ajax === 'function'),
                isDojo     = (window.dojo && typeof dojo.xhrGet === 'function'),

                cbjQuery = function(sourceFile) {
                    jQuery.ajax({
                        url: sourceFile,
                        success: validateFile,
                        error: function(a, b, message) {
                            qHintAjaxError(message);
                        }

                    });
                },
                cbDojo = function(sourceFile) {
                    dojo.xhrGet({
                        url: sourceFile,
                        load: validateFile,
                        error: qHintAjaxError
                    });
                },

                pureAjax = function(sourceFile) { // I don't prefer this, but it's a pure ajax handler
                    var ajaxRequest;

                    try {
                        ajaxRequest = new XMLHttpRequest();
                    } catch (can) {
                        try {
                            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
                        } catch (haz) {
                            try {
                                ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
                            } catch (cheezburger) {
                                qHintAjaxError('There\'s no AJAX in your browser that I handle yet, try enabling jQuery or Dojo');
                                return false;
                            }
                        }
                    }
                    ajaxRequest.onreadystatechange = function() {
                        if (ajaxRequest.readyState === 4) {
                            if ( ajaxRequest.status === 200 ) {
                                validateFile(ajaxRequest.responseText);
                            } else {
                                qHintAjaxError(ajaxRequest.statusText);
                            }
                        }
                    };
                    ajaxRequest.open("GET", sourceFile, true);
                    ajaxRequest.send(null);
                };

            return ( (isjQuery && cbjQuery) || (isDojo && cbDojo) || pureAjax );
        };

        function validateFile(source) {
            var i, len, err,
                    result = JSHINT(source, options);

            start();

            expect(1); // You should aways expect 1 test, you should WIN!

            ok(result, "qHint got the source file, if you see this as an error you're not a Jedi yet, young padawan");

            if (result) {
                return;
            }

            for (i = 0,len = JSHINT.errors.length; i < len; i++) {
                err = JSHINT.errors[i];
                if (!err) {
                    continue;
                }

                ok(false, err.reason + " on line " + err.line + ", character " + err.character);
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

})(window);