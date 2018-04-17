# Circular Sliders 

This is a circular slider class written in vanilla javascript. It draws the sliders as SVG elements and accepts a list of options including step, color, max/min value, and container. 
Check out the demo here [Demo](https://kruegerstephen.github.io/CeltraSliders/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

### Installing

Simply include the CircleSliderWidgetDist.js file into your project. 


Set up your options object and call CreateCircle(options), passing the options in as a parameter.  

```
   let options =  {
        color: "#FC4346",
        maxVal: 100,
        container:"spinners",
        minVal: 10,
        step: 5,      
        radius: 100,
        strokewidth: 30,
        smoothscroll : false,
        name : "Transportation"
    };    
    
    CreateCircle(options)
```


You can create multiple sliders in the same container, just make sure they have the same container value. 

**Working on a solution for multiple containers

The folder CircleSlider just contains all the code in the CircleSliderWidgetDist.js file but split up 
so it is easier to work on.  

## Authors

* **Stephen Krueger** - *Initial work* - [KruegerStephen](https://github.com/kruegerstephen)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Joe's getNode (createSVGElement) function proved incredibly useful https://stackoverflow.com/users/4696005/joseph-merdrignac

