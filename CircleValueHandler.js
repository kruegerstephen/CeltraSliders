
function valueConversion(circle, angle){
    
    let maxVal = circle.attributes.maxVal.value;
    let step = circle.attributes.step.value;
    
    
    let value = ((angle+180)/360) * maxVal;
    value = maxVal-Math.abs(value/step)*step;
    
    let circleDisplayID = circle.id + "display";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value.toString();
    
    
}

//display values