
function valueConversion(fullSlider, angle){
    
    circle = fullSlider.sCircle;
    
    let maxVal = parseInt(circle.attributes.maxVal.value);
    let minVal = parseInt(circle.attributes.minVal.value);

    let step = maxVal/circle.attributes.step.value;

    let value = ((angle+180)/360) * maxVal;
    
    value = Math.round(maxVal-Math.abs(value/step)*step);
    
    
    let circleDisplayID = circle.id + "display";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value.toString();
    
    if(value === maxVal){
        drawPath(fullSlider, -179);
    }
    
}

//display values