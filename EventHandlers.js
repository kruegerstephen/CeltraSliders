    let allowMove = false;

    function start(e){
      moveThisKnob = this;
      allowMove = true;
    }

    function move(e){
        e.preventDefault();
              if(allowMove || e.type === "click")
              {                       
                  
                if(e.type==="click"){ allowMove = false };
                                  
                let sliderCircle = getCircle(this, e.type);
                
                let offset = getEventXYCoord(e);
                let radian = Math.atan2(offset.y, offset.x);
                let angle = radian*180/Math.PI;
                console.log(offset.y, offset.x);
                let stepAngle = getStepAngle(sliderCircle.sCircle, angle);

                  
                drawPath(sliderCircle, stepAngle);
                moveKnob(sliderCircle, stepAngle);
                valueConversion(sliderCircle, stepAngle, angle);

              }
            
     }

    function getCircle(clickedElement, eventType){
        
          if(eventType != "click"){
             if(moveThisKnob != undefined){     
                return getSliderPartsByID(moveThisKnob.attributes.pID.value);
             }
          }else if(clickedElement.nodeName === "path"){

              return getSliderPartsByID(clickedElement.attributes.pathID.value);

          }else if (clickedElement.nodeName === "circle"){

              return getSliderPartsByID(clickedElement.id);
          }
    }


    function getEventXYCoord(e){
        
        let globalPointsFlag = false;
        let containerCenterW;
        
        /*hack for firefox - expensive call so will only use when necessary*/
        if(SVG.clientWidth === 0){
            globalPointsFlag = true;
            var globalPoint = getGlobalPoint(e);
            containerWidth = SVG.attributes.width.value/2;
        }else{
            containerCenterW = SVG.clientWidth/2;
        }

        /*essentially: if (firefox) else if(other browsers) else if (mobile)*/
        if((e.type === "mousemove" || e.type ==="click") && globalPointsFlag)
          {
             return {
                 y : containerWidth - globalPoint.y,
                 x : globalPoint.x - containerWidth, 
             }

          }else if((e.type === "click" || e.type ==="mousemove") && !globalPointsFlag){
              return{
                  y : containerCenterW- e.offsetY,
                  x : e.offsetX - containerCenterW,
              } 
          }
          else if(e.type === "touchmove"){
              /*calculates offset of SVG for correct touch angles*/
            return{
                y : SVG.getBoundingClientRect().top + document.documentElement.scrollTop + containerCenterW - e.touches[0].pageY,
                x : e.touches[0].pageX - SVG.getBoundingClientRect().left + document.documentElement.scrollLeft - containerCenterW,
            }            
          }
    }

    function getGlobalPoint(e){
         var pt = SVG.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
         return pt.matrixTransform(SVG.getScreenCTM().inverse());
    }

    function end(e){
      allowMove = false;
    
    }