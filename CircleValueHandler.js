
function valueConversion(fullSlider, angle){
    
    circle = fullSlider.sCircle;
    
    let maxVal = parseInt(circle.attributes.maxVal.value);
    let minVal = parseInt(circle.attributes.minVal.value);
    
    console.log(maxVal)
    
    let step = circle.attributes.step.value;

    let value = ((angle+180)/360) * maxVal;
    
    value = Math.abs((maxVal)-Math.ceil(value/step)*step);
    
    
    
    
    if(value >= maxVal){
        value = maxVal;
        drawPath(fullSlider, -179);
    }else{
        value = value + minVal;
    }
    
    let circleDisplayID = circle.id + "display";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value.toString();
    
}

//display values