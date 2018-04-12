
function valueConversion(circle, angle){
    
    let maxVal = circle.attributes.maxVal.value;
    let step = circle.attributes.step.value;

    
    let value = ((angle+180)/360) * maxVal;
    console.log(maxVal-Math.abs(value/step)*step);
}

//display values