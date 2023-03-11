function(instance, properties, context) {


    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
svgElement.setAttribute('viewBox', "0,0,792.0,612.0");
svgElement.innerHTML = properties.svg;
var svgElementBounds = [[ 27.4577623846446, -81.36445334018633 ], [ 27.445485397694338, -81.34616880891613 ] ];
L.svgOverlay(svgElement, svgElementBounds).addTo(instance.data.mymap);


}
