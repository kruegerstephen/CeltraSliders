
document.addEventListener('DOMContentLoaded', function(){ 

    let startAngle = -90*Math.PI/180;
    let moveThisKnob;
    
    
    const container = createSVG();
    document.getElementById('spinners').appendChild(container);
    
    let options =  {
        color: "blue",
        maxVal: 5000,
        minVal: 10,
        step: 50,      
        radius: 100,
        strokewidth: 25
    };    
    
    

        
    let options2 =  {
        color: "blue",
        maxVal: 300,
        minVal: 50,
        step: 5,      
        radius: 200,
        strokewidth: 25
    };    
    
    let options3 =  {
        color: "blue",
        maxVal: 300,
        minVal: 50,
        step: 5,      
        radius: 300,
        strokewidth: 25
    };    
    
    
    CreateCircle(options);
    CreateCircle(options2);
    CreateCircle(options3);

}, false);






function createSVG(){
    return svg = getNode("svg", {
                        id:"container",
                        width:100,
                        height:100
                      })
    
}


function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (let p in v)
    n.setAttributeNS(null, p, v[p]);
  return n
};