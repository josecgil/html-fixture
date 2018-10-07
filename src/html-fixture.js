export default class HtmlFixture {
    constructor() {
        this.root=null;
    }

    create() {
        if (this.root!=null) {
            this.destroy();
        }
        const div = document.createElement("div");
        div.setAttribute("id",`html-fixture-${this._newGUID()}`);
        div.setAttribute("style","display:none");
        this.root=document.body.appendChild(div);
    }

    _newGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    destroy() {
        this.root.parentNode.removeChild(this.root);
        this.root=null;
    }

    isEmpty() {
        if (this.root == null) return true;
        if (this.root.innerHTML.trim().length===0) return true;
        return false;
    }

    getRootElement() {
        return this.root;
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

    add(param) {
        const html=this._paramToString(param);
        return this.root.innerHTML=this.root.innerHTML+html;
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
        const myHtml=this._normalizeHtml(this.root.innerHTML);
        let otherHtml=this._paramToString(param);
        otherHtml=this._normalizeHtml(otherHtml);
        return myHtml===otherHtml;
    }

    asString() {
        return this._normalizeHtml(this.root.innerHTML);
    }
}