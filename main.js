
document.addEventListener('DOMContentLoaded', function(){ 

    const container = document.getElementById('container');
    const containerCenterW =  container.clientWidth/2;
    const containerCenterH =  container.clientHeight/2;
    let containerSize = container.clientWidth;
    let startAngle = -90*Math.PI/180;
    let moveThisKnob;

    let options =  {
        id : "circ1",
        color: "blue",
        maxVal: 400,
        minVal: 100,
        step: 10,
        //in future, get from parent of circle
        x: containerCenterW,
        y: containerCenterH,
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
    
    
    let circle1 = new CircleWidget(options);
    let circle2 = new CircleWidget(options2);

    
    circle1.DrawCircle();
    circle1.AddEventHandlers();
    circle1.CreateDisplayField();
    
    circle2.DrawCircle();
    circle2.AddEventHandlers();
    circle2.CreateDisplayField();
    
    

}, false);


function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (let p in v)
    n.setAttributeNS(null, p, v[p]);
  return n
};