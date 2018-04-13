    let allowMove = false;

    function start(e){
      moveThisKnob = this;
      allowMove = true;
    }

 
    function move(e){
              if(allowMove || e.type == "click"){                       
        
                  
                  let containerCenterW = container.clientWidth/2;
                  let slilderCircle;
                
                  let y,x;

                  if(e.type == "mousemove")
                  {
                     y = containerCenterW- e.pageY;
                     x = e.pageX - containerCenterW; 
                     sliderCircle = getSliderPartsByID(moveThisKnob.attributes.pID.value);
  
                  }else if(e.type == "click"){
                      allowMove = false;
                      y = containerCenterW- e.pageY;
                      x = e.pageX - containerCenterW;
                      if(this.attributes.pathID!=undefined){
                        sliderCircle = getSliderPartsByID(this.attributes.pathID.value);
                      }else{
                        sliderCircle = getSliderPartsByID(this.id);
                      }
                  }
                  else if(e.type == "touchmove"){
                     y = containerCenterW- e.touches[0].pageY;
                     x = e.touches[0].pageX - containerCenterW;
                     sliderCircle = getSliderPartsByID(moveThisKnob.attributes.pID.value);
  
                  }

                let radian = Math.atan2(y, x);
                let angle = radian*180/Math.PI;
                moveKnob(sliderCircle, angle);

              }
            
     }

    function end(e){
      allowMove = false;
    }