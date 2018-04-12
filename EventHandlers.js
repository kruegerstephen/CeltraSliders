    let allowMove = false;

    function start(e){
      moveThisKnob = this;
      allowMove = true;
    }


    function move(e){
              if(allowMove){                       
        
                  
                  let containerCenterW = container.clientWidth/2;
                  let arrayChildren = Array.from(container.childNodes);
                  let currCircle = arrayChildren.filter((child) => child.id === moveThisKnob.getAttribute("pID"))[0];
                 
                  



                  let y,x;

                  if(e.type != "touchmove")
                  {
                     y = containerCenterW- e.pageY;
                     x = e.pageX - containerCenterW;
                  }else{
                     y = containerCenterW- e.touches[0].pageY;
                     x = e.touches[0].pageX - containerCenterW;
                  }

                let radian = Math.atan2(y, x);
                let angle = radian*180/Math.PI;
                moveKnob(currCircle, angle);

              }
            
     }

    function end(e){
      allowMove = false;
    }