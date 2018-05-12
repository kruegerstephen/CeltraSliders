CircleWidget.prototype.SetValue = function valueConversion(angle){
    
    let maxAngle = -179;
    let stepVal = this.maxVal-this.minVal;

    let value = ((this.stepAngle+180)/360) * stepVal;
    value = Math.abs((stepVal)-Math.floor(value/this.step)*this.step);
    let floorVal = stepVal- Math.abs((stepVal)-Math.floor(value/this.step)*this.step);

    /*handling value edge cases for stepping*/
    if(maxAngle+4 >= angle && angle >= maxAngle && value<=stepVal){
            value = this.maxVal;
            this.MoveKnob(maxAngle);
            this.DrawPath(maxAngle);
    }else if(value + this.minVal == this.step && this.minVal < this.step){
           value = this.minVal;
    }else if(value + this.minVal == this.maxVal && 0 === (this.stepAngle+180)/360){
           value = this.maxVal;
           this.MoveKnob(maxAngle);
           this.DrawPath(maxAngle);
    }
    else{
        if(value < this.step){
            value = this.minVal;
        }else{
             value = this.minVal + floorVal;
        }
    }
    
    this.DisplayValue(value);
}

CircleWidget.prototype.DisplayValue = function displayValue(value){
    let circleDisplayID = this.id + "valueDisp";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value;
}
