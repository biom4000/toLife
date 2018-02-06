/*
 * MIT License
 * Copyright(c) 2012 essoduke.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 『AS IS』, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * jQuery tinyMap v2.2.5
 * 短小精幹！拯救你免於 Google Maps API 的摧殘，輕鬆建立 Google Maps 的 jQuery 擴充套件。
 *
 * @modify: Tue, 25 September 2012 02:05:42 GMT
 * @url: http://app.essoduke.org/tinyMap/
 * @author: Essoduke Chang
 *
 * [Changelog]
 *   2.2.5
 *      加入 KML 軌跡顯示功能
 *   2.2.4
 *      修正因 Geocode 每秒請求限制導致地圖數量無法顯示超過 12 個的錯誤。
 *   2.2.3
 *      修正因 Geocode 每秒請求限制導致 marker 數目無法超過 8-10 個的錯誤。
 */
(function ($) {

	'use strict';

	var loop = 0;

    $.fn.tinyMap = function (settings) {
        var apis;
        /**
         * Default Options
         */
        var options = $.extend({
            center: {x: '24.774968', y: '121.027227'},
            control: true,
            draggable: true,
            keyboardShortcuts: true,
            mapTypeControl: true,
            mapTypeControlOptions: {
                position: 'TOP_RIGHT',
                style: 'DEFAULT'
            },
            mapTypeId: 'ROADMAP',
            marker: [],
			polyline: [],
            navigationControl: true,
            navigationControlOptions: {
                position: 'TOP_LEFT',
                style: 'DEFAULT'
            },
            scaleControl: true,
            scaleControlOptions: {
                position: 'BOTTOM_LEFT',
                style: 'DEFAULT'
            },
            scrollwheel: true,
            zoom: 10,
			notfound: '找不到查詢的地點',
			loading: '讀取中…',
			kml: {
				url: '',
				viewport: true,
				infowindow: false
			}
        }, settings);

        /**
         * GoogleMap Options
         */
        var GoogleMapOptions = {
            center: new google.maps.LatLng(options.center.x, options.center.y),
            control: options.control,
            draggable: options.draggable,
            keyboardShortcuts: options.keyboardShortcuts,
            mapTypeId: google.maps.MapTypeId[options.mapTypeId.toUpperCase()],
            mapTypeControl: options.mapTypeControl,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition[options.mapTypeControlOptions.position],
                style: google.maps.MapTypeControlStyle[options.mapTypeControlOptions.style.toUpperCase()]
            },
            navigationControl: options.navigationControl,
            navigationControlOptions: {
                position: google.maps.ControlPosition[options.navigationControlOptions.position],
                style: google.maps.NavigationControlStyle[options.navigationControlOptions.style.toUpperCase()]
            },
            scaleControl: options.scaleControl,
            scaleControlOptions: {
                position: google.maps.ControlPosition[options.scaleControlOptions.position],
                style: google.maps.ScaleControlStyle[options.scaleControlOptions.style.toUpperCase()]
            },
            scrollwheel: options.scrollwheel,
            zoom: options.zoom
        };

        /**
         * Private functions
         */
        var APIS = function (container) {

			// instance created counter to avoid 'OVER_QUERY_LIMIT' status of Google Maps Geocoder
			++loop;

			// Label overlay example for Google Maps API v3
			// Code from: Marc Ridey - Blog
			// http://blog.mridey.com/2009/09/label-overlay-example-for-google-maps.html
			// Define the overlay, derived from google.maps.OverlayView
			var Label = function (opt_options) {
				// Initialization
				this.setValues(opt_options);
				// Label specific
				var css = opt_options.css || '';
				var span = this.span_ = $('<span/>').css({
					'position': 'relative',
					'left': '-50%',
					'top': '0',
					'white-space': 'nowrap'
				}).addClass(css);
				var div = this.div_ = $('<div/>');
				span.appendTo(div);
				div.css({
					'position': 'absolute',
					'display': 'none'
				});
			};

			Label.prototype = new google.maps.OverlayView;
			// Implement onAdd
			Label.prototype.onAdd = function () {
				var pane = this.getPanes().overlayLayer;
				this.div_.appendTo($(pane));
				// Ensures the label is redrawn if the text or position is changed.
				var me = this;
				this.listeners_ = [
					google.maps.event.addListener(this, 'position_changed', function () { me.draw(); }),
					google.maps.event.addListener(this, 'text_changed', function() { me.draw(); })
				];
			};

			// Implement draw
			Label.prototype.draw = function () {
				var projection = this.getProjection();
				var position = projection.fromLatLngToDivPixel(this.get('position'));
				var div = this.div_;
				div.css({
					'left': position.x + 'px',
					'top': position.y + 'px',
					'display': 'block'
				});
				if (this.text) {
					this.span_.html(this.text.toString());
				}
			};

            /**
             * add travel direction to the map
             * <param name="map" type="object">map element</param>
             * <param name="options" type="json">direction options</param>
             */
            var direction = function (map, options) {
				var waypoints = [];
                var directionsService = new google.maps.DirectionsService();
                var directionsDisplay = new google.maps.DirectionsRenderer();
                var request = {
                    travelMode: google.maps.DirectionsTravelMode.DRIVING,
					optimizeWaypoints: options.optimize || false
                };
                if ('string' === typeof options.from) {
                    request.origin = options.from;
                }
                if ('string' === typeof options.to) {
                    request.destination = options.to;
                }
                if ('string' === typeof options.travel) {
                    if (0 < options.travel.length) {
                        request.travelMode = google.maps.DirectionsTravelMode[options.travel.toUpperCase()];
                    }
                }
				if ('undefined' !== typeof options.waypoint && 0 !== options.waypoint) {
					for (var i = 0, c = options.waypoint.length; i < c; i += 1) {
						waypoints.push({
							location: options.waypoint[i].toString(),
							stopover: true
						});
					}
					request.waypoints = waypoints;
				}
                if ('undefined' !== typeof request.origin && 'undefined' !== typeof request.destination) {
                    directionsService.route(request, function (response, status) {
						if (status === google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                        }
                    });
                    directionsDisplay.setMap(map);
                }
            };

            /**
             * add markers and infoWindow to the map and bind the click event
             * <param name="map" type="object">map element</param>
             * <param name="options" type="json">marker option</param>
             */
            var geocode = function (map, options) {
                var geocoder = new google.maps.Geocoder();
                //var latlngaddr = options.addr;
        		var latlngStr = options.addr.split(',', 2);
        		var lat = parseFloat(latlngStr[0]);
        		var lng = parseFloat(latlngStr[1]);
        		var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({'latLng': latlng}, function (results, status) {
                    // if exceeded limit, then call again;
					if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            			window.setTimeout(function () {
							geocode(map, options);
						}, 1000);
					} else if (status === google.maps.GeocoderStatus.OK) {
                        var marker;
                        var infoWindow = new google.maps.InfoWindow({content: options.text});
                        var markerOptions = {
                            map: map,
                            position: latlng,
                            title: options.text.replace(/<([^>]+)>/g, '')
                        };
                        if ('string' === typeof options.icon) {
                            markerOptions.icon = options.icon;
                        }
                        marker = new google.maps.Marker(markerOptions);
						var opt = {
							map: map,
							css: options.css || ''
						};
						if ('string' === typeof options.label && 0 !== options.label.length) {
							opt.text = options.label;
						}
						var label = new Label(opt);
						label.bindTo('position', marker, 'position');
						label.bindTo('text', marker, 'position');
                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.open(map, marker);
                        });
                    }
                });
            };

			/**
             * add markers, infoWindow, polylines, polygons, circles and rectangles to the map
             * <param name="map" type="object">map element</param>
             */
			var draw_overlay = function (map) {
				// KML
				if ('undefined' !== typeof options.kml) {
					var kml_url = '', kml_opt = {
						preserveViewport: true,
						suppressInfoWindows: false
					};
					if ('string' === typeof options.kml && 0 !== options.kml.length) {
						kml_url = options.kml;
					} else if ('object' === typeof options.kml) {
						kml_url = 'undefined' !== typeof options.kml.url ? options.kml.url : '';
					}
					var kml = new google.maps.KmlLayer(kml_url, $.extend(kml_opt, options.kml));
					kml.setMap(map);
				}
				// direction
				if ('undefined' !== typeof options.direction) {
                    if (0 < options.direction.length) {
                        for (var d in options.direction) {
                            if ('undefined' !== typeof options.direction[d]) {
                                direction(map, options.direction[d]);
                            }
                        }
                    }
                }
				// markers
                if ('undefined' !== typeof options.marker) {
                    if (0 < options.marker.length) {
                        for (var m in options.marker) {
                            if ('undefined' !== typeof options.marker[m]) {
								geocode(map, options.marker[m]);
                            }
                        }
                    }
                }
				// polyline
				if ('undefined' !== typeof options.polyline) {
					if ('undefined' !== typeof options.polyline.coords) {
						var coords = [], p = 0;
						for (p in options.polyline.coords) {
							var c = options.polyline.coords;
							if ('undefined' !== typeof c[p]) {
								coords.push(new google.maps.LatLng(c[p][0], c[p][1]));
							}
						}
						var polyline = new google.maps.Polyline({
							path: coords,
							strokeColor: options.polyline.color || '#FF0000',
							strokeOpacity: 1.0,
							strokeWeight: options.polyline.width || 2
						});
						polyline.setMap(map);
					}
				}
				// polygon
				if ('undefined' !== typeof options.polygon) {
					if ('undefined' !== typeof options.polygon.coords) {
						var coords = [], p = 0;
						for (p in options.polygon.coords) {
							var c = options.polygon.coords;
							if ('undefined' !== typeof c[p]) {
								coords.push(new google.maps.LatLng(c[p][0], c[p][1]));
							}
						}
						var polygon = new google.maps.Polygon({
							path: coords,
							strokeColor: options.polyline.color || '#FF0000',
							strokeOpacity: 1.0,
							strokeWeight: options.polygon.width || 2,
							fillColor: options.polygon.fillcolor || '#CC0000',
							fillOpacity: 0.35
						});
						polygon.setMap(map);
						if ($.isFunction(options.polygon.click)) {
							google.maps.event.addListener(polygon, 'click', options.polygon.click);
						}
					}
				}
				// circle
				if ('undefined' !== typeof options.circle && 0 < options.circle.length) {
					for (var c = options.circle.length - 1; c >= 0 ; c -= 1) {
						var circle = options.circle[c];
						if ('undefined' !== typeof circle.center.x && 'undefined' !== typeof circle.center.y) {
							var circles = new google.maps.Circle({
								strokeColor: circle.color || '#FF0000',
								strokeOpacity: circle.opacity || 0.8,
								strokeWeight: circle.width || 2,
								fillColor: circle.fillcolor || '#FF0000',
								fillOpacity: circle.fillopacity || 0.35,
								map: map,
								center: new google.maps.LatLng(circle.center.x, circle.center.y),
								radius: circle.radius || 10
							});
							if ($.isFunction(options.circle.click)) {
								google.maps.event.addListener(circles, 'click', options.circle.click);
							}
						}
					}
				}
			};

            /**
             * Public function
             */
            return {
                /**
                 * Google Maps Initialize
                 */
                initialize: function () {
                    var map, height = $(container).height(), self = this;
					//Loading text
					$('<div/>')
						.css({
							'text-align': 'center',
							'height': height + 'px',
							'line-height': height + 'px'
						})
						.text(options.loading)
						.appendTo(container);

					if ('string' === typeof options.center) {
						setTimeout(function () {
							var geocoder = new google.maps.Geocoder();
							geocoder.geocode({'address': options.center}, function (results, status) {
								try {
									if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
										self.initialize();
									} else if (status === google.maps.GeocoderStatus.OK && 0 !== results.length) {
                                		GoogleMapOptions.center	= (status === google.maps.GeocoderStatus.OK && 0 !== results.length)
                                    	            ? results[0].geometry.location
													: '';
										map = new google.maps.Map($(container).get(0), GoogleMapOptions);
										draw_overlay(map);
									}
								} catch (err) {
									var msg = options.notfound || ('undefined' !== typeof err.message ? err.message : err.description).toString();
                                	$(container).html(msg.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
								}
							});
						}, 200 * loop);

                    } else {
						map = new google.maps.Map($(container).get(0), GoogleMapOptions);
						draw_overlay(map);
                    }
                }
            };
        };

        /**
         * Plugin Construct
         */
        return this.each(function () {
			apis = new APIS(this);
            apis.initialize();
        });
    };

}(jQuery));
