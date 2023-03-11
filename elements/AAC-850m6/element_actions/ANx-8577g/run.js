function(instance, properties, context) {


  var imageUrl = properties.image,
    imageBounds = [[ 27.4577623846446, -81.36445334018633 ], [ 27.445485397694338, -81.34616880891613 ] ];
L.imageOverlay(imageUrl, imageBounds).addTo(instance.data.mymap);



}