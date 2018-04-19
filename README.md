# Circular Sliders 

This is a circular slider class written in vanilla javascript. It draws the sliders as SVG elements and accepts a list of options including step, color, max/min value, and container. 
Check out the demo [here](https://kruegerstephen.github.io/CeltraSliders/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

### Installing

Simply include the CircleSliderWidgetDist.js file into your project. 

First create an options array that contains the options for each circle you wish to create

Set up your options objects and initalize and array with options for each circle.
Call CreateCircle(), passing the options array and the container in as a parameters.  

```
   let options =  {
        color: "#FC4346",
        maxVal: 100,
        minVal: 10,
        step: 5,      
        radius: 100,
        strokewidth: 30,
        smoothscroll : false,
        name : "Transportation"
    };    
    
  
    let options2 = {
        color: "#F3781C",
        maxVal: 100,
        minVal: 5,
        step: 10,
        radius: 150,
        strokewidth: 30,
        smoothscroll: true,
        name: "Food"
    };

    let optionsArray = [options, options2];
    let optionsArray2 = [options];

    let container1 = "spinners";
    let container2 = "spinners2";
    
    
    CreateCircle(optionsArray, container1);
    CreateCircle(optionsArray2, container2);

```

Some of the less obvious options:
* smoothscroll - Will smoothly scroll around the circle instead of stepping by angle. The value will still step. Off by default.
* name - Name that will be displayed on the page signaling the value of the slider 
* container - The name of the DOM element to attach the sliders too
 

The folder CircleSlider contains all the code in the CircleSliderWidgetDist.js file but split up 
so it is easier to digest and work on.  


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Joe's getNode (createSVGElement) function proved incredibly useful https://stackoverflow.com/questions/20539196/creating-svg-elements-dynamically-with-javascript-inside-html/37411738#37411738

