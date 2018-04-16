/*Finds value based on current angle*/
function valueConversion(fullSlider, stepAngle, angle){
    
    circle = fullSlider.sCircle;
    let maxVal = parseInt(circle.attributes.maxVal.value);
    let minVal = parseInt(circle.attributes.minVal.value);
    let stepVal = maxVal-minVal;
    let step = parseInt(circle.attributes.step.value);
    let value = ((stepAngle+180)/360) * stepVal;
    value = Math.abs((stepVal)-Math.floor(value/step)*step);
    let floorVal = stepVal- Math.abs((stepVal)-Math.floor(value/step)*step);
    let ceilVal =  stepVal - Math.abs((stepVal)-Math.ceil(value/step)*step);
    let unrounded = stepVal - Math.abs((stepVal)-(value/step)*step);
    
    if(-175 >= angle && angle >= -179 && value<=stepVal)
  {
        value = maxVal;
        moveKnob(fullSlider, -179);
        drawPath(fullSlider, -179);
   } else if(value + minVal == step && minVal < step){
       value = minVal;
   }else if(value + minVal == maxVal && 0 ===(stepAngle+180)/360){
       value = maxVal;
       moveKnob(fullSlider, -179);
       drawPath(fullSlider, -179);
   }
    else{
        if(value<minVal){
            value = minVal;
        }else{
            value = minVal + floorVal;
        }
    }
    

    displayValue(circle, value);
}

/*displays value in DOM*/
function displayValue(circle, value){
    let circleDisplayID = circle.id + "valueDisp";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value;
}
