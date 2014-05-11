// ==UserScript==
// @name        BakerSOAddOn
// @namespace   JavaBaker
// @version     1
// @include     http://stackoverflow.com/*
// @include     stackoverflow.com/*
// @include     https://stackoverflow.com/*
// @require     http://code.jquery.com/jquery-1.9.1.js
// @require     http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @resource    customCSS   http://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css
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

function getShortClass(element)
{
    var arr = element.split(".");
    var shortName = arr[arr.length - 1];
    shortName.replace("$",".");
    return shortName;
}

function getPostCountClass(element)
{
    var base = baseBakerCount;
    base = base + "?type=apitype&name=" + element + "&precision=1";
    GM_xmlhttpRequest({
    method: "GET",
    url: base,
    onload: updatePage
});

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

function getShortMethod(element)
{
    var arr = element.split(".");
    var shortName = arr[arr.length-2] + '.' + arr[arr.length - 1];
    shortName.replace("$",".");
    return shortName;
}

function getOtherSOPostsClass(element)
{
    var base = baseBaker;
    base = base + "?type=apitype&name=" + element + "&precision=1";
    return base;
}

function getOtherSOPostsMethod(element)
{
    var base = baseBaker;
    base = base + "?type=apimethod&name=" + element + "&precision=1";
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

            /*text = text + "<tr><td><img class = \"androidLogo\" src=\"" + androidImg + "\"></td><td>&nbsp;&nbsp;</td><td align = 'left'><u> Javadoc </u></td><td>&nbsp;&nbsp;</td><td align = 'left'>[developer.android.com]</td></tr>";
            text = text + "<tr><td><img class = \"gitLogo\"  src=\"" + ghImg + "\"></td><td>&nbsp;&nbsp;</td><td align = 'left'><u> Source Code </u></td><td>&nbsp;&nbsp;</td><td align = 'left'>[github.com]</td></tr></table>";
            text = text + "<table><tr><td><img class = \"SOLogo\" src=\"" + soImg + "\"></td><td align = 'left'><u>StackOverflow posts (18)</u> involving Chronometer </td></tr></table>";
            text = text + "<script> $(\".androidLogo\").css ({width: \"20px\", height: \"20px\"});\n $(\".SOLogo\").css ({width: \"20px\", height: \"20px\"});$(\".gitLogo\").css ({width: \"20px\", height: \"20px\"});</script>";
            */

            var values = map2[i+count]["class"];
            if(values.length >0)
            {
                titleString = titleString + "<h1>Classes: </h1>"
            }
            titleString = titleString + "<table>";
            for(var j=0; j<values.length; j++)
            {
                titleString = titleString + "<tr><td><img class = \"androidLogo\" src=\"" + androidImg + "\"></td><td>&nbsp;&nbsp;</td><td align = 'left'><a href = \"" + getUrlClass(values[j]) + "\">" + values[j] + "</a></td><td>&nbsp;&nbsp;</td><td align = 'left'>[developer.android.com]</td></tr>";
                titleString = titleString + "<tr><td><img class = \"SOLogo\" src=\"" + soImg + "\"></td><td>&nbsp;&nbsp;</td><td align = 'left'><a href = \"" + getOtherSOPostsClass(values[j]) + "\">Stack Overflow posts(" + getPostCountClass(element) + ")</a> involving " + getShortClass(values[j]) +  " </td></tr>";
            }
            titleString = titleString + "</table>";
            var values = map2[i+count]["method"];
            if(values.lengt
                h >0)
            {
                titleString = titleString + "<h1>Methods: </h1>"
            }
            titleString = titleString + "<table>";
            for(var j=0; j<values.length; j++)
            {
                titleString = titleString + "<tr><td><img class = \"androidLogo\" src=\"" + androidImg + "\"></td><td>&nbsp;&nbsp;</td><td align = 'left'><a href = \"" + getUrlClass(values[j]) + "\">" + values[j] + "</a></td><td>&nbsp;&nbsp;</td><td align = 'left'>[developer.android.com]</td></tr>";
                titleString = titleString + "<tr><td><img class = \"SOLogo\" src=\"" + soImg + "\"></td><td>&nbsp;&nbsp;</td><td align = 'left'><a href = \"" + getOtherSOPostsMethod(values[j]) + "\">Stack Overflow posts(" + getPostCountMethod(element) + ")</a> involving " + getShortMethod(values[j]) +  " </td></tr>";
            }
            titleString = titleString + "</table>";
            titleString = titleString + "<script> $(\".androidLogo\").css ({width: \"20px\", height: \"20px\"});\n $(\".SOLogo\").css ({width: \"20px\", height: \"20px\"});$(\".gitLogo\").css ({width: \"20px\", height: \"20px\"});</script>";
        }
        contentMap[lineno] = titleString;
        newCode = newCode + "<span class = \"ttip\" title = \""+ lineno +"\">" + arr[i] + "</span>\n"
    }

    alert(newCode);
    $(".answer.accepted-answer").find(".post-text").find("code").html(newCode);
    
    var newCSS = GM_getResourceText ("customCSS");
    GM_addStyle(newCSS);
    


    $(".ttip").tooltip({
        content: function() {
            var titleText = contentMap[$(this).attr("title")];
            return titleText;
        },
        position: {
            my: "bottom-20",
            at: "top"
        },
        html: true,
        open: function (event, ui) {
            ui.tooltip.css("max-width", "800px");
        }
    });
}

var contentMap = {};
var baseBaker = "http://gadget.cs.uwaterloo.ca:2145/snippet/getanswers.php";
var baseBakerCount = "http://gadget.cs.uwaterloo.ca:2145/snippet/getanswerscount.php";
var androidImg = "http://blog.appliedis.com/wp-content/uploads/2013/11/android1.png";
var ghImg = "http://msysgit.github.io/img/git_logo.png";
var soImg = "http://files.quickmediasolutions.com/so-images/stackoverflow.svg";
var androidBaseUrl = "http://developer.android.com/reference/";
var answerId = getAnswerId();
var code = getCodeBlockText();
GM_xmlhttpRequest({
    method: "GET",
    url: "http://gadget.cs.uwaterloo.ca:2145/snippet/BakerMapApiInCode.php?aid=" + answerId + "&code=" + code,
    onload: updatePage
});

var codeCss = getCodeCss();