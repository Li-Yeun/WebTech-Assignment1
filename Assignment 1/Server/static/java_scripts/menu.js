function apply()
{
    var elements = getSelectedOption("element-selector");
    switch(elements)
    {
        case "body": elements = document.getElementsByTagName("body");
            break;
        case "header": elements = document.getElementsByTagName("header");
            break;
        case "footer": elements = document.getElementsByTagName("footer");
            break;       
        case "aside": elements = document.getElementsByTagName("aside");
            break;      
        case "article": elements = document.getElementsByTagName("article");
            break;      
        case "section": elements = document.getElementsByTagName("section");
            break;     
    }

    var attribute = getSelectedOption("appearance-selector");
    var value = getSelectedOption("value-selector")

    for(let i = 0; i < elements.length; i++)
    {
        setAttributeProperty(elements[i], attribute, value);
    }

}

function getSelectedOption(selector)
{
    var yourSelect = document.getElementById(selector);
    try{
        return yourSelect.options[yourSelect.selectedIndex].value;
    }catch
    {
        return yourSelect.value;
    }
}

function setAttributeProperty(input, attribute, value)
{
    switch(attribute)
    {
        case "font-size": input.style.fontSize = value + "px";
                        break;
        case "color-scheme": input.style.color = value;
                        break;
        case "font-family": input.style.fontFamily = value;

    }
}

function changeValueSelector()
{
    var attribute = getSelectedOption("appearance-selector");
    var valueSelector = document.getElementById("value-selector");
    var newSelector;
    switch(attribute)
    {
        case "font-size": newSelector = createInputSelector("number");
                          break;
        case "color-scheme": newSelector = createInputSelector("color");
                             break;
        case "font-family": newSelector = createSelectSelector(["Verdana", "Arial", "Calibri", "Courier", "Impact"]);
                          break;
    }       
    
    valueSelector.replaceWith(newSelector);
}

function createInputSelector(type)
{
    var selector = document.createElement("input");
    selector.type = type;
    selector.name = "value";
    selector.id = "value-selector";
    return selector;
}
function createSelectSelector(array)
{
    var selector = document.createElement("select");
    selector.name = "value";
    selector.id = "value-selector";

    for (let i = 0; i < array.length; i++) {
        let option = document.createElement("option");
        option.value = array[i];
        option.text = array[i];
        option.text.fontFamily = array[i]
        selector.appendChild(option);
    }

    return selector;
}
function checkElementSelector()
{
    var elements = document.getElementById("element-selector").options;
    for(let i = 0; i < elements.length; i++)
    {
         element = elements[i];
         if(document.getElementsByTagName(element.value).length == 0) 
         { 
            element.disabled = true;
         }
    }
}

