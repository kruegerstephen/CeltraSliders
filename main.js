document.addEventListener('DOMContentLoaded', function(){ 

    const container = createSVG();
    document.getElementById('spinners').appendChild(container);
    
    let options =  {
        color: "#FC4346",
        maxVal: 14,
        minVal: 4,
        step: 4,      
        radius: 100,
        strokewidth: 30
    };    

    let options2 =  {
        color: "#F3781C",
        maxVal: 300,
        minVal: 50,
        step: 5,      
        radius: 150,
        strokewidth: 30
    };    
    
    let options3 =  {
        color: "#009E23",
        maxVal: 10,
        minVal: 1,
        step: 3,      
        radius: 200,
        strokewidth: 30
    };    
    
    let options4 =  {
        color: "#0085BD",
        maxVal: 300,
        minVal: 50,
        step: 5,      
        radius: 250,
        strokewidth: 30
    };    
    
    let options5 =  {
        color: "#5F3A6F",
        maxVal: 300,
        minVal: 50,
        step: 5,      
        radius: 300,
        strokewidth: 30
    };    
    
    CreateCircle(options3);
    CreateCircle(options);
    CreateCircle(options2);
    CreateCircle(options5);
    CreateCircle(options4);


}, false);




function createSVG(){
    return createSvgElement("svg", {
                            id:"container",
                            width:300,
                            height:300
                          })
    
}


