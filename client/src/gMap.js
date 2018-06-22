// Copyright (c) 2017 <Robert Oinam(roboinam@gmail.com)>
//Google Map Integration

var gMap = (function() {
	function init() {               

	} 
	var gMap = {
				map: null, //Google Map
				selected: null, //Selected Location Marker
				geocoder: null, //GeoCoding API
				latitude: 0, //Set Latitude
				longitude: 0, //Set Longitude
				content: "",
				load:  function (searchInput, mapDiv, onClick, lat, lng){ //Function to load Google Map
                                   var mykey = "AIzaSyA7KaO4dwiImTBJdw2ouL1Ls4PTdtF-rwA";
								   
								   this.onClick = onClick;
								   if(lat)
									   this.latitude = lat;
								   if(lng)
									   this.longitude = lng;								   
								   
								   if(!(document.getElementById('gMapScriptTag'))){
										var div = document.createElement('DIV');
										div.setAttribute("id", "googleMap");
										div.style.width='100%';
										div.style.height='300px';
										this.mapDiv = div;
									   
										var input = document.createElement('INPUT');
										input.setAttribute("id", "searchBox");
										input.setAttribute("placeholder", "Search Google Map");
										input.style.border='transparent';
										input.style.outline='none';
										input.style.marginBottom='0px !important';
										this.searchInput = input;
										var icon = document.createElement('SPAN');//Search Icon
										icon.setAttribute("class", "glyphicon glyphicon-search");
										var searchBoxDiv = document.createElement('DIV');//Search Box
										searchBoxDiv.setAttribute("id", "searchBoxContainer");
										searchBoxDiv.setAttribute("class", "gMapSearchStyle");
										searchBoxDiv.appendChild(this.searchInput);
										searchBoxDiv.appendChild(icon);
									   
										var map_div = document.createElement('DIV');//Whole Map Content
										map_div.style.position='relative';
										map_div.appendChild(searchBoxDiv);
										map_div.appendChild(this.mapDiv);
										this.content = map_div;
										
										var script_tag= document.createElement('script');
										script_tag.setAttribute("id","gMapScriptTag");
										script_tag.setAttribute("type","text/javascript");
										script_tag.setAttribute("src","https://maps.googleapis.com/maps/api/js?key="+mykey+"&libraries=places&callback=initMap");
										(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
										gMap.initialized = false;
								   }
								   else if((gMap.latitude && gMap.latitude != 0) || (gMap.longitude && gMap.longitude != 0)){
										var latlng = new google.maps.LatLng(gMap.latitude,gMap.longitude);
										//Mark location
										if(!(gMap.selected)){
												gMap.selected = new google.maps.Marker({
													  //icon: "./assets/arrow_down.png"
												});
										}
										gMap.selected.setMap(null);
										gMap.selected.setPosition(latlng);
										gMap.selected.setMap(gMap.map);
										gMap.map.setCenter(latlng);										
									}
                     },
				locate: function(address){ //Function to set location using address
                                if(address){
                                       //geocoder
                                       if(!(this.geocoder))
                                             this.geocoder = new google.maps.Geocoder();
										this.geocoder.geocode( { 'address': address }, function(results, status) {
                                             if (status == google.maps.GeocoderStatus.OK) {
                                                    var location = results[0].geometry.location;
                                                    var latlng = new google.maps.LatLng(parseFloat(location.lat()),parseFloat(location.lng()));
                                                    //Mark location
													if(!(gMap.selected)){
														gMap.selected = new google.maps.Marker({
															  //icon: "./assets/arrow_down.png"
													  });
													}
                                                    gMap.selected.setMap(null);
                                                    gMap.selected.setPosition(latlng);
                                                    gMap.selected.setMap(gMap.map);
													gMap.map.setCenter(latlng);
                                                    
													//Set Lat & Lng
													gMap.latitude = parseFloat(location.lat());
													gMap.longitude = parseFloat(location.lng());													
                                              }
                                         } );
                                }
                }
	}
	return gMap;
})(); 

if (typeof define === 'function' && define.amd) {
  define(function () { return gMap; });
} else if( typeof module !== 'undefined' && module != null ) {
  module.exports = gMap
} else if( typeof angular !== 'undefined' && angular != null ) {
  angular.module('gMap', [])
  .factory('gMap', function () {
    return gMap;
  });

}

 
 
//Google Map initialization function (Google API callback)
function initMap() {
				var latlng = new google.maps.LatLng(0,0);
				gMap.map = new google.maps.Map(gMap.mapDiv,{center:latlng, zoom:12});
				var searchBox = new google.maps.places.SearchBox(gMap.searchInput);
				google.maps.event.addListener(searchBox, 'places_changed', function() {
							searchBox.set('map', null);
							var places = searchBox.getPlaces();
							var bounds = new google.maps.LatLngBounds();
							var i, place;
							for (i= 0; place = places[i]; i++) {
								(function(place) {
									var marker = new google.maps.Marker({
										position: place.geometry.location
									});
									marker.bindTo('map', searchBox, 'map');
									google.maps.event.addListener(marker, 'map_changed', function() {
										if (!this.getMap()) {
											this.unbindAll();
										}
									});
									bounds.extend(place.geometry.location);
									//Set Lat & Lng
									gMap.latitude = place.geometry.location.lat();
									gMap.longitude = place.geometry.location.lng();
								}(place));
							}
							gMap.map.fitBounds(bounds);
							searchBox.set('map', gMap.map);
							gMap.map.setZoom(Math.min(gMap.map.getZoom(),12));
				});
				
				gMap.map.addListener( 'click', function(e) {//Click Event Listener					
                    //Mark location
					if(!(gMap.selected)){
						gMap.selected = new google.maps.Marker({
							  //icon: "./assets/arrow_down.png"
						});
					}
                    gMap.selected.setMap(null);
                    gMap.selected.setPosition(new google.maps.LatLng(e.latLng.lat(),e.latLng.lng()));
                    gMap.selected.setMap(gMap.map);
                    //Set Lat & Lng
					gMap.latitude = e.latLng.lat();
					gMap.longitude = e.latLng.lng();
					
					gMap.onClick(e.latLng.lat(),e.latLng.lng());
                });
				
				
				
				if((gMap.latitude && gMap.latitude != 0) || (gMap.longitude && gMap.longitude != 0)){
					var latlng = new google.maps.LatLng(gMap.latitude,gMap.longitude);
					//Mark location
					if(!(gMap.selected)){
							gMap.selected = new google.maps.Marker({
								  //icon: "./assets/arrow_down.png"
							});
					}
					gMap.selected.setMap(null);
					gMap.selected.setPosition(latlng);
					gMap.selected.setMap(gMap.map);
					gMap.map.setCenter(latlng);
				}
				else{
					if(navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(e){
							var latlng = new google.maps.LatLng(e.coords.latitude, e.coords.longitude);
							//Mark location
							if(!(gMap.selected)){
									gMap.selected = new google.maps.Marker({
										  //icon: "./assets/arrow_down.png"
									});
							}
							gMap.selected.setMap(null);
							gMap.selected.setPosition(latlng);
							gMap.selected.setMap(gMap.map);
							gMap.map.setCenter(latlng);
							//Set Lat & Lng
							gMap.latitude = e.coords.latitude;
							gMap.longitude = e.coords.longitude;
						});
					}
				}

}
