let SVG;

function CreateCircle(options, container) {

    SVG = createSVG(container + "SVG");
    options.forEach(function (opt) {

        let circle = new CircleWidget(opt);
        circle.DrawCircle();
        circle.CreateKnob();
        circle.AddEventHandlers();
        circle.CreateDisplayField();

        if (document.getElementById(container) === undefined) {
            document.body.appendChild(SVG);
        } else {
            document.getElementById(container).appendChild(SVG);
        }

        //Resize the SVG if the circle will be out of the viewbox
        if (SVG.clientWidth <= circle.radius * 2.75 || SVG.clientHeight <= circle.radius * 2.75) {
            resizeSVG(circle);
        }
    });
}


function CircleWidget(options) {

    let defaultFlag = false;
    if (options === undefined) {
        defaultFlag = true;
    }

    this.name = defaultFlag ? "circle" : options.name;
    this.color = defaultFlag ? "blue" : options.color;
    this.maxVal = defaultFlag ? 100 : options.maxVal;
    this.minVal = defaultFlag ? 0 : options.minVal;
    this.step = defaultFlag ? 1 : options.step;
    this.container = defaultFlag ? "spinners" : options.container,
        this.strokewidth = defaultFlag ? 30 : options.strokewidth;
    this.smoothscroll = defaultFlag ? false : options.smoothscroll;
    this.radius = defaultFlag ? circleRadiusSpacer() : options.radius;

    this.id = "circ" + getAllCircles().length.toString() + SVG.id;
    this.startAngle = toRadian(-90);
    this.cx = SVG.clientWidth / 2;
    this.cy = SVG.clientWidth / 2;
}

CircleWidget.prototype.DrawCircle = function drawCircle() {

    this.slider = createSvgElement("circle", {
        id: this.id,
        cx: this.cx,
        cy: this.cy,
        r: this.radius,
        step: this.step,
        name: this.name,
        fill: "none",
        maxVal: this.maxVal,
        minVal: this.minVal,
        stroke: "grey",
        container: this.container,
        strokeColor: this.color,
        startAngle: this.startAngle,
        smoothscroll: this.smoothscroll,
        "stroke-opacity": 0.4,
        "stroke-width": this.strokewidth
    });

    SVG.appendChild(this.slider);

};


CircleWidget.prototype.CreateKnob = function CreateKnob() {

    let knobXY = getKnobPosition(this.startAngle, this.radius, this.cx);

    this.knob = createSvgElement("circle", {
        pID: this.id,
        cx: knobXY.knobX,
        cy: knobXY.knobY,
        r: this.strokewidth - 10,
        fill: "#EDEEEE",
        stroke: "none"
    });

    SVG.appendChild(this.knob);
}

CircleWidget.prototype.AddEventHandlers = function AddEventHandlers() {


    SVG.addEventListener("mouseup", end);
    SVG.addEventListener("mousemove", move);

    this.slider.addEventListener("click", move);
    this.slider.addEventListener("touchenter", move);

    this.knob.addEventListener("touchstart", start);
    this.knob.addEventListener("touchmove", move);
    this.knob.addEventListener("touchend", end);
    this.knob.addEventListener("mousedown", start);

};


CircleWidget.prototype.CreateDisplayField = function CreateDisplayField() {

    let valBox = document.createElement('div');
    let valBoxName = document.createElement('div');
    let valBoxValue = document.createElement('div');
    let valBoxColor = document.createElement('div');

    valBox.id = this.id + "display";
    valBox.style.display = "inline-flex"

    valBoxName.innerHTML = this.name + ":";

    valBoxValue.innerHTML = this.minVal;
    valBoxValue.id = this.id + "valueDisp";

    valBoxColor.style.height = "20px";
    valBoxColor.style.width = "20px";
    valBoxColor.style.float = "right";
    valBoxColor.style.marginLeft = "10px";
    valBoxValue.style.marginLeft = "10px";
    valBoxColor.style.background = this.color;

    displayCase.appendChild(valBox);

    valBox.appendChild(valBoxName);
    valBox.appendChild(valBoxValue);
    valBox.appendChild(valBoxColor);
};


function moveKnob(fullSlider, stepAngle) {

    let radius = fullSlider.sCircle.r.baseVal.value;
    let centerX = fullSlider.sCircle.cx.baseVal.value;

    let stepAngleRad = toRadian(stepAngle);

    let newY = -Math.round(Math.sin(stepAngleRad) * radius) + centerX;
    let newX = Math.round(Math.cos(stepAngleRad) * radius) + centerX;

    fullSlider.sKnob.cx.baseVal.value = newX;
    fullSlider.sKnob.cy.baseVal.value = newY;

    //moves knob to top of svg, which keeps it on top of all other elements
    SVG.appendChild(fullSlider.sKnob);
}



function getStepAngle(circle, angle) {

    let numSteps = ((circle.attributes.maxVal.value - circle.attributes.minVal.value) / circle.attributes.step.value);

    let stepAngle;

    if (circle.attributes.smoothscroll.value.toLowerCase() === "true") {
        stepAngle = (angle / (360 / numSteps) * (360 / numSteps));
    } else {
        stepAngle = Math.round((angle / (360 / numSteps))) * (360 / numSteps);
    }

    return stepAngle;
}


function drawPath(fullSlider, angle) {

    let circle = fullSlider.sCircle;
    let strokewidth = circle.attributes["stroke-width"].value;
    let currPath = getAllPaths().filter(child => child.attributes.pathID.value === circle.id)[0];

    let path = createSvgElement("path", {
        pathID: circle.id,
        fill: "none",
        stroke: circle.attributes.strokeColor.value,
        "stroke-opacity": 0.8,
        "stroke-width": strokewidth,
        d: generateArc(circle, Math.abs(angle - 180))
    });


    path.addEventListener("click", move, false);


    if (currPath !== undefined) {
        SVG.replaceChild(path, currPath);
    } else {
        circle.firstMove = true;
        SVG.appendChild(path);
    }
}

function getKnobPosition(angle, radius, centerSVG) {
    return {
        knobX: Math.round(Math.sin(angle) * radius) + centerSVG,
        knobY: Math.round(Math.cos(angle) * radius) + centerSVG
    };

}

function findPathXY(centerX, centerY, radius, angle) {
    let radians = toRadian(angle - 180);
    return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
    };
}

function generateArc(circle, endAngle) {

    let radius = circle.r.baseVal.value;
    let centerX = circle.cx.baseVal.value;
    let centerY = circle.cx.baseVal.value;

    let start = findPathXY(centerX, centerY, radius, 0);
    let end = findPathXY(centerX, centerY, radius, endAngle);

    let largeArcFlag = endAngle <= 180 ? "0" : "1";

    return d = [
        "M", end.x, end.y,
        "A", radius, radius, 0, largeArcFlag, 0, start.x, start.y
    ].join(" ");
}


function createSVG(svgID) {
    return createSvgElement("svg", {
        id: svgID,
        preserveAspectRatio: "xMidYMid slice",
        viewBox: "1 1 1500 1500",
        width: "100",
        height: "100"
    })

}


function circleRadiusSpacer() {
    return 50 + ((getAllCircles().length) + 1) * 50;
}

const toRadian = (angle) => angle * Math.PI / 180;


/*----------------EVENT HANDLERS------------------------*/

let allowMove = false;

function start(e) {
    moveThisKnob = this;
    allowMove = true;
}

function move(e) {
    e.preventDefault();
    if (allowMove || e.type === "click") {

        if (e.type === "click") {
            allowMove = false
        };

        let sliderCircle = getCircle(this, e.type);

        let offset = getEventXYCoord(e);
        let radian = Math.atan2(offset.y, offset.x);
        let angle = radian * 180 / Math.PI;
        console.log(offset.y, offset.x);
        let stepAngle = getStepAngle(sliderCircle.sCircle, angle);


        drawPath(sliderCircle, stepAngle);
        moveKnob(sliderCircle, stepAngle);
        valueConversion(sliderCircle, stepAngle, angle);

    }

}

function getCircle(clickedElement, eventType) {

    if (eventType != "click") {
        if (moveThisKnob != undefined) {
            return getSliderPartsByID(moveThisKnob.parentNode, moveThisKnob.attributes.pID.value);
        }
    } else if (clickedElement.nodeName === "path") {

        return getSliderPartsByID(clickedElement.parentNode, clickedElement.attributes.pathID.value);

    } else if (clickedElement.nodeName === "circle") {

        return getSliderPartsByID(clickedElement.parentNode, clickedElement.id);
    }
}


function getEventXYCoord(e) {

    let globalPointsFlag = false;
    let containerCenterW;

    /*hack for firefox - expensive call so will only use when necessary*/
    if (SVG.clientWidth === 0) {
        globalPointsFlag = true;
        var globalPoint = getGlobalPoint(e);
        containerWidth = SVG.attributes.width.value / 2;
    } else {
        containerCenterW = SVG.clientWidth / 2;
    }

    /*essentially: if (firefox) else if(other browsers) else if (mobile)*/
    if ((e.type === "mousemove" || e.type === "click") && globalPointsFlag) {
        return {
            y: containerWidth - globalPoint.y,
            x: globalPoint.x - containerWidth,
        }

    } else if ((e.type === "click" || e.type === "mousemove") && !globalPointsFlag) {
        return {
            y: containerCenterW - e.offsetY,
            x: e.offsetX - containerCenterW,
        }
    } else if (e.type === "touchmove") {
        /*calculates offset of SVG for correct touch angles*/
        return {
            y: SVG.getBoundingClientRect().top + document.documentElement.scrollTop + containerCenterW - e.touches[0].pageY,
            x: e.touches[0].pageX - SVG.getBoundingClientRect().left + document.documentElement.scrollLeft - containerCenterW,
        }
    }
}

function getGlobalPoint(e) {
    var pt = SVG.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(SVG.getScreenCTM().inverse());
}

function end(e) {
    allowMove = false;

}

/*------------------------------Value Handler------------------------------*/

function valueConversion(fullSlider, stepAngle, angle) {

    let circle = fullSlider.sCircle;
    let maxAngle = -179;

    let maxVal = parseInt(circle.attributes.maxVal.value);
    let minVal = parseInt(circle.attributes.minVal.value);
    let step = parseInt(circle.attributes.step.value);

    let stepVal = maxVal - minVal;

    let value = ((stepAngle + 180) / 360) * stepVal;
    value = Math.abs((stepVal) - Math.floor(value / step) * step);
    let floorVal = stepVal - Math.abs((stepVal) - Math.floor(value / step) * step);

    /*handling value edge cases for stepping*/
    if (maxAngle + 4 >= angle && angle >= maxAngle && value <= stepVal) {
        value = maxVal;
        moveToMax(fullSlider, maxAngle);
    } else if (value + minVal == step && minVal < step) {
        value = minVal;
    } else if (value + minVal == maxVal && 0 === (stepAngle + 180) / 360) {
        value = maxVal;
        moveToMax(fullSlider, maxAngle);
    } else {
        if (value < step) {
            value = minVal;
        } else {
            value = minVal + floorVal;
        }
    }


    displayValue(circle, value);
}


function moveToMax(slider, maxAngle) {
    moveKnob(slider, maxAngle);
    drawPath(slider, maxAngle)
}

function displayValue(circle, value) {
    let circleDisplayID = circle.id + "valueDisp";
    let dispDIV = document.getElementById(circleDisplayID);
    dispDIV.innerHTML = value;
}

/*--------------------SVG HELPER -------------------------------*/

function getAllSVGElements() {
    return Array.from(SVG.childNodes);
};

function getAllCircles() {
    return getAllSVGElements.call().filter(child => child.nodeName == "circle" && child.attributes.pID == undefined);
};

function getAllKnobs() {
    return getAllSVGElements.call().filter(child => child.attributes.pID != undefined);
};

function getAllPaths() {
    return getAllSVGElements.call().filter(child => child.nodeName == "path");
};

function getPathById(id) {
    getAllPaths.call().filter(child => child.attributes.pathID.value == id)[0];
}


function getSliderPartsByID(clickedSVG, id) {

    if (clickedSVG.nodeName === "svg") {
        SVG = clickedSVG;
    }

    let sliderCircle = getAllCircles.call().filter(child => child.id == id && child.attributes.pID == undefined)[0];
    let sliderKnob = getAllKnobs.call().filter(child => child.attributes.pID.value == id)[0];
    let sliderPath = getAllPaths.call().filter(child => child.attributes.pathID.value == id)[0];
    return {
        sCircle: sliderCircle,
        sKnob: sliderKnob,
        sPath: sliderPath
    }
}



function createSvgElement(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (let p in v)
        n.setAttributeNS(null, p, v[p]);
    return n
};


/*resizes the svg to fit the current circle*/
function resizeSVG(circle) {

    SVG.width.baseVal.value = circle.radius * 2.75;
    SVG.height.baseVal.value = circle.radius * 2.75;
    let viewBoxString = "0 0 " + circle.radius * 2.75 + " " + circle.radius * 2.75;
    SVG.setAttribute("viewBox", viewBoxString)

    let centerContainer = SVG.width.baseVal.value / 2;

    let allCircles = getAllCircles();

    for (let currCircle of allCircles) {

        let slider = getSliderPartsByID(SVG, currCircle.id);

        slider.sCircle.cx.baseVal.value = centerContainer;
        slider.sCircle.cy.baseVal.value = centerContainer;

        let knobPositions = getKnobPosition(slider.sCircle.attributes.startAngle.value, slider.sCircle.r.baseVal.value, centerContainer);

        slider.sKnob.cx.baseVal.value = knobPositions.knobX;
        slider.sKnob.cy.baseVal.value = knobPositions.knobY;

    }
}