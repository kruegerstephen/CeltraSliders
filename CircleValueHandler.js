
function valueConversion(circ, angle){
    let value = ((angle+180)/360) * circ.maxVal;
    console.log(circ.maxVal-Math.abs(value/circ.step)*circ.step);
}

//display values