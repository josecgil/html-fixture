"use strict";

class HtmlFixture {
    constructor() {
        this._root=null;
    }

    create() {
        if (this._root!=null) {
            this.destroy();
        }
        const div = document.createElement("div");
        div.setAttribute("id",`html-fixture-${this._newGUID()}`);
        div.setAttribute("style","display:none");
        this._root=document.body.appendChild(div);
    }

    _newGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    destroy() {
        this._root.parentNode.removeChild(this._root);
        this._root=null;
    }

    isEmpty() {
        if (this._root == null) return true;
        if (this._root.innerHTML.trim().length===0) return true;
        return false;
    }

    rootElement() {
        return this._root;
    }

    elementByTag(tagName) {
        return this._root.getElementsByTagName(tagName)[0];
    }

    elementBySelector(selector) {
        return this._root.querySelector(selector);
    }

    elementsByTag(tagName) {
        return this._root.getElementsByTagName(tagName);
    }

    elementsBySelector(selector) {
        return this._root.querySelectorAll(selector);
    }

    _parseFunctionComment(fn) {
        const reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//;
        const match = reCommentContents.exec(fn.toString());
        if (!match) { throw new TypeError('Multiline comment missing.'); }
        return match[1];
    }

    _isFunction(param) {
        return typeof param === 'function';
    }

    _isDomNode(param) {
        return param.outerHTML != undefined;
    }

    _paramToString(param) {
        if (this._isFunction(param)) {
            return this._parseFunctionComment(param);
        }

        if (this._isDomNode(param)) {
            return param.outerHTML;
        }
        return param.toString();
    }

    _parseHTML(str) {
        const tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = str;
        return tmp.body.children;
    }

    append(param) {
        const html=this._paramToString(param);
        return this._root.innerHTML=this._root.innerHTML+html;
    }

    _replaceAll(str, search, replacement) {
        return str.replace(new RegExp(search, 'g'), replacement);
    }

    _replaceAllDoubleSpaces(str) {
        let oldLength;
        let newLength;
        do {
            oldLength = str.length;
            str = this._replaceAll(str, "  ", " "); //double spaces
            newLength = str.length;
        } while (oldLength != newLength);
        return str;
    }

    _replaceSpacesBetweenTags(str) {
        return this._replaceAll(str, "> <", "><");
    }

    _normalizeHtml(html) {
        let normalizedHtml="";
        const nodes=this._parseHTML(html);

        for (const node of nodes) {
            normalizedHtml=normalizedHtml+node.outerHTML;
        }

        normalizedHtml = this._replaceAllDoubleSpaces(normalizedHtml);
        normalizedHtml = this._replaceSpacesBetweenTags(normalizedHtml);
        return normalizedHtml;
    }

    isEqual(param) {
        const myHtml=this._normalizeHtml(this._root.innerHTML);
        let otherHtml=this._paramToString(param);
        otherHtml=this._normalizeHtml(otherHtml);
        return myHtml===otherHtml;
    }

    asString() {
        return this._normalizeHtml(this._root.innerHTML);
    }
};

module.exports=HtmlFixture;