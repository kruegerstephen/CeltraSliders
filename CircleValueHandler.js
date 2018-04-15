function valueConversion(fullSlider, angle){
    
    circle = fullSlider.sCircle;
    let maxVal = parseInt(circle.attributes.maxVal.value);
    let minVal = parseInt(circle.attributes.minVal.value);
    let stepVal = maxVal-minVal;
    let step = parseInt(circle.attributes.step.value);
    let value = ((angle+180)/360) * stepVal;
    value = Math.abs((stepVal)-Math.round(value/step)*step);
    
    
  if(value+minVal >= maxVal){
        value = maxVal;
        moveKnob(fullSlider, -179);
        drawPath(fullSlider, -179);
        circle.fullStop = false;
   }  
    else{
      value = value + minVal;
       circle.fullStop = false;
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
