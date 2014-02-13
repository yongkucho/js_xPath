(function(){
    var xPath = function(fileName){
        return new fnXPath.init(fileName);
    },
    fnXPath = {
        init: function(fileName){
            var xHttp = null,
                xmlData = null,
                regHtml = /^\<|\>$/;
            
            //once create new object
            if(fileName == undefined){
                return this;
            }else if(fileName.match(regHtml)){
                if (window.ActiveXObject){
                    var xmlData = new ActiveXObject("Microsoft.XMLDOM");
                    xmlData.async=false;
                    xmlData.loadXML(fileName); 
                }
                // Internet Explorer
                else{
                    var xmlData = new DOMParser().parseFromString(fileName,"text/xml");
                }
                this.xmlData = xmlData;
                return this;
            }
            
            //code of IE
            if(window.ActiveXObject){
                xHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            //code of Chrome, Firefox, Opera, etc.
            else{
                xHttp = new XMLHttpRequest();
            }
            
            xHttp.open("GET",fileName+"?_="+Math.random(),false);
            // Helping IE
            try { xhttp.responseType="msxml-document" } catch(err) {}
            
            xHttp.onreadystatechange = function(){
                //code for IE
                if(window.ActiveXObject){
                    xmlData = xHttp.responseXML;
                }
                // code for Chrome, Firefox, Opera, etc.
                else if(xHttp.status == 200 || xHttp.readyState == 4){
                    xmlData = xHttp.responseXML;
                }
                //Error Message
                else{
                    alert("XML Load Error:"+xHttp.statusText);
                    console.log("Error",xHttp.statusText);
                }
            }
            xHttp.send("");
            this.xHttp = xHttp;
            this.xmlData = xmlData;
            return this;
        },
        find: function(path){
            
            var newXmlData = [];
            
            //if find function return
            if( this.path !== undefined ){
                if(path.match(/^\[/g)){
                    path = this.path + path;
                }else{
                    path = path.replace(/^\//,'');
                    path = this.path + '/' + path;
                }
                var xmlData = this.rootData;
            }
            //first
            else{
                var xmlData = this.xmlData;
            }
            
            // code for IE
            if (window.ActiveXObject){
                xmlData.setProperty("SelectionLanguage","XPath");
                var nodes = xmlData.selectNodes(path);
                for ( var i = 0, len = nodes.length; i < len ; i++ ){
                    newXmlData.push(nodes[i]);
                }
            }
            // code for Chrome, Firefox, Opera, etc.
            else if (document.implementation && document.implementation.createDocument){
                var nodes = xmlData.evaluate(path, xmlData, null, XPathResult.ANY_TYPE, null);
                var result = nodes.iterateNext();
                while (result){
                    newXmlData.push(result);
                    result=nodes.iterateNext();
                }
            }
            
            //Create new xPath Object
            var newObj = xPath();
            newObj.xmlData = newXmlData;
            newObj.rootData = xmlData;
            newObj.path = path;
            return newObj;
        },
        each: function(callback){
            var xmlData = this.xmlData;
            for(var i = 0, len = xmlData.length; i < len; i++){
                var child = xmlData[i];
                var xmlDataArr = [
                    i,
                    child.nodeName,
                    child.childNodes[0].nodeValue,
                    []
                ];
                
                //once attribute
                if(child.attributes !== undefined){
                    for(var j = 0, len2 = child.attributes.length; j < len2; j++){
                        var attrName = child.attributes[j];
                        xmlDataArr[3][attrName.nodeName] = attrName.nodeValue;
                    }
                }
                callback.apply(child, xmlDataArr);
            }
            
            return xmlData;
        }
    };
    
    fnXPath.init.prototype = fnXPath;
    
    window.xPath = xPath;
})();

window.onload = function(){
    
    //Sample Xpath
    var path="/bookstore/book/title";
    
    //Sample XML Data
    var xmlData = ('<bookstore>'+
    '<book category="COOKING">'+
        '<title lang="en">Everyday Italian</title>'+
        '<author>Giada De Laurentiis</author>'+
        '<year>2005</year>'+
        '<price>30.00</price>'+
    '</book>'+
    '<book category="CHILDREN">'+
        '<title lang="en">Harry Potter</title>'+
        '<author>J K. Rowling</author>'+
        '<year>2005</year>'+
        '<price>29.99</price>'+
    '</book>'+
    '<book category="WEB">'+
        '<title lang="en">XQuery Kick Start</title>'+
        '<author>James McGovern</author>'+
        '<author>Per Bothner</author>'+
        '<author>Kurt Cagle</author>'+
        '<author>James Linn</author>'+
        '<author>Vaidyanathan Nagarajan</author>'+
        '<year>2003</year>'+
        '<price>49.99</price>'+
    '</book>'+
    '<book category="WEB">'+
        '<title lang="en">Learning XML</title>'+
        '<author>Erik T. Ray</author>'+
        '<year>2003</year>'+
        '<price>39.95</price>'+
    '</book>'+
'</bookstore>');
    
    var books = xPath(xmlData);
    var xmlTitleData = books.find(path);
    xmlTitleData.each(function(i,tagName,value,attr){
        document.getElementById("exam1").innerHTML += " Number:"+i+" tagName:"+tagName+" Value:"+value+' attr:'+attr['lang']+"<br />";
    });
    
    /*
    //Ajax XML Data Sample
    var books = xPath("books.xml");
    
    var xmlTitleData = books.find(path);
    var xmlPriceData = books.find('/bookstore/book/price');
    
    xmlTitleData.each(function(i,tagName,value,attr){
        document.getElementById("exam1").innerHTML += " Number:"+i+" tagName:"+tagName+" Value:"+value+' attr:'+attr['lang']+"<br />";
    });
    
    xmlPriceData.each(function(i,tagName,value,attr){
        document.getElementById("exam1").innerHTML += " Number:"+i+" tagName:"+tagName+" Value:"+value+' attr:'+attr['lang']+"<br />";
    });
    
    
    var bookstore = books.find('bookstore');
    var book = bookstore.find('book');
    var title = book.find('title');
    title.each(function(i,tagName,value,attr){
        document.getElementById("exam1").innerHTML += " Number:"+i+" tagName:"+tagName+" Value:"+value+' attr:'+attr['lang']+"<br />";
    });
    */
}
