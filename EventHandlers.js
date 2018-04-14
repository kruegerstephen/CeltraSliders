    let allowMove = false;

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
                     console.log(x,y);
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
                     y = containerCenterW - e.touches[0].pageY + 50;
                     x = e.touches[0].pageX - window.innerWidth + container.clientWidth;
                     sliderCircle = getSliderPartsByID(moveThisKnob.attributes.pID.value);
                     console.log(x,y)
  
                  }

                let radian = Math.atan2(y, x);
                let angle = radian*180/Math.PI;
                moveKnob(sliderCircle, angle);

              }
            
     }

    function end(e){
      allowMove = false;
    
    }