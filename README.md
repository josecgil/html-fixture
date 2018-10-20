# html-fixture
A small JS library to create html test fixtures in an easy way

A quick example:
```
  const HtmlFixture=require('html-fixture');  //or import

  const htmlFixture=new HtmlFixture();
  htmlFixture.create();
  htmlFixture.append("<p>1</p>");
  htmlFixture.append("<a>2</a><p>3</p>");
  

  const allDomElementsP=htmlFixture.elementsByTag("p");
  const onlyfirstP=htmlFixture.elementBySelector("p:first-child");

  htmlFixture.destroy();
```

This package exposes a class to manipulate and query an htmlFixture, the intended use is in testing

All methods:

*```create()```*

  Creates a div in DOM to hold all the rest of the html fixture (you append html with the ```append``` method)
  All the content in the fixture is always inside this DOM.
  You can get this DOMElement with the ``rootElement``` method.
  
  If you execute create() twice without calling ```destroy()`` on the the same instance if automatically calls ```destroy```
  
  The div element created is invisible ("display:none") and contains an attribute id="html-fixture-"+GUID

*```destroy()```*

  Removes the div in DOM inserted by ```create()```
  
```append(string|DOMElement|function)```

  appends the html in the param to the fixture.
  
  append accepts either an string with the html: 
  
  ```
    htmlFixture.append("<a href='http://example.com'>Example</a>");  
  ```
  
  a DOMElement:
  
  ```
      const domElement=document.createElement("span");
      htmlFixture.append(domElement);
  ```
  
  a function with a comment and the html inside the comment:
  
  ```
      var INITIAL_HTML=function(){/*
           <img src="images/test1.jpg">
           <p>Sample Text</p>
       */};
       
      htmlFixture.append(INITIAL_HTML);

  ```
  This feature exists to simplify insertion of complex Html if you use Ecmascript 5
  
*```isEmpty()```*

    returns true if the content of the fixture is empty
    
*```asString()```*

    returns the content of the fixture as a string (without the containing div, only the content that was added on ```append```)

*```isEqual(string|DOMElement|function)```*

     this method accepts the same types of param as ```append```.
     Compares the content of the fixture and the param and return true if it considers that are equal
     
     * ignores multiples spaces & case
     * respects the comments in html
     * transform entities to unicode when possible
     
     Some examples:
     
         const domElement=document.createElement("span");
         htmlFixture.append("<span></span>");
         htmlFixture.isEqual(domElement); //true
     
         const htmlLowerCase="<div><p></p></div><img/>";
         const htmlUpperCase="<DIV><P></P></DIV><IMG/>";
         htmlFixture.append(htmlLowerCase);
         htmlFixture.isEqual(htmlUpperCase); //true
     
         const html="<div><p></p></div><img/>";
         const htmlWithSpaces="   <div>   <p>    </p>    </div>    <img/>      ";
         htmlFixture.append(html);
         htmlFixture.isEqual(htmlWithSpaces); //true
     
         const htmlWithAttribInLowercase="<div id='id'><p></p></div><img/>";
         const htmlWithAttribInUppercase="<div ID='id'><p></p></div><img/>";
         htmlFixture.append(htmlWithAttribInUppercase);
         htmlFixture.isEqual(htmlWithAttribInLowercase); //true
     
         const html="<div><p> A text </p> Another text</div><img>";
         htmlFixture.append(html);
         htmlFixture.isEqual(html); //true
     
         const html="<div><!-- a comment --></div>";
         htmlFixture.append(html);
         htmlFixture.isEqual(html); //true
     
         const html="<p>Acci&oacute;n</p>";
         htmlFixture.append(html);
         htmlFixture.isEqual("<p>Acción</p>"); //true
          
     ```
     
*```elementByTag(tagName)```*

    returns the first element in the fixture that has the specified tag name
    
```
    const html="<p>1</p><a>2</a><p>3</p>";
    htmlFixture.append(html);
    htmlFixture.elementByTag("p");// returns the DOMElement that refers to "<p>1</p>"
```

*```elementBySelector(selector)```*

    returns the first element in the fixture that has matches the specified selector
    
    ```selector``` as per [w3c](https://www.w3.org/TR/selectors-3)
    
```
    const html="<p>1</p><a>2</a><p>3</p>";
    htmlFixture.append(html);
    htmlFixture.elementBySelector("p:first-child"); // returns the DOMElement that refers to "<p>1</p>"
```

*```elementsByTag(tagName) && elementsBySelector(selector)```*

Same as ```elementByTag(tagName)``` && ``elementBySelector(selector)``` but returns an array with all the elements in the fixture instead of only the first element.


Some examples:
```
    const html="<p>1</p><a>2</a><p>3</p>";
    fixture.append(html);
    const elements = fixture.elementsByTag("p");
    elements[0].outerHTML; // "<p>1</p>"
    elements[1].outerHTML; // "<p>3</p>"


    const html="<p class="title">1</p><a class="title">2</a><p>3</p>";
    fixture.append(html);
    const elements = fixture.elementsBySelector(".title");
    elements[0].outerHTML; // "<p class="title">1</p>"
    elements[1].outerHTML; // "<a class="title">2</a>"

```
     


