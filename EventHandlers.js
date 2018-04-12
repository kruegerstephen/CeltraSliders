    let allowMove = false;

    function start(e){
      moveThisKnob = this;
      allowMove = true;
    }


    function move(e){
              if(allowMove || e.type == "click"){                       
        
                  
                  let containerCenterW = container.clientWidth/2;
                  let arrayChildren = Array.from(container.childNodes).filter(child => child.nodeName =="circle").filter(child => child.attributes.pID != undefined);

                  let y,x;

                  if(e.type == "mousemove")
                  {
                     y = containerCenterW- e.pageY;
                     x = e.pageX - containerCenterW;
                     currCircle = arrayChildren.filter((child) => child.id ===             moveThisKnob.getAttribute("pID"))[0];                     
                  }else if(e.type == "click"){
                      currCircle = this;
                      moveThisKnob = arrayChildren.filter((child) => child.attributes.pID.value === this.id)[0]
                      allowMove = false;
                      y = containerCenterW- e.pageY;
                      x = e.pageX - containerCenterW;
                  }
                  else{
                     y = containerCenterW- e.touches[0].pageY;
                     x = e.touches[0].pageX - containerCenterW;
                    currCircle = arrayChildren.filter((child) => child.id ===             moveThisKnob.getAttribute("pID"))[0];  
                  }

                let radian = Math.atan2(y, x);
                let angle = radian*180/Math.PI;
                moveKnob(currCircle, angle);

              }
            
     }

    function end(e){
      allowMove = false;
    }