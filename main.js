document.addEventListener('DOMContentLoaded', function(){ 
    
    let options =  {
        color: "#FC4346",
        maxVal: 100,
        container:"spinners",
        minVal: 10,
        step: 7,      
        radius: 100,
        strokewidth: 30,
        smoothscroll : false,
        name : "Transportation"
    };    

    let options2 =  {
        color: "#F3781C",
        maxVal: 100,
        minVal: 5,
        step: 10,      
        radius: 150,
        strokewidth: 30,
        smoothscroll : true,
        container:"spinners",
        name : "Food"
    };    
    
    let options3 =  {
        color: "#009E23",
        maxVal: 20,
        minVal: 4,
        step: 2,      
        radius: 200,
        container:"spinners",
        strokewidth: 30,
        smoothscroll : false,
        name : "Insurance"

    };    
    
    let options4 =  {
        color: "#0085BD",
        maxVal: 300,
        minVal: 50,
        step: 5,      
        radius: 250,
        container:"spinners",
        strokewidth: 30,
        smoothscroll : true,
        name : "Entertainment"

    };    
    
    let options5 =  {
        color: "#5F3A6F",
        maxVal: 300,
        minVal: 50,
        container:"spinners",
        step: 5,      
        radius: 300,
        strokewidth: 30,
        smoothscroll : false,
        name : "Healthcare"
    };    
    
    
    
    
    CreateCircle(options);
    CreateCircle(options2);
    CreateCircle(options3);
    CreateCircle(options4);
    CreateCircle(options5);

}, false);







