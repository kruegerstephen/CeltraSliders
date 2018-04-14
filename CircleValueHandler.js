function valueConversion(fullSlider, angle){
    
    circle = fullSlider.sCircle;
    let maxVal = parseInt(circle.attributes.maxVal.value);
    let minVal = parseInt(circle.attributes.minVal.value);
    let step = circle.attributes.step.value;
    let value = ((angle+180)/360) * maxVal;
    
    value = Math.abs((maxVal)-Math.ceil(value/step)*step);
    
    if(value >= maxVal){
        value = maxVal;
        drawPath(fullSlider, -179);
    }else{
        value = value + minVal;
    }

    displayValue(circle, value);
}


function displayValue(circle, value){
    let circleDisplayID = circle.id + "display";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.style.display = "inline-flex"
    dispDIV.innerHTML = circle.id + " : " + value.toString() 
    + "<div id='colorBox' style='width:50px; height:50px; margin-left:20px; background-color:" + circle.attributes.strokeColor.value + "'></div>";
}
