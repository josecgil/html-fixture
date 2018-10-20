import HtmlFixture from '../src/html-fixture'

//Missing Tests:
//-isEqual with node
//-Error when?


const nodeIsVisible = domElement => !!( domElement.offsetWidth || domElement.offsetHeight || domElement.getClientRects().length );

const fixture=new HtmlFixture();

beforeEach(() => {
    fixture.create();
});

afterEach(() => {
    fixture.destroy();
});

test("should not create html on new instance", () => {
    const newFixtureInstance=new HtmlFixture();
    const root=newFixtureInstance.rootElement();
    expect(root).toBe(null);
});

test("should be empty when I create an instance", () => {
    const newFixtureInstance=new HtmlFixture();
    expect(newFixtureInstance.isEmpty()).toBeTruthy();
});

test("should be empty when I call create() and not append() content", () => {
    const newFixtureInstance=new HtmlFixture();
    newFixtureInstance.create();
    expect(newFixtureInstance.isEmpty()).toBeTruthy();
});

test("should be empty if I call destroy()", () => {
    const newFixtureInstance=new HtmlFixture();
    newFixtureInstance.create();
    newFixtureInstance.destroy();
    expect(newFixtureInstance.isEmpty()).toBeTruthy();
});

test("should be empty if content is void", () => {
    const newFixtureInstance=new HtmlFixture();
    newFixtureInstance.create();
    newFixtureInstance.append("     ");
    expect(newFixtureInstance.isEmpty()).toBeTruthy();
});

test("should destroy fixture elements on destroy() call", () => {
    const newFixtureInstance=new HtmlFixture();
    newFixtureInstance.create();
    const fixtureId=newFixtureInstance.rootElement().getAttribute("id");
    newFixtureInstance.destroy();
    let root=newFixtureInstance.rootElement();
    expect(root).toBe(null);
    root=document.getElementById(fixtureId);
    expect(root).toBe(null);
});

test("should create an empty _root element at the end of body when create() is called", () => {
    const newFixtureInstance=new HtmlFixture();
    newFixtureInstance.create();
    const root=newFixtureInstance.rootElement();
    expect(root).not.toBeUndefined();
    expect(root).toBe(document.body.lastChild);
    expect(root.children.length).toBe(0);
});

test("should create an unique id on every create()", () => {
    const ids=[];
    for(let i=0; i<100; i++) {
        const fixture=new HtmlFixture();
        fixture.create();
        const id=fixture.rootElement().getAttribute("id");
        expect(ids).not.toContain(id);
        ids.push(id);
        fixture.destroy();
    }
});

test("should destroy old element if create() is called twice without destroy()", () => {
    const fixture=new HtmlFixture();
    fixture.create();
    const oldId=fixture.rootElement().getAttribute("id");
    fixture.create();
    const newId=fixture.rootElement().getAttribute("id");
    expect(newId).not.toBe(oldId);
    const oldElement=document.getElementById(oldId);
    expect(oldElement).toBe(null);
});


test("should create a _root invisible element", () => {
    const root=fixture.rootElement();
    expect(nodeIsVisible(root)).toBeFalsy();
});

test("should append simple html via string", () => {
    fixture.append("<p></p>");
    const root=fixture.rootElement();
    expect(root.children.length).toBe(1);
    expect(root.firstChild.nodeName.toLowerCase()).toBe("p");
});

test("should append complex html via string", () => {
    fixture.append("<p><img/></p><div></div>");
    const root=fixture.rootElement();
    expect(root.children.length).toBe(2);
    const pNode = root.children[0];
    const divNode = root.children[1];
    expect(pNode.nodeName.toLowerCase()).toBe("p");
    expect(divNode.nodeName.toLowerCase()).toBe("div");
    expect(pNode.children.length).toBe(1);
    expect(pNode.firstChild.nodeName.toLowerCase()).toBe("img");
});

test("should append html to a fixture that has html", () => {
    fixture.append("<p></p>");
    fixture.append("<div></div>");
    const root=fixture.rootElement();
    expect(root.children.length).toBe(2);
    const pNode = root.children[0];
    const divNode = root.children[1];
    expect(pNode.nodeName.toLowerCase()).toBe("p");
    expect(divNode.nodeName.toLowerCase()).toBe("div");
});

test("should append html to a fixture via multiline comment in fn", () => {

    const initialHtml=() => {
        /*
         <img/>
         <div></div>
         */
    };

    fixture.append(initialHtml);

    const root=fixture.rootElement();
    expect(root.children.length).toBe(2);
    const imgNode = root.children[0];
    const divNode = root.children[1];
    expect(imgNode.nodeName.toLowerCase()).toBe("img");
    expect(divNode.nodeName.toLowerCase()).toBe("div");
});

test("should append html to a fixture via DOM node", () => {
    const domElement=document.createElement("span");
    fixture.append(domElement);
    const EXPECTED_HTML = '<span></span>';
    expect(fixture.isEqual(EXPECTED_HTML)).toBeTruthy();
});

test("should return fixture as a string", () => {
    const initialHtml="<div><p></p></div><img>";
    fixture.append(initialHtml);
    expect(fixture.asString()).toBe(initialHtml);
});

test("should return fixture as string with attribute values untouched", () => {
    const html='<div id="VALUE"><p></p></div><img>';
    fixture.append(html);
    expect(fixture.asString()).toBe(html);
});

test("should compare fixture to a string", () => {
    const initialHtml="<div><p></p></div><img/>";
    fixture.append(initialHtml);
    expect(fixture.isEqual(initialHtml)).toBeTruthy();
});

test("should compare fixture to a string with spaces", () => {
    const initialHtml="<div>    <p>   </p>   </div>   <img/>";
    fixture.append(initialHtml);
    expect(fixture.isEqual(initialHtml)).toBeTruthy();
});

test("should compare fixture to a multiline comment in fn", () => {
    const initialHtml=() => {
        /*
         <img/>
         <div></div>
         */
    };
    fixture.append(initialHtml);
    expect(fixture.isEqual(initialHtml)).toBeTruthy();
});

test("should compare fixture to a DOM node", () => {
    const domElement=document.createElement("span");
    fixture.append("<span></span>");
    expect(fixture.isEqual(domElement)).toBeTruthy();
});

test("should compare as equal when tags are in upper/lower case", () => {
    const htmlLowerCase="<div><p></p></div><img/>";
    const htmlUpperCase="<DIV><P></P></DIV><IMG/>";
    fixture.append(htmlLowerCase);
    expect(fixture.isEqual(htmlUpperCase)).toBeTruthy();
});

test("should compare as equal fixture when only difference is spaces", () => {
    const html="<div><p></p></div><img/>";
    const htmlWithSpaces="   <div>   <p>    </p>    </div>    <img/>      ";
    fixture.append(html);
    expect(fixture.isEqual(htmlWithSpaces)).toBeTruthy();
});

test("should compare as equal when there are attributes in mixed case", () => {
    const htmlWithAttribInLowercase="<div id='id'><p></p></div><img/>";
    const htmlWithAttribInUppercase="<div ID='id'><p></p></div><img/>";
    fixture.append(htmlWithAttribInUppercase);
    expect(fixture.isEqual(htmlWithAttribInLowercase)).toBeTruthy();
});

test("should compare as equal when there are text between tags", () => {
    const html="<div><p> A text </p> Another text</div><img>";
    fixture.append(html);
    expect(fixture.isEqual(html)).toBeTruthy();
});

test("should return comments in strings", () => {
    const html="<div><!-- a comment --></div>";
    fixture.append(html);
    expect(fixture.asString()).toBe(html);
});

test("should transform entities in strings", () => {
    const html="<p>Acci&oacute;n</p>";
    fixture.append(html);
    expect(fixture.asString()).toBe("<p>Acción</p>");
});

test("should query one DOM Element by Tag", () => {
    const html="<p>1</p><a>2</a><p>3</p>";
    fixture.append(html);
    expect(fixture.elementByTag("p").outerHTML).toBe("<p>1</p>");
});

test("should query one DOM Element by selector", () => {
    const html="<p>1</p><a>2</a><p>3</p>";
    fixture.append(html);
    expect(fixture.elementBySelector("p:first-child").outerHTML).toBe("<p>1</p>");
});

test("should query N DOM Elements by Tag", () => {
    const html="<p>1</p><a>2</a><p>3</p>";
    fixture.append(html);
    const elements = fixture.elementsByTag("p");
    expect(elements.length).toBe(2);
    expect(elements[0].outerHTML).toBe("<p>1</p>");
    expect(elements[1].outerHTML).toBe("<p>3</p>");
});

test("should query N DOM Elements by selector", () => {
    const html="<p>1</p><a>2</a><p>3</p>";
    fixture.append(html);
    const elements = fixture.elementsBySelector("p");
    expect(elements.length).toBe(2);
    expect(elements[0].outerHTML).toBe("<p>1</p>");
    expect(elements[1].outerHTML).toBe("<p>3</p>");
});
