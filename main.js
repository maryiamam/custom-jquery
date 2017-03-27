(function (window, undefined) {

    var document = window.document;

    var jQuery = (function () {
        var jQuery = function (selector, context) {
            return new jQuery.fn.init(selector, context);
        };
        var rnonword = /\W/;
        var idExpr = /^#([\w\-]+)$/;
        var classExpr = /^.([\w\-]+)$/;
        var class2type = {};

        jQuery.fn = jQuery.prototype = {
            init: function (selector, context) {
                // Handle $(""), $(null), or $(undefined)
                if (!selector) {
                    return this;
                }

                // Handle $(DOMElement)
                if (selector.nodeType) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }
                // Handle HTML strings
                if (typeof selector === "string") {
                    match = idExpr.exec(selector);
                    // HANDLE: $("#id")
                    if (match && match[0]) {
                        elem = document.getElementById(match[0]);
                        if (elem) {
                            //we inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }
                    match = classExpr.exec(selector);
                    if (match && match[0]) {
                        this.context = document;
                        this.selector = selector;
                        selector = document.getElementsByClassName(selector.substring(1));
                        return jQuery.merge(this, selector);
                    }
                    // HANDLE: $("TAG")
                    if (!context && !rnonword.test(selector)) {
                        this.selector = selector;
                        this.context = document;
                        selector = document.getElementsByTagName(selector);
                        return jQuery.merge(this, selector);
                    }
                }

                return this;
            },

            selector: "",
            length: 0,
            // The number of elements contained in the matched element set
            size: function () {
                return this.length;
            },

            toArray: function () {
                return slice.call(this, 0);
            },

            get: function (num) {
                return num == null ?

                    // Return a 'clean' array
                    this.toArray() :

                    // Return just the object
                    (num < 0 ? this.slice(num)[0] : this[num]);
            },
        };

        jQuery.fn.init.prototype = jQuery.fn;

        jQuery.type = function (obj) {
            return obj == null ?
                String(obj) :
                class2type[toString.call(obj)] || "object";
        };

        jQuery.isFunction = function (obj) {
            return jQuery.type(obj) === "function";
        };

        jQuery.each = function (object, callback, args) {
            var name, i = 0,
                length = object.length,
                isObj = length === undefined || jQuery.isFunction(object);

            if (args) {
                if (isObj) {
                    for (name in object) {
                        if (callback.apply(object[name], args) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.apply(object[i++], args) === false) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if (isObj) {
                    for (name in object) {
                        if (callback.call(object[name], name, object[name]) === false) {
                            break;
                        }
                    }
                } else {
                    for (var value = object[0];
                        i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
                }
            }

            return object;
        };

        jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        jQuery.merge = function (first, second) {
            var i = first.length,
                j = 0;
            if (typeof second.length === "number") {
                for (var l = second.length; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }
            first.length = i;
            return first;
        };

        jQuery.makeArray = function (array, results) {
            var ret = results || [];

            if (array != null) {
                // The window, strings (and functions) also have 'length'
                // The extra typeof function check is to prevent crashes
                // in Safari 2 (See: #3039)
                // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                var type = jQuery.type(array);

                if (array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(array)) {
                    push.call(ret, array);
                } else {
                    jQuery.merge(ret, array);
                }
            }

            return ret;
        };
        var rspaces = /\s+/;

        jQuery.fn.each = function (callback, args) {
            return jQuery.each(this, callback, args);
        };

        jQuery.fn.addClass = function (value) {
            if (value && typeof value === "string") {
                var classNames = (value || "").split(rspaces);

                for (var i = 0, l = this.length; i < l; i++) {
                    var elem = this[i];

                    if (elem.nodeType === 1) {
                        if (!elem.className) {
                            elem.className = value;

                        } else {
                            var className = " " + elem.className + " ",
                                setClass = elem.className;

                            for (var c = 0, cl = classNames.length; c < cl; c++) {
                                if (className.indexOf(" " + classNames[c] + " ") < 0) {
                                    setClass += " " + classNames[c];
                                }
                            }
                            elem.className = setClass.trim();
                        }
                    }
                }
            }
            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    self.addClass(value.call(this, i, self[0].className));
                });
            }
            return this;
        };

        jQuery.fn.html = function (value) {
            var elem;
            if (!value) {
                elem = this[0];
                if (elem.nodeType === 1) {
                    return elem.innerHTML;
                }
            } else {
                if (typeof value === "string") {
                    for (var i = 0, l = this.length; i < l; i++) {
                        elem = this[i];
                        elem.innerHTML = value;
                    }
                }
            }
        };

        jQuery.fn.attr = function (attrName, value) {
            var elem, property;
            if (typeof attrName === "string") {
                elem = this[0];
                if (attrName === 'class') {
                    property = 'className';
                }
                if (attrName === 'name') {
                    property = 'name';
                }
                if (!value) {
                    return elem[property];
                } else {
                    for (var i = 0, l = this.length; i < l; i++) {
                        elem = this[i];
                        elem[property] = value;
                    }
                }
            }
        }

        jQuery.fn.children = function () {
            var elem, children;
            for (var i = 0, l = this.length; i < l; i++) {
                elem = this[i];
                return jQuery(elem.children);
            }
        }

        return (window.jQuery = window.$ = jQuery);
    })();

})(window);

//$('.wrapper').children();