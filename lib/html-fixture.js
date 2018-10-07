"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HtmlFixture = function () {
    function HtmlFixture() {
        _classCallCheck(this, HtmlFixture);

        this.root = null;
    }

    _createClass(HtmlFixture, [{
        key: "create",
        value: function create() {
            if (this.root != null) {
                this.destroy();
            }
            var div = document.createElement("div");
            div.setAttribute("id", "html-fixture-" + this._newGUID());
            div.setAttribute("style", "display:none");
            this.root = document.body.appendChild(div);
        }
    }, {
        key: "_newGUID",
        value: function _newGUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0;
                var v = c == 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.root.parentNode.removeChild(this.root);
            this.root = null;
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            if (this.root == null) return true;
            if (this.root.innerHTML.trim().length === 0) return true;
            return false;
        }
    }, {
        key: "getRootDOMElement",
        value: function getRootDOMElement() {
            return this.root;
        }
    }, {
        key: "_parseFunctionComment",
        value: function _parseFunctionComment(fn) {
            var reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//;
            var match = reCommentContents.exec(fn.toString());
            if (!match) {
                throw new TypeError('Multiline comment missing.');
            }
            return match[1];
        }
    }, {
        key: "_isFunction",
        value: function _isFunction(param) {
            return typeof param === 'function';
        }
    }, {
        key: "_isDomNode",
        value: function _isDomNode(param) {
            return param.outerHTML != undefined;
        }
    }, {
        key: "_paramToString",
        value: function _paramToString(param) {
            if (this._isFunction(param)) {
                return this._parseFunctionComment(param);
            }

            if (this._isDomNode(param)) {
                return param.outerHTML;
            }
            return param.toString();
        }
    }, {
        key: "_parseHTML",
        value: function _parseHTML(str) {
            var tmp = document.implementation.createHTMLDocument();
            tmp.body.innerHTML = str;
            return tmp.body.children;
        }
    }, {
        key: "add",
        value: function add(param) {
            var html = this._paramToString(param);
            return this.root.innerHTML = this.root.innerHTML + html;
        }
    }, {
        key: "_replaceAll",
        value: function _replaceAll(str, search, replacement) {
            return str.replace(new RegExp(search, 'g'), replacement);
        }
    }, {
        key: "_replaceAllDoubleSpaces",
        value: function _replaceAllDoubleSpaces(str) {
            var oldLength = void 0;
            var newLength = void 0;
            do {
                oldLength = str.length;
                str = this._replaceAll(str, "  ", " "); //double spaces
                newLength = str.length;
            } while (oldLength != newLength);
            return str;
        }
    }, {
        key: "_replaceSpacesBetweenTags",
        value: function _replaceSpacesBetweenTags(str) {
            return this._replaceAll(str, "> <", "><");
        }
    }, {
        key: "_normalizeHtml",
        value: function _normalizeHtml(html) {
            var normalizedHtml = "";
            var nodes = this._parseHTML(html);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var node = _step.value;

                    normalizedHtml = normalizedHtml + node.outerHTML;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            normalizedHtml = this._replaceAllDoubleSpaces(normalizedHtml);
            normalizedHtml = this._replaceSpacesBetweenTags(normalizedHtml);
            return normalizedHtml;
        }
    }, {
        key: "isEqual",
        value: function isEqual(param) {
            var myHtml = this._normalizeHtml(this.root.innerHTML);
            var otherHtml = this._paramToString(param);
            otherHtml = this._normalizeHtml(otherHtml);
            return myHtml === otherHtml;
        }
    }, {
        key: "asString",
        value: function asString() {
            return this._normalizeHtml(this.root.innerHTML);
        }
    }]);

    return HtmlFixture;
}();

exports.default = HtmlFixture;
;