
function valueConversion(circle, angle){
    
    let maxVal = parseInt(circle.attributes.maxVal.value);
    let minVal = parseInt(circle.attributes.minVal.value);

    let step = circle.attributes.step.value;

    let value = ((angle+180)/360) * maxVal;
    value = Math.round(maxVal-Math.abs(value/step)*step);
    
    if(value < minVal){
        moveKnob(circle, (angle+180)/360 * minVal);
        value = minVal
    }
    
    
    let circleDisplayID = circle.id + "display";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value.toString();
    
    if(value === maxVal){
        drawPath(circle, -179);
    }
    
}

//display values