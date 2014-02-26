// ==UserScript==
// @name        BakerSOAddOn
// @namespace   JavaBaker
// @version     1
// @include     http://stackoverflow.com/*
// @include     stackoverflow.com/*
// @include     https://stackoverflow.com/*
// @require     http://code.jquery.com/jquery-1.9.1.js
// @require     http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @resource    customCSS   http://code.jquery.com/ui/1.10.4/themes/dark-hive/jquery-ui.css
// ==/UserScript==


function getAnswerId()
{
    var aid = $(".answer.accepted-answer").attr("data-answerid");
    return aid;
}

function getCodeCss()
{
    var css = $(".answer.accepted-answer").find(".post-text").find("code").css();
    return css;
}

function getCodeBlockText()
{
    var code = $(".answer.accepted-answer").find(".post-text").find("code").first().html();
    return code;
}

function getUrlClass(element)
{
    var base = androidBaseUrl;
    var arr = element.split(".");
    for(var i = 0; i<arr.length; i++)
    {
        var token = arr[i];
        token = token.replace('$', '.');
        base = base + token + '/';
    }
    base = base.substring(0, base.length - 1) + ".html";
    return base;
}

function getUrlMethod(element)
{
    var base = androidBaseUrl;
    var arr = element.split(".");
    for(var i = 0; i<arr.length-1; i++)
    {
        var token = arr[i];
        token = token.replace('$', '.');
        base = base + token + '/';
    }
    base = base.substring(0, base.length - 1) + ".html";
    base = base + '#' + arr[arr.length-1];
    return base;
}


function updatePage(response)
{
    var map2 = {},
        json = JSON.parse(response.responseText),
        cutype = 0;
    for(var i=0; i<json.length; i++)
    {
        var row = json[i];
        if(map2.hasOwnProperty(row.line))
        {
            if(row.apitype == "class")
            {
                map2[row.line].class.push(row.element);
            }
            else
            {
                map2[row.line].method.push(row.element);
            }
        }
        else
        {
            cutype = row.cutype;
            map2[row.line] = {};
            map2[row.line].method = [];
            map2[row.line].class = [];
            if(row.apitype == "class")
            {
                map2[row.line].class.push(row.element);
            }
            else
            {
                map2[row.line].method.push(row.element);
            }
        }
    }
    

    var count = cutype + 1;
    var arr = code.split('\n');
    var newCode = "";
    for(var i=0; i < arr.length; i++)
    {
        var lineno = i+1;
        var titleString = "One line " + lineno + ": \n";
        if(map2.hasOwnProperty(i+count))
        {
            var values = map2[i+count]["class"];
            if(values.length >0)
            {
                titleString = titleString + "Classes: \n"
            }
            for(var j=0; j<values.length; j++)
            {
                //titleString = titleString + "\t- " +values[j] + "\t\t" + getUrlClass(values[j]) + "\n";
                titleString = titleString + "\t- " +values[j] + "\t\t" + getUrlClass(values[j]) + "\n";
            }
            var values = map2[i+count]["method"];
            if(values.length >0)
            {
                titleString = titleString + "Methods: \n"
            }
            for(var j=0; j<values.length; j++)
            {
                titleString = titleString + "\t- " +values[j] + "\t\t" + getUrlMethod(values[j]) + "\n";
            }
        }
        newCode = newCode + "<span class = \"ttip\" title = \""+ titleString +"\">" + arr[i] + "</span>\n"
    }

    alert(newCode);
    $(".answer.accepted-answer").find(".post-text").find("code").html(newCode);
    
    var newCSS = GM_getResourceText ("customCSS");
    GM_addStyle(newCSS);
    
    $(".ttip").tooltip({
        content: function() {
            var titleText = $(this).attr("title");
            if(titleText !== undefined && titleText!== "")
                titleText = titleText.replace(/\n/g, '<br>');
            titleText = titleText + "<script> $(\".androidLogo\").css ({width: \"15px\", height: \"15px\"});</script>";
            return "<p align = \"left\">" + "<img class = \"androidLogo\" src=\"http://blog.appliedis.com/wp-content/uploads/2013/11/android1.png\"><br>" + titleText + "</p>";
        },
        position: {
            my: "bottom-20",
            at: "top"
        },
        html: true
    });
}


var androidBaseUrl = "http://developer.android.com/reference/";
var answerId = getAnswerId();
var code = getCodeBlockText();
GM_xmlhttpRequest({
    method: "GET",
    url: "http://gadget.cs.uwaterloo.ca:2145/snippet/BakerMapApiInCode.php?aid=" + answerId + "&code=" + code,
    onload: updatePage
});

var codeCss = getCodeCss();

