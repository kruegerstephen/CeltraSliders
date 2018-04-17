function valueConversion(fullSlider, stepAngle, angle){
    
    let circle = fullSlider.sCircle;
    let maxAngle = -179;

    let maxVal = parseInt(circle.attributes.maxVal.value);
    let minVal = parseInt(circle.attributes.minVal.value);
    let step = parseInt(circle.attributes.step.value);

    let stepVal = maxVal-minVal;
    
    let value = ((stepAngle+180)/360) * stepVal;
    value = Math.abs((stepVal)-Math.floor(value/step)*step);
    let floorVal = stepVal- Math.abs((stepVal)-Math.floor(value/step)*step);

    /*handling value edge cases for stepping*/
    if(maxAngle+4 >= angle && angle >= maxAngle && value<=stepVal){
            value = maxVal;
            moveToMax(fullSlider, maxAngle);
       }else if(value + minVal == step && minVal < step){
           value = minVal;
       }else if(value + minVal == maxVal && 0 === (stepAngle+180)/360){
           value = maxVal;
           moveToMax(fullSlider, maxAngle);
       }
        else{
            if(value<step){
                value = minVal;
            }else{
                value = minVal + floorVal;
            }
        }
    

    displayValue(circle, value);
}


function moveToMax(slider, maxAngle){
    moveKnob(slider, maxAngle);
    drawPath(slider, maxAngle)
}

function displayValue(circle, value){
    let circleDisplayID = circle.id + "valueDisp";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value;
}
