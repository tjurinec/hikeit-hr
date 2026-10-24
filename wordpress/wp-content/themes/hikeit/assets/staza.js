/**
 * Staza izleta na karti. Podaci dolaze iz data atributa, GPX se ne otvara ovdje.
 */
(function () {
	'use strict';

	var karte = document.querySelectorAll( '.hk-karta' );
	if ( ! karte.length || typeof L === 'undefined' ) {
		return;
	}

	karte.forEach( function ( el ) {
		var track, bounds;
		try {
			track  = JSON.parse( el.dataset.track || '[]' );
			bounds = JSON.parse( el.dataset.bounds || 'null' );
		} catch ( e ) {
			return;
		}
		if ( track.length < 2 ) {
			return;
		}

		var topo = L.tileLayer( 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
			maxZoom: 17,
			attribution: 'Karta: <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA), podaci: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		} );
		var osm = L.tileLayer( 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		} );

		var karta = L.map( el, {
			layers: [ topo ],
			scrollWheelZoom: false // kotačić ostaje stranici; karta se zumira tek nakon klika
		} );

		L.control.layers( { 'Topografska': topo, 'OpenStreetMap': osm }, null, { position: 'topright' } ).addTo( karta );
		L.control.scale( { imperial: false } ).addTo( karta );

		// Staza: tamna podloga pa crvena linija preko — čita se na svakoj karti.
		L.polyline( track, { color: '#ffffff', weight: 7, opacity: 0.75 } ).addTo( karta );
		L.polyline( track, { color: '#CC2A1E', weight: 3.5 } ).addTo( karta );

		var tocka = function ( ll, naziv, boja ) {
			L.circleMarker( ll, {
				radius: 6, color: '#fff', weight: 2.5, fillColor: boja, fillOpacity: 1
			} ).addTo( karta ).bindTooltip( naziv );
		};
		tocka( track[0], 'Polazak', '#1a1a1a' );
		tocka( track[ track.length - 1 ], 'Cilj', '#CC2A1E' );

		var okvir = ( bounds && bounds.length === 2 )
			? L.latLngBounds( bounds )
			: L.polyline( track ).getBounds();

		// Leaflet računa zum iz veličine kontejnera. Ako se ona ustali tek
		// nakon fontova i slika, prvi fitBounds promaši — zato ga ponovimo
		// kad se layout slegne i kad se prozor promijeni.
		var namjesti = function () {
			karta.invalidateSize( { animate: false } );
			karta.fitBounds( okvir, { padding: [ 22, 22 ], maxZoom: 15 } );
		};

		namjesti();
		window.addEventListener( 'load', namjesti );
		window.addEventListener( 'resize', namjesti );
		if ( 'ResizeObserver' in window ) {
			new ResizeObserver( namjesti ).observe( el );
		}

		el._hkMap = karta; // za provjeru iz konzole

		karta.on( 'click', function () {
			karta.scrollWheelZoom.enable();
		} );
		karta.on( 'mouseout', function () {
			karta.scrollWheelZoom.disable();
		} );
	} );
})();
