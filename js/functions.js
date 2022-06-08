'use strict';

/**
    General Functions
*/


function no_cache() {
    return NO_CACHE ? '?nc='+parseInt(Math.random()*1000000) : '';
}


function yml_load( url, fn, args ) {
    $.get( url + no_cache(), function(r) {
	fn(jsyaml.load(r), args);
    });
}


function md_load( url, fn, args ){
    const sep = '---';
    let d, md, yml;
    $.get( url + no_cache(), function( r ){
	if ( r.indexOf( sep ) > -1 ) {
	    d = _.filter(
		r.split( sep ),
		function( v ){ return v !== ''; }
	    );
	    yml = d[0];
	    md = d[1];
	}else{
	    yml = {};
	    md = r;
	}
	fn( yml, md, args );
    });
}


function is_mobile() {
    return window.innerWidth < 700;
}


function is_menu_sticky() {
    return G.menu_sticky;
}


function menu_sticky( status ) {
    const css = 'menu_sticky_active';
    G.menu_sticky = status;
    if ( G.menu_sticky ) {
	document.body.classList.add( css );
    } else {
	document.body.classList.remove( css );
    }
}


function logo_fix() {
    let logo = G.cfg.logo_normal;
    if ( is_mobile() ) {
	if ( is_menu_sticky() ) {
	    logo = G.cfg.logo_small;
	}
    }
    G.logo.attr( 'src', logo );
}


function page_activate( v ) {
    G.cfg = v;
    G.lang = G.cfg.lang_default;

    if ( '' === document.location.hash ) {
	redirect_page( G.cfg.initial_page );
    }

    yml_load( './cfg/menu.yml'+no_cache(), function( v ) {
	lang_button_activate( '#page_lang' );
	header_generate();
	footer_generate();
	content_generate();
	menus_generate( v );
    });
}


function buttons_activate() {
    $( '#content' ).delegate( 'a[href^="#"]', 'click', function( ev ){
	ev.preventDefault();
	redirect_page(
	    $( this ).attr( 'href' )
	);
	return false;
    });
}


function mark_actual_links() {
    const actual_url = document.location.hash,
          links = $( '[href]' );
    let link;
    for ( link of links ) {
	$( link ).addClass( 'actual' );
    }
}


function lang_button_activate( sel ) {
    const btn = $( sel ),
          code = _.template( '{{ _.each(G.cfg.lang_available, function(v, k){  }}<option value="{{= k }}">{{= v }}</option>{{ }); }}' )();

    btn.html( code );
    btn.on({
	change: function( ev ) {
	    G.lang = btn.val();
	    menus_generate();
	    header_generate();
	    content_generate();
	}
    });
    if ( ! G.cfg.lang_change ) {
	btn.hide();
    }
}


function header_generate() {
    $( '#title' ).html( G.cfg.title );
    G.logo = $( '#logo' );
    G.logo.attr({
	title: G.cfg.title,
	src: G.cfg.logo_normal
    });
    $( '#subtitle' ).html(
	G.cfg.subtitle[ G.lang ]
    );
}


function footer_generate() {
    $( '#copyright' ).html(
	G.cfg.copyright[ G.lang ]
    );
}


function menus_generate( v ) {
    if ( undefined !== v ) {
	G.menues = v;
    }else{
	v = G.menues;
    }

    const menu_pages = $( '#menu_pages' ),
          maxScrollTop = menu_pages.position().top;

    menu_pages.html(
	_.template( Template.pages )( { items: v.paginas } )
    );

    menu_pages.delegate( 'a', 'click', function( ev ) {
	ev.preventDefault();
	redirect_page( $( this ).attr( 'href' ) );
	return false;
    });

    menu_pages.find( 'a' ).each( function() {
	const $el = $( this );
	if( 0 <= document.location.href.indexOf( $el.attr( 'href' ) ) ) {
	    $el.addClass( 'actual' );
	}
    });

    window.addEventListener( 'scroll', function() {
	const st = window.pageYOffset || document.documentElement.scrollTop,
              lastScrollTop = 0 > st ? 0 : st;
	if ( st > maxScrollTop ) {
	    menu_sticky( true );
	    if( is_mobile() ) {
		G.logo.attr( 'src', G.cfg.logo_small );
	    }
	} else {
	    menu_sticky( false );
	    G.logo.attr( 'src', G.cfg.logo_normal );
	}
    }, false);
}


function redirect_page( hash ) {
    document.location.hash = hash;
    document.location.reload();
    content_generate();
}


function content_generate() {
    const d = query(),
	  t = d[ 0 ],
	  u = content_url( d ),
	  cnt = $( '#content' );
    if ( 'e' === t) {
	yml_load( u, function( v ) {
	    cnt.html( v.title );
	    buttons_activate();
	});
    } else if ( 'p' === t ) {
	md_load( u, function( yml, md ) {
	    yml = jsyaml.load( yml );
	    md = _.template( md )();
	    cnt.html(
		marked.parse( md )
	    );
	    buttons_activate();
	});
    }
}


function content_url( d ) {
    const t = d[ 0 ],
          n = d[ 1 ];
    if ('e' === t ) {
	return G.cfg.path[ 'ensayos' ] + n + '.yml';
    } else if ( 'p' === t ) {
	return G.cfg.path[ 'paginas' ] + id_lang( n, data.pages ) + '.txt';
    }
}


function query() {
    return document.location.hash.replace( '#', '' ).split( ':' );
}


function id_lang( v, d ) {
    const k = v + '-' + G.lang;
    if ( ! _.allKeys( d ).includes( k ) ) {
	const ak = _.map(
	    _.allKeys( G.cfg.lang_available ),
	    function( w ) { return v + '-' + w; });
	const fk = _.filter(
            ak,
            function( w ){ return w !== k });
	k = fk[ 0 ];
    }
    return k;
}


function title_pages( v ) {
    const d = data.pages,
          k = id_lang( v, d );
    return d[k].title;
}


function title_series( v ) {
    const d = data.series[ v ],
          k = id_lang( 'title', d );
    return d[ k ];
}


function title_events( v ) {
    const d = data.events[ v ],
          k = id_lang( 'title', d );
    return d[ k ];
}


function date_news( v ) {
    const n = data.news,
          k = v + '-' + G.lang;
    if( ! _.allKeys( n ).includes( k ) ) {
	const ak = _.map(
	    _.allKeys( G.cfg.lang_available ),
	    function( w ){ return v + '-' + w; });
	const fk = _.filter(
	    ak,
	    function( w ){ return w !== k})
	k = fk[ 0 ];
    }
    return n[ k ].date;
}


function open_gallery( d, i ) {
    const cnt = $( _.template( Template.gallery_panel )( {d: d, i: i - 1} ) ),
          close = cnt.find( '[name=close]' ),
          prev = cnt.find( '[name=prev]' ).eq( 0 ),
          next = cnt.find( '[name=next]' ).eq( 0 ),
          position = cnt.find( '[name=position]' ).eq( 0 ),
          image = cnt.find( '.image' ).eq( 0 ),
          body = $( 'body' );

    const show = ( n ) => {
	let index = parseInt( image.data( 'index' ) ) + n;
	if ( index < 0 ) {
	    index = d.images.length - 1;
	}
	if( index >= d.images.length ) {
	    index = 0;
	}
	image.data( 'index', index );
	let v = d.images[ index ];
	image.find( 'img' ).eq( 0 ).attr( 'src', v.img );
	image.find( 'p' ).eq( 0 ).html( v[ 'tex-' + G.lang ] );
	position.html( `${index + 1}${G.cfg.gallery.position_sep}${d.images.length}` );
    };

    close.on({
	'click': function(){
	    cnt.remove();
	    body.removeClass( 'locked' )
	}
    });

    prev.on({ 'click': function() { show( -1 ); }});
    next.on({ 'click': function() { show( 1 ); }});

    body.append( cnt );
    body.addClass( 'locked' );
}

function open_event( d ) {
    const cnt = $( _.template( Template.events_panel )( {v: d} ) ),
          close = cnt.find( '[name=close]' ),
          body = $( 'body' );

    close.on({
	'click': function(){
	    cnt.remove();
	    body.removeClass( 'locked' )
	}
    });

    body.append( cnt );
    body.addClass( 'locked' );
}


function ensayo_poetico_generate(eid, style) {
    let v, uri, sid,
	list = [];
    const id = `gep-${eid}`;

    if( style === undefined ){ style = ''; }

    const active = () => {
	G[id] = $( '#' + id );
	G[id].delegate( '.mini .itm', 'click', function() {
	    const $el = $( this ),
		  $pa = $el.parent(),
		  json = JSON.parse( $pa.find( 'script[name=data]' ).eq( 0 ).html() );
	    open_gallery( json, $el.index() );
	});
    };

    const add = ( d, args ) => {
	if( undefined === G[id] ) { active(); }
	console.log(d, args);
	G[id].find( `#${args.id}` ).html(
	    _.template( Template.ensayo_poetico_item )( {v: d, style: style } ) );
    };

    sid = `ep-${eid}`;
    uri = content_url( ['e', eid] );
    list.push( `<div id="${sid}"></div>` );
    yml_load( uri, add, {id: sid} );

    console.log(G, 'aaaa');
    return `<div id="${id}">${ list.join( '' ) }</div>`;
}

function boton_ep_generate(title, image, link) {
    return _.template( Template.ensayo_poetico_boton )({
	title: title,
	image: image,
	link: link
    });
}


function events_list_generate() {
    let v, uri, sid,
	list = [];
    const id = 'events_gallery';

    const active = () => {
	G.events_gallery = $('#'+id);
	G.events_gallery.delegate( '.event .btn.more', 'click', function() {
	    const $el = $( this ),
		  $pa = $el.parent().parent().parent(),
		  json = JSON.parse( $pa.find( 'script[name=data]' ).eq( 0 ).html() );
	    open_event( json );
	});
    };

    const add = ( d, args ) => {
	if( undefined === G.events_gallery ) { active(); }
	G.events_gallery.find( `#${args.id}` ).html(
	    _.template( Template.events_item )( {v: d} ) );
    };

    for( v of G.menues.events ){
	sid = `events-${v}`;
	uri = content_url( ['e', v] );
	list.push( `<div id="${sid}"></div>` );
	yml_load( uri, add, {id: sid} );
    }
    return `<div id="${id}">${ list.join( '' ) }</div>`;
}

function events_list_group_generate(grp) {
    let v, uri, sid,
	list = [];
    const gid = 'events_gallery_grp_'+grp;

    const active = () => {
	G[gid] = $('#'+gid);
	G[gid].delegate( '.event .btn.more', 'click', function() {
	    const $el = $( this ),
		  $pa = $el.parent().parent().parent(),
		  json = JSON.parse( $pa.find( 'script[name=data]' ).eq( 0 ).html() );
	    open_event( json );
	});
    };

    const add = ( d, args ) => {
	if( undefined === G[gid] ) { active(); }
	if(d['groups'].length > 0 &&  d['groups'].indexOf(grp) !== -1 ){
	    G[gid].find( `#${args.id}` ).html(
		_.template( Template.events_grp_item )( {v: d} ) );
	}else{
	    G[gid].find( `#${args.id}` ).remove();
	}
    };

    for( v of G.menues.events ){
	sid = `events-grp-${v}`;
	uri = content_url( ['e', v] );
	list.push( `<div id="${sid}"></div>` );
	yml_load( uri, add, {id: sid} );
    }
    return `<div id="${gid}" class="events_gallery_grp">${ list.join( '' ) }</div>`;
}


function html_slide( images ) {
    let interval, slide, image, menu, btns,
	j, i = 0;

    const dat = { id: 'slide-' + Date.now(), images: images},
          ac = 'actual';

    const show_image = () => {
	clearInterval(interval)
	interval = setInterval( show_image, images[i][1] * 1000 );
	setTimeout( () => {
            image.attr( 'src', images[i][0] );
	    if ( interval ) {
		i += 1;
		if( i >= images.length ) i = 0;
	    }
	}, 1000 );
    };

    const active = () => {
	slide = $( `#${dat.id}` );
	image = slide.find( '.image img.front' ).eq( 0 );
	interval = setInterval( show_image, images[i][1] * 1000 );
	menu = slide.find( 'ul' ).eq( 0 );
	for ( j in _.range( 0, images.length ) ) {
	    menu.append( `<li data-idx="${j}"></li>` );
	}
	btns = menu.find( 'li' );
	btns.on({
	    click: function() {
		i = parseInt( $( this ).data( 'idx' ) );
		show_image();
		clearInterval( interval );
		interval == false;
	    }
	});
	image.on({
	    load: function(){
		image.hide();
		image.fadeIn( 1000 );
		btns.removeClass( ac )
		btns.eq( i - 1 ).addClass( ac );
	    }
	});
	show_image();
    };

    setTimeout( active, 500 );
    return _.template( Template.html_slide )( dat );
}

function menu_pages_set(url, estado){
    $(`#menu_pages [href="${url}"]`).eq(0).addClass(estado);
}

function page_title_add(tex_nue){
    let title = $('title').eq(0),
	tex_ori = title.text();

    title.html(`${tex_ori} - ${tex_nue}`);
}
