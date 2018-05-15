function createSvgElement(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (let p in v)
        n.setAttributeNS(null, p, v[p]);
    return n
};


/*resizes the svg to fit the current circle*/
function resizeSVG(circle, SVG) {

    circle.parentSVG.width.baseVal.value = circle.radius * 2.75;
    circle.parentSVG.height.baseVal.value = circle.radius * 2.75;
    let viewBoxString = "0 0 " + circle.radius * 2.75 + " " + circle.radius * 2.75;
    circle.parentSVG.setAttribute("viewBox", viewBoxString)

    let centerContainer = circle.parentSVG.width.baseVal.value / 2;

    for (let currCircle of CirclesArray) {

        currCircle.slider.cx.baseVal.value = centerContainer;
        currCircle.slider.cy.baseVal.value = centerContainer;

        currCircle.cx = centerContainer;
        currCircle.cy = centerContainer;
        
        let knobPositions = getKnobPosition(currCircle.startAngle, currCircle.radius, centerContainer);

        currCircle.knob.cx.baseVal.value = knobPositions.knobX;
        currCircle.knob.cy.baseVal.value = knobPositions.knobY;

    }
}
