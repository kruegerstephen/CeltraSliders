
document.addEventListener('DOMContentLoaded', function(){ 

    let startAngle = -90*Math.PI/180;
    let moveThisKnob;
    
    
    const container = createSVG();
    document.getElementById('spinners').appendChild(container);
    
    const containerCenterW =  container.clientWidth/2;
    const containerCenterH =  container.clientHeight/2;
    let containerSize = container.clientWidth;

    let options =  {
        id : "circ1",
        color: "blue",
        maxVal: 5000,
        minVal: 10,
        step: 50,      
        radius: 100,
        strokewidth: 25
    };
    
     let options2 =  {
        id : "circ2",
        color: "yellow",
        maxVal: 100,
        minVal: 0,
        step: 5,
        //in future, get from parent of circle
        x: containerCenterW,
        y: containerCenterH,
        radius: 150,
        strokewidth: 25
    };
    
    let options3 =  {
        id : "circ3",
        color: "green",
        maxVal: 100,
        minVal: 0,
        step: 5,
        //in future, get from parent of circle
        x: containerCenterW,
        y: containerCenterH,
        radius: 190,
        strokewidth: 25
    };
    
    
    
    
    let circle1 = new CircleWidget(options);


    
    circle1.DrawCircle();
    circle1.AddEventHandlers();
    circle1.CreateDisplayField();


    

}, false);


function createSVG(){
    return svg = getNode("svg", {
                        id:"container",
                        width:500,
                        height:500,
                      })
    
}


function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (let p in v)
    n.setAttributeNS(null, p, v[p]);
  return n
};