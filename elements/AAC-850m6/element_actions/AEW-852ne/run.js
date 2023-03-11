function(instance, properties, context) {


    if (properties.unique_name) {

        //cleanses all digits and dots, so the only numbers are the ones placed by my function
        var namePurifiedFromNumbers = properties.unique_name.replace(/[0-9]|\./g, '');

    }

    if (properties.clusterize_markers && !instance.data.isMapboxGl) {
        //place this in instance data whenever I get to erase it
        let options = {

            zoomToBoundsOnClick: true,
            showCoverageOnHover: true,
            spiderfyOnMaxZoom: properties.spiderify,
            disableClusteringAtZoom: properties.max_zoom,

        };

        instance.data[`markerCluster${properties.unique_name}`] = L.markerClusterGroup(options).on('clusterclick', clusterClicked);

    } else if (properties.clusterize_markers && instance.data.isMapboxGl) {
        //placeholder for future MapboxGL clusters



    }



    // publishes the unique name of the marker when it's clicked and triggers the 'marker clicked workflow'
    function markerClicked(e) {

        // gets all numbers placed by my function, join them into a single string then convert to an actual number type
        let numberOfThisIndex = Number(e.sourceTarget.options.listedMarkerUniqueName.match(/[0-9]/g).join(""));


        instance.publishState("marker_clicked_id", e.sourceTarget.options.listedMarkerUniqueName);
        instance.publishState("marker_clicked_index", numberOfThisIndex);

        instance.triggerEvent("marker_clicked");
        
        // - NOUFEL EDITING HERE
        
        console.log(properties.routegeojson);
         fetch(properties.routegeojson).then((response) => response.json()).then((json) => {
             
             
              var firstpoint;
            var firstpointnear;
            var secondpoint;
            var secondpointnear;
            var pathfinderkeys;
      
              pathFinder = new geojsonPathFinder(json, {precision: 0.00001,   weight: function (a, b, props) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
      }});
      
          
            pathfinderkeys = Object.keys(pathFinder._graph.vertices);
            pathvertices = {
              "type": "FeatureCollection",
              "features": []
            };
            
            pathfinderkeys.forEach((element) => {
              coords = element.split(',');
              pathvertices.features.push( {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "coordinates": [
                      parseFloat(coords[0]),
                      parseFloat(coords[1])
                    ],
                    "type": "Point"
                  }
                });
            });
             
             
             function findpath(firstpoint, firstpointnear, secondpoint, secondpointnear) {
            
            path = pathFinder.findPath(firstpointnear, secondpointnear);
            console.log(path);
            
            
            function polystyle(feature) {
                return {
                    fillColor: '#6FF2A4',
                    weight: 6,
                    opacity: 1,
                    color: '#6FF2A4',  //Outline color
                    fillOpacity: 0.7,
                    dashArray: '15,15',
                    lineCap: 'round',
                    lineJoin: 'round'
                };
            }
            
            bearings = [];
            bearings1 = [];
            
            L.geoJSON(  {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "coordinates":path.path,
                    "type": "LineString"
                  }
                }, {style: polystyle}).addTo(instance.data.mymap);
                instance.data.mymap.invalidateSize();
                //map.fitBounds();
            
                for (let i = 0; i < path.path.length; i++) {
                    if (i !== path.path.length - 1) {
            point1 = turf.point(path.path[i]);
            point2 = turf.point(path.path[i+1]);
            bearing = turf.bearing(point1, point2, {final: true});
            bearings.push(bearing);
                    }
                }
            console.log(bearings);
            
            for (let i = 0; i < bearings.length; i++) {
                if (i !== 0) {
                    if (bearings[i] - bearings[i-1] <0) {bearingo = (360 - (Math.abs(bearings[i] - bearings[i-1])))} else {bearingo = bearings[i] - bearings[i-1]}
                    bearings1.push(bearingo);
                    if (bearingo >=60 && bearingo <=150) {
            $('#directions').append('<div>Turn Right</div>');
                    } else if (bearingo >=210 && bearingo <=300) {
            $('#directions').append('<div>Turn Left</div>');
                    }
                } else {
                    if (bearings[i] >=330 || bearings[i] <=30) {
                    $('#directions').append('<div>Take the North route.</div>');
                    } else if (bearings[i] >30 && bearings[i] <=150) {
                    $('#directions').append('<div>Take the West route.</div>');
                    } else if (bearings[i] >150 && bearings[i] <=210) {
                    $('#directions').append('<div>Take the South route.</div>');
                    }else if (bearings[i] >210 && bearings[i] <330) {
                    $('#directions').append('<div>Take the East route.</div>');
                    }
                }
            }
            console.log(bearings1);
            
            }
             
              if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                  }
                  function showPosition(position) {
                    console.log(position);
                        firstpoint = {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                              "coordinates":[position.coords.longitude,position.coords.latitude],
                              "type": "Point"
                            }
                          };
                        firstpointnear = turf.nearestPoint(firstpoint, pathvertices);
                        secondpoint =  {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                              "coordinates":[e.target._latlng.lng, e.target._latlng.lat],
                              "type": "Point"
                            }
                          };
                        secondpointnear = turf.nearestPoint(secondpoint, pathvertices);
                        findpath(firstpoint, firstpointnear, secondpoint, secondpointnear);
                  }
         });

        
        
        //- NOUFEL STOPS HERE

    }

    function markerHovered(e) {

        // gets all numbers placed by my function, join them into a single string then convert to an actual number type
        let numberOfThisIndex = Number(e.sourceTarget.options.listedMarkerUniqueName.match(/[0-9]/g).join(""));

        instance.publishState("marker_hovered_id", e.sourceTarget.options.listedMarkerUniqueName);
        instance.publishState("marker_hovered_index", numberOfThisIndex);

        instance.triggerEvent("marker_hovered");

    }


    function markerUnHovered(e) {

        // gets all numbers placed by my function, join them into a single string then convert to an actual number type
        let numberOfThisIndex = Number(e.sourceTarget.options.listedMarkerUniqueName.match(/[0-9]/g).join(""));

        instance.publishState("marker_unhovered_id", e.sourceTarget.options.listedMarkerUniqueName);
        instance.publishState("marker_unhovered_index", numberOfThisIndex);

        instance.triggerEvent("marker_unhovered");

    }


    function clusterClicked(e) {

        let nameOfMarkersInsideCluster = e.layer.getAllChildMarkers().map(markerObj => markerObj.options.listedMarkerUniqueName);


        instance.publishState("cluster_clicked_marker_ids", nameOfMarkersInsideCluster);

        instance.triggerEvent("cluster_clicked");

    }



    // this returns an array holding the list of texts (strings), booleans (yes/no) and integers (decimals and numbers)
    const getList = (thingWithList, startPosition, finishPosition) => {
        let returnedList = thingWithList.get(startPosition, finishPosition);
        return returnedList;
    }

    let latitudes = getList(properties[`list_of_latitudes`], 0, properties[`list_of_latitudes`].length());
    let longitudes = getList(properties[`list_of_longitudes`], 0, properties[`list_of_longitudes`].length());

    if (typeof properties[`list_of_popup_texts`] !== "undefined" && properties[`list_of_popup_texts`] !== null) {

        var popupTexts = getList(properties[`list_of_popup_texts`], 0, properties[`list_of_popup_texts`].length());

    }

    const whichMarker = (chosenStyle) => {

        if (chosenStyle === "Blue") {
            return "//dd7tel2830j4w.cloudfront.net/f1564171493719x438702278353580350/blue_marker.png";
        } else if (chosenStyle === "Yellow") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170374547x229722995590253600/yellow_marker.png";
        } else if (chosenStyle === "Green") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170384003x782559689703375100/green_marker.png";
        } else if (chosenStyle === "Red") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170393314x384017959683047300/red_marker.png";
        } else if (chosenStyle === "Brown") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170365919x415802668829707840/brown_marker.png";
        } else if (chosenStyle === "White") {
            return "//dd7tel2830j4w.cloudfront.net/f1564178688812x132572725832933660/white_marker.png";
        } else if (chosenStyle === "Black") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170401815x674587151186880900/black_marker.png";
        }

    };



    const addEachMarker = (currentValue, index) => {


        if (properties.popup_on_click && properties.use_custom_icon) {

            let myIcon = L.icon({
                iconUrl: `https:${properties.custom_icon_url}`,
                iconSize: [64, 64], // size of the icon
                shadowSize: [50, 64], // size of the shadow
                iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [0, -64]   // point from which the popup should open relative to the iconAnchor

            });

            if (properties.clusterize_markers) {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data[`markerCluster${properties.unique_name}`]).bindPopup(popupTexts[index]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);


            } else {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).bindPopup(popupTexts[index]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            }

        } else if (properties.popup_on_click && !properties.use_custom_icon) {

            let myIcon = L.icon({
                iconUrl: `https:${whichMarker(properties.marker_style)}`,
                shadowUrl: "https://dd7tel2830j4w.cloudfront.net/f1564167608320x554071841235934900/marker-shadow.png",
                iconSize: [25, 40], // size of the icon
                shadowSize: [41, 41], // size of the shadow
                iconAnchor: [12, 39], // point of the icon which will correspond to marker's location
                shadowAnchor: [13, 40],  // the same for the shadow
                popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
            });

            if (properties.clusterize_markers) {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data[`markerCluster${properties.unique_name}`]).bindPopup(popupTexts[index]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            } else {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).bindPopup(popupTexts[index]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            }

        } else if (!properties.popup_on_click && properties.use_custom_icon) {

            let myIcon = L.icon({
                iconUrl: `https:${properties.custom_icon_url}`,
                iconSize: [64, 64], // size of the icon
                shadowSize: [50, 64], // size of the shadow
                iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [0, -64]   // point from which the popup should open relative to the iconAnchor

            });

            if (properties.clusterize_markers) {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data[`markerCluster${properties.unique_name}`]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            } else {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            }

        } else if (!properties.popup_on_click && !properties.use_custom_icon) {

            let myIcon = L.icon({
                iconUrl: `https:${whichMarker(properties.marker_style)}`,
                shadowUrl: "https://dd7tel2830j4w.cloudfront.net/f1564167608320x554071841235934900/marker-shadow.png",
                iconSize: [25, 40], // size of the icon
                shadowSize: [41, 41], // size of the shadow
                iconAnchor: [12, 39], // point of the icon which will correspond to marker's location
                shadowAnchor: [13, 40],  // the same for the shadow
                popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
            });

            if (properties.clusterize_markers) {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data[`markerCluster${properties.unique_name}`]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            } else {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            }

        }

    };


    latitudes.forEach(addEachMarker);




    if (properties.clusterize_markers) {


        var sheetForClusterStyle = document.createElement('style');
        sheetForClusterStyle.innerHTML =
            `.marker-cluster-small {
                background-color: ${properties.small_cluster_color_out} !important;
                }
            .marker-cluster-small div {
                background-color: ${properties.small_cluster_color_in} !important;
                }
            
            .marker-cluster-medium {
                background-color: ${properties.medium_cluster_color_out} !important;
                }
            .marker-cluster-medium div {
                background-color: ${properties.medium_cluster_color_in} !important;
                }
            
            .marker-cluster-large {
                background-color: ${properties.large_cluster_color_out} !important;
                }
            .marker-cluster-large div {
                background-color: ${properties.large_cluster_color_in} !important;
                }
            
            .marker-cluster div {
            
                font: ${properties.font_size}px "${properties.font_name}", Arial, Helvetica, sans-serif !important;
                color: ${properties.font_color} !important;
            
                }`;

        document.head.appendChild(sheetForClusterStyle);


        instance.data[`markerCluster${properties.unique_name}`].addTo(instance.data.mymap);
    }
    
    // ----------------NOUFEL SCRIPT -----------------------------------------------
    
    //L.control.locate().addTo(instance.data.mymap);
    
      $('.leaflet-bottom.leaflet-left').append(`
  <div class="leaflet-pm-toolbar leaflet-pm-edit leaflet-bar leaflet-control">
    <div class="button-container  " title="Your Location" id="loc-btn">
        <a class="leaflet-buttons-control-button" role="button" tabindex="0" href="#">
            <div class="control-icon" style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAkCAYAAACTz/ouAAAACXBIWXMAAAsTAAALEwEAmpwYAAACEklEQVRIia3WT4iNURjH8c/cKMWkTIQsRCMilEnNpEyJDRsplJCVRGyspLBgqWzZ2Ch/ykI0UeTfRtFMRkKxYBai/JkRjcZci/e+dXvnPed935n7q2dxz3me7+855z63c9vEtQC70IsV6Gisf8MbPMI1DBVwJqgDV1AvGdcxryx8ZwVwNvYWwY9PAZ7GyRD8QAvgaRzOwpdhrIUGdaxuNrjaYngdt6BNMn6vQ/fWpF8YwDjWYHaJmi44UdDJKA7mFO/HSEHtObgbSRhBZ6TDRfgSqX8CHyIJu0tcw7ZI/Uf4Gdh8WwKe6nmAMVzD30DRiwoG/YH10ZrkivI0XsHgX2D9XQ2PA5srKxiEcvugR/hL2lwC3h2pX5ImPQ0kvEd7BD4dLwO1l5oTd0S6GMKGHPi6RgN5NWNYmi24HzGpY7DR1UXJ1MRyT+cdt6ugqGwM5MFTnW2BQU/MQInjV76arNZOEv6wDDzVoYrwH1hYxQAuVzDYWhVO8toNloCfmQw8VSf+ROA3pgJP1RuA90tOGVUtsteN25If4LHM3hBO4Z7k38PGKh3PkYxcc7d7cL7p83YTh+AZ5hfBZ8h/o79jCz7jAo7k5NTxCbNiBqHCtMPF2BfJqctc57SMwUjEfD2OYnmswwIGuFPQYSz6iuCpTkoe8rLgcclUTVBsjtsl07IJqzAXMxt7v/EVr/AANzGcB/kPnMuxXk7zfbsAAAAASUVORK5CYII=)"></div>
            </a>
                </div>
    `);
    
    document.getElementById("loc-btn").addEventListener("click", function(){
    if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(showPosition);
                }
        function showPosition(position) {
            userlocationmarker = {
                          "type": "Feature",
                          "properties": {},
                          "geometry": {
                            "coordinates":[position.coords.longitude,position.coords.latitude],
                            "type": "Point"
                          }
                        };
          userlocationmarkerstyle = {
    radius: 6,
    fillColor: "#001dff",
    color: "#fff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
};
            L.geoJSON(userlocationmarker, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, userlocationmarkerstyle);
    }
    }).addTo(instance.data.mymap);
            instance.data.mymap.setView([position.coords.latitude, position.coords.longitude], 18);
            
        }
}, false);
    //-------------------------- NOUFEL SCRIPT ENDS ----------------------------
}