    let allowMove = false;

    /*monitors what knob was clicked to start drag*/
    function start(e){
      moveThisKnob = this;
      allowMove = true;
    }

    function move(e){
        e.preventDefault();
              if(allowMove || e.type == "click"){                       

                  let containerCenterW = container.clientWidth/2;
                  let slilderCircle;
                
                  let y,x;

                  if(e.type == "mousemove")
                  {
                     y = containerCenterW- e.offsetY;
                     x = e.offsetX - containerCenterW; 
                     sliderCircle = getSliderPartsByID(moveThisKnob.attributes.pID.value);
  
                  }else if(e.type == "click"){
                      allowMove = false;
                      y = containerCenterW- e.offsetY;
                      x = e.offsetX - containerCenterW;
                      if(this.nodeName === "path"){
                        sliderCircle = getSliderPartsByID(this.attributes.pathID.value);
                      }else{
                        sliderCircle = getSliderPartsByID(this.id);
                      }
                  }
                  else if(e.type == "touchmove"){
                     y = container.getBoundingClientRect().top + document.documentElement.scrollTop + containerCenterW - e.touches[0].pageY;
                     x = e.touches[0].pageX - container.getBoundingClientRect().left + document.documentElement.scrollLeft - containerCenterW;
                     sliderCircle = getSliderPartsByID(moveThisKnob.attributes.pID.value);
                      console.log(x,y);
  
                  }

                let radian = Math.atan2(y, x);
                let angle = radian*180/Math.PI;
                let stepAngle = getStepAngle(sliderCircle.sCircle, angle);

                  
                drawPath(sliderCircle, stepAngle);
                moveKnob(sliderCircle, stepAngle);
                valueConversion(sliderCircle, stepAngle, angle);

              }
            
     }

    function end(e){
      allowMove = false;
    
    }