const Template = {};

Template.pages = `
<ul>[[ _.each(items, function(v){ ]]
  <li><a href="#p:[[= v ]]">[[= title_pages(v) ]]</a></li>
[[ }); ]]</ul>`;

Template.series = `
<ul>[[ _.each(items, function(v){ ]]
  <li><a href="#s:[[= v ]]">[[= title_series(v) ]]</a></li>
[[ }); ]]</ul>`;

Template.events = `
<ul>[[ _.each(items, function(v){ ]]
  <li><a href="#e:[[= v ]]">[[= title_events(v) ]]</a></li>
[[ }); ]]</ul>`;

Template.rrss = `
<ul>[[ _.each(items, function(v){ ]]
  <li><a href="[[= G.cfg[v].url ]]" target="_blank" title="[[= G.cfg[v].name ]]"><img alt="[[= G.cfg[v].name ]]" src="[[= G.cfg[v].icon ]]"></a></li>
[[ }); ]]</ul>`;

Template.ensayo_poetico_boton = `
<div class="btn-ep mobile">
  <a href="[[= link ]]" style="background-image: url('[[= image ]]')">
    <span>[[= title ]]</span>
  </a>
</div>`;


Template.ensayo_poetico_item = `
<section class="gallery [[= style ]]">
  <h2>[[= v['title-'+G.lang] ]]</h2>
  <div class="description">[[= marked(v['description-'+G.lang]) ]]</div>
  <ul class="mini">
    <script name="data" type="text/json">[[= JSON.stringify(v) ]]</script>
    [[ _.each(v['images'], function(w, i){
          w['_title'] = w['tex-'+G.lang] || '';
          if( i < G.cfg.gallery.mini_max ){
      ]]
      <li class="itm">
        <img src="[[= w.img ]]" title="[[= w._title ]]">
      </li>
    [[ } }) ]]
    [[ if( v.images.length > G.cfg.gallery.mini_max ){ ]]
      <li class="itm more">[[= v['images'].length - G.cfg.gallery.mini_max ]]</li>
    [[ } ]]
  </ul>
</section>`;

Template.gallery_panel = `
<div id="gallery_panel">
  <div class="cnt">
    <nav>
      <button name="prev"></button>
      <i name="position">[[= i + 1 ]][[= G.cfg.gallery.position_sep]][[= d.images.length ]]</i>
      <button name="next"></button>
      <strong>[[= d['title-'+G.lang] ]]</strong>
      <button name="close"></button>
    </nav>
    <div class="image" data-index="[[= i ]]">
      <div>
      [[= marked(d.images[i]['tex-'+G.lang] || '') ]]
      [[ if( d.images[i]['ph'] !== undefined ){ ]]
      <span class="ph">Ph.
        <a href="[[= G.cfg.creditos[ d.images[i]['ph'] ][1] ]]" target="_blank">
        [[= G.cfg.creditos[ d.images[i]['ph'] ][0] ]]
        </a>
      </span>
      [[ } ]]
      </div>
      <img src="[[= d.images[i].img ]]">
    </div>
  </div>
</div>`;


Template.events_item = `
<section class="event">
  <script name="data" type="text/json">[[= JSON.stringify(v) ]]</script>
  <div class="image"><img src="./img/events/[[= v['images'][0] ]]"></div>
  <div class="text">
    <h2>[[= v['title-'+G.lang] ]]</h2>
    <div>
      <b class="btn more">+</b>
      <i class="date">[[= v['date'] ]]</i>
    </div>
  </div>
</section>`;

Template.events_grp_item = `
<section class="event">
  <script name="data" type="text/json">[[= JSON.stringify(v) ]]</script>
  <div class="btn more"><b>+</b> [[= v['title-'+G.lang] ]]</div>
</section>`;

Template.events_panel = `
<div id="events_panel">
  <div class="cnt">
    <nav>
      <b class="type">EVENTO:  [[= v['type'] ]]</b>
      <strong class="date">[[= v['date'] ]]</strong>
      <button name="close"></button>
    </nav>
    <div class="text">
      <h2>[[= v['title-'+G.lang] ]]</h2>
      <div>
	<div>[[= v['text-'+G.lang] || '' ]]</div>
	<br>
      </div>
    </div>
    <div class="links">
      <strong>Enlaces</strong>
      <ul>
	[[ for(var link of v.urls) {]]
	<li><a href="[[= link[3] ]]" target="_blank"><img src="./img/icon/[[= link[0] ]].png" alt="[[= link[1] ]]">[[= link[2] ]]</a></li>
	[[ } ]]
      </ul>
    </div>
    <div class="images">
      [[ for(var img of v.images ){ ]]
      <img src="./img/events/[[= img ]]">
      [[ } ]]
    </div>
  </div>
</div>`;


Template.html_slide = `
<div id="[[= id ]]" class="slide">
  <div class="image">
    <img class="back" src="[[= ruta ]][[= mb ]][[= images[0][0] ]]">
    <img class="front" src="./img/empty.svg">
  </div>
  <ul></ul>
</div>`;
