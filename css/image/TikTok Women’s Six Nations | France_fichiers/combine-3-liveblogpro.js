var liveblogpro=liveblogpro||function(n,t){var i={delayImages:!0,dynamicTime:!0},r,p=!!n.createElementNS&&!!n.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,w=navigator.userAgent,e,a,o=!1,u=!1,s=function(){},l=function(n){return new Date(n.replace(/\.\d+/,"").replace(/-/,"/").replace(/-/,"/").replace(/T/," ").replace(/Z/," UTC").replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"))},b=function(){this.ts||(this.setAttribute("title",this.innerHTML),this.ts=l(this.getAttribute("datetime")));var f=(new Date).getTime()-this.ts.getTime(),n=Math.abs(f)/1e3,i=n/60,r=i/60,t=r/24,u=t/365;this.innerHTML=n<5&&"Now"||n<15&&"10s"||n<25&&"20s"||n<45&&"30s"||n<90&&"1m"||i<45&&"%dm".replace(/%d/i,Math.round(i))||i<90&&"1h"||r<24&&"%dh".replace(/%d/i,Math.round(r))||r<42&&"1d"||t<30&&"%dd".replace(/%d/i,Math.round(t))||t<45&&"1mon"||t<365&&"%dmon".replace(/%d/i,Math.round(t/30))||u<1.5&&"1year"||"%dyear".replace(/%d/i,Math.round(u))},f=function(n){for(var i=r.getElementsByTagName("time"),u=n?function(){this.innerHTML=this.getAttribute("title")}:b,t=0;t<i.length;t++)u.call(i[t])},h=function(t){var r=n.createElement("li");return r.setAttribute("id",t.i),t.c&&r.setAttribute("class","lbp-item-coloured lbp-item-coloured-"+t.c),r.innerHTML='<div class="lbp-item-time">'+(t.s?'<time datetime="'+t.s+'">'+t.t+"<\/time>":"")+"<\/div>"+(t.o?'<div class="lbp-item-icon"><img src="https://icons.liveblogpro.com/'+t.o+"."+(p?"svg":"png")+'" width="40" height="40"><\/div>':"")+'<div class="lbp-item-entry">'+(t.m?t.m:"")+(t.e?'<div class="lbp-item-embed">'+(i.delayImages?t.e.replace(/<img src="/g,'<img data-src="'):t.e)+"<\/div>":"")+"<\/div>"+(t.a&&i.authors?'<div class="lbp-item-author">'+(t.a.a?'<img src="'+t.a.a+'" alt="'+t.a.i+'" width="20" height="20"> ':"")+t.a.n+"<\/div>":""),r},v=function(t){var i=n.getElementById("lbp-item-status"),r;i?(r=i.getElementsByTagName("p"),r&&(r[0].innerHTML=t,i.className="lbp-item-coloured lbp-item-coloured-red")):y({m:"<p>"+t+"<\/p>",c:"red",i:"lbp-item-status"},!0)},y=function(n,t){function e(){u++;u>100?(clearInterval(f),i.style.display="block"):(i.style.filter="alpha(opacity="+u+")",i.style.MozOpacity=i.style.KhtmlOpacity=i.style.WebkitOpacity=i.style.opacity=u/100)}var i=h(n),u,f;!o||t?r.insertBefore(i,r.firstChild):r.appendChild(i);u=0;f=setInterval(e,8)},k=function(){try{var t=new Faye.Client("https://updates.liveblogpro.com/io"),r=n.getElementById("lbp-headline"),e=n.getElementById("lbp-summary"),o=t.subscribe("/"+i.id,function(i){var o,c,v,p,l;switch(i.type){case"message":o=i.data;c={i:o._id};o.msg&&(c.m=o.msg);o.author&&(c.a={n:o.author.name,a:o.author.avatar,i:o.author.initials});o.time&&(c.s=o.time,v=new Date(o.time),isNaN(v)&&(m=o.time.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d*)?Z$/))&&(v=new Date(Date.UTC(+m[1],+m[2]-1,+m[3],+m[4]||0,+m[5]||0,+m[6]||0,parseInt(+m[7]*1e3)||0))),p=new Date(v.getTime()+(a+v.getTimezoneOffset()*60)*1e3),c.t=("0"+p.getHours()).slice(-2)+":"+("0"+p.getMinutes()).slice(-2));o.icon&&(c.o=o.icon);o.colour&&o.colour!=""&&(c.c=o.colour);o.embed&&o.embed.html&&(c.e=o.embed.html);o.type=="new"?y(c):(l=n.getElementById(o._id),l&&l.parentNode.replaceChild(h(c),l));u&&f();break;case"delete":l=n.getElementById(i.data);l&&l.parentNode.removeChild(l);break;case"title":r&&(r.innerHTML=i.data);break;case"atf":e&&(e.innerHTML=i.data);break;case"end":n.getElementById("lbp-status").style.display="none";n.getElementById("lbp-date").style.display="";t.disconnect()}s()});o.errback(function(){v("Warning: Could not connect you to this live event");server.disconnect()})}catch(c){v("Warning: Live update server could not be reached")}},c=n.getElementsByTagName("head")[0]||n.documentElement;return{load:function(t){var u,r;for(u in t)i[u]=t[u];i.at&&i.id&&(r=n.createElement("script"),r.type="text/javascript",r.src="//data.liveblogpro.com/"+(i.team?"t":"f")+"/v1/"+i.at+"-"+i.id+".js",c.appendChild(r))},data:function(v){var ft=n.getElementById("liveblogpro"),it,p,et,ot,vt,b,yt,pt,rt,st,ht,g,nt,y,lt,ut,at,d;if(v&&v.u&&ft){for(i.id=v.id||i.id,i.at=v.at||i.at,it=n.getElementsByTagName("style"),p=n.createElement("style"),p.type="text/css",et="#lbp,#lbp div,#lbp span,#lbp object,#lbp iframe,#lbp h1,#lbp h2,#lbp h3,#lbp h4,#lbp h5,#lbp h6,#lbp p,#lbp blockquote,#lbp a,#lbp em,#lbp img,#lbp strong,#lbp b,#lbp u,#lbp i,#lbp center,#lbp hr,#lbp ol,#lbp ul,#lbp li,#lbp time,#lbp embed,#lbp audio,#lbp video{margin:0;padding:0;border:0;outline:0;font:inherit;font-size:100%;vertical-align:baseline;position:relative}#lbp{cursor:default}#lbp strong,#lbp b{font-weight:bold}#lbp em,#lbp i{font-style:italic}#lbp a img{border:0}#lbp #lbp-headline{font-size:2.3em;line-height:1em;font-weight:bold}#lbp #lbp-headline,#lbp #lbp-summary{overflow:auto}#lbp #lbp-headline,#lbp #lbp-meta{padding:0 0 6px}#lbp #lbp-summary{padding:0 0 8px}#lbp #lbp-meta{font-size:1.1em;font-weight:bold}#lbp #lbp-meta a{display:block;overflow:hidden;float:right;width:16px;height:13px;margin:3px 0 0 4px;text-indent:-999px;background:url('//embed.liveblogpro.com/full.v1.s.png') no-repeat 13px 16px}#lbp #lbp-meta #lbp-reverse{background-position:1px -224px}#lbp #lbp-meta #lbp-timestamps{background-position:1px -237px}#lbp #lbp-meta #lbp-timestamps.dynamic{background-position:1px -250px}#lbp #lbp-meta #lbp-reverse.reversed{-moz-transform:rotate(180deg);-ms-transform:rotate(180deg);-webkit-transform:rotate(180deg);transform:rotate(180deg);image-rendering:-moz-crisp-edges}#lbp p{margin:8px 0;clear:none}#lbp blockquote{display:block;padding:0 5px 0 24px;background:url('//embed.liveblogpro.com/full.v1.s.png') no-repeat 0 -311px;min-height:13px;font-size:.9em;margin:10px 0 10px 2px}#lbp hr{clear:both;border:0;width:100%;height:1px;color:#ccc;background-color:#ccc;margin:0 auto}#lbp #lbp-items{list-style:none;padding:6px 0 0 2px}#lbp #lbp-items li{clear:both;margin:0 0 20px;background:none;text-indent:0;list-style-type:none}#lbp #lbp-items #lbp-more{border:1px solid #ccc;padding:10px;text-align:center}#lbp #lbp-items li .lbp-item-time,#lbp #lbp-items li .lbp-item-icon{float:left}#lbp #lbp-items li .lbp-item-time{width:47px;height:25px;font-weight:bold}#lbp #lbp-items li .lbp-item-time time{-moz-opacity:.7;filter:alpha(opacity=70);opacity:.7}#lbp #lbp-items li .lbp-item-icon{width:40px;height:40px;margin-bottom:20px}#lbp #lbp-items.lbp-authors-avatars li .lbp-item-time,#lbp #lbp-items.lbp-authors-initials li .lbp-item-time{width:80px}#lbp #lbp-items li .lbp-item-entry{margin:8px 0 8px 0;-moz-hyphens:auto;-webkit-hyphens:auto;-ms-hyphens:auto;hyphens:auto;white-space:pre-wrap;word-wrap:break-word}#lbp #lbp-items li .lbp-item-author{display:none;height:20px;margin:0 0 20px 0;font-size:.8em;-moz-opacity:.8;filter:alpha(opacity=80);opacity:.8}#lbp #lbp-items li .lbp-item-author,#lbp #lbp-items li .lbp-item-entry{margin-left:95px}#lbp #lbp-items li .lbp-item-author img{vertical-align:middle;margin-right:5px}#lbp #lbp-items.lbp-show-authors li .lbp-item-author{display:block}#lbp #lbp-items li.lbp-item-coloured .lbp-item-entry{border-left:5px solid #999;padding:0 10px}#lbp #lbp-items li.lbp-item-coloured-red .lbp-item-entry{border-left-color:#bf0506!important}#lbp #lbp-items li.lbp-item-coloured-orange .lbp-item-entry{border-left-color:#e98c15!important}#lbp #lbp-items li.lbp-item-coloured-green .lbp-item-entry{border-left-color:#148d00!important}#lbp #lbp-items li.lbp-item-coloured-blue .lbp-item-entry{border-left-color:#000c63!important}#lbp #lbp-items li.lbp-item-coloured-purple .lbp-item-entry{border-left-color:#47025b!important}#lbp #lbp-items li.lbp-item-coloured-fuchsia .lbp-item-entry{border-left-color:#d9005b!important}#lbp #lbp-items li.lbp-item-coloured-grey .lbp-item-entry{border-left-color:#919191!important}#lbp #lbp-items li.lbp-item-coloured-black .lbp-item-entry{border-left-color:#000!important}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed>div{color:#000;display:inline-block;max-width:100%;padding:9px;background-color:#f5f5f5;border:1px solid #e9e9e9;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed>.embed-twitter,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed>.embed-facebook,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed>.embed-soundcloud,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed>.embed-audioboo{display:block}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed img{max-width:100%;height:auto;vertical-align:bottom;display:inline-block;min-height:1px;min-width:1px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed>.embed-upload-img img{background-color:#fff}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed a{color:#5f5f5f;text-decoration:none}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-meta{padding-top:5px;margin-bottom:-3px;font-size:.8em;line-height:16px;min-height:16px;color:#5f5f5f}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-meta .embed-icon{display:inline-block;width:16px;height:16px;background:transparent url('//embed.liveblogpro.com/full.v1.s.png') no-repeat 16px 16px;float:right}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-flickr .embed-meta .embed-icon{background-position:0 0}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-instagram .embed-meta .embed-icon{background-position:0 -16px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-livestream .embed-meta .embed-icon{background-position:0 -32px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-slideshare .embed-meta .embed-icon{background-position:0 -48px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitpic .embed-meta .embed-icon{background-position:0 -64px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-meta .embed-icon{background-position:0 -80px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-vimeo .embed-meta .embed-icon{background-position:0 -96px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-yfrog .embed-meta .embed-icon{background-position:0 -112px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-youtube .embed-meta .embed-icon{background-position:0 -128px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-bambuser .embed-meta .embed-icon{background-position:0 -144px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-ustream .embed-meta .embed-icon{background-position:0 -160px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-meta .embed-icon{background-position:0 -176px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-onedrive .embed-meta .embed-icon{background-position:0 -192px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-vine .embed-meta .embed-icon{background-position:0 -208px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-title,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body{width:auto;z-index:2}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-title,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-title{margin-bottom:4px;overflow:auto}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-title{margin-right:18px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-title a,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-title a{color:#000;font-weight:bold}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-title a span,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-title a span{color:#5f5f5f;font-weight:normal;font-size:.9em}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-title img,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-title img{float:left;margin:0 9px 4px 0;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;max-height:38px;max-width:38px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body a{color:#00aced}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body a:hover{text-decoration:underline}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter>.embed-meta{position:static;text-align:right;padding-top:3px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter>.embed-meta>a{position:static;margin-right:4px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed div>.embed-meta .embed-actions{float:left;display:none}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed:hover div>.embed-meta .embed-actions{display:block}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed div>.embed-meta .embed-actions li{display:inline}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed div>.embed-meta .embed-actions li a{float:left;background:url('//embed.liveblogpro.com/full.v1.s.png') no-repeat 22px 15px;width:22px;height:16px;overflow:hidden;text-indent:22px;margin:0 15px 0 0;-moz-opacity:.6;filter:alpha(opacity=60);opacity:.6}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed div>.embed-meta .embed-actions li a:hover{-moz-opacity:1;filter:alpha(opacity=100);opacity:1}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed div>.embed-meta .embed-actions li .embed-actions-twitter-reply{background-position:1px -263px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed div>.embed-meta .embed-actions li .embed-actions-twitter-retweet{background-position:0 -279px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed div>.embed-meta .embed-actions li .embed-actions-twitter-favourite{background-position:3px -295px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter>.embed-meta .embed-icon{position:absolute;top:9px;right:9px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body .embed-twitter-body-media,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-body .embed-facebook-body-media,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-body .embed-facebook-body-media .embed-facebook-body-media-album img{margin-top:6px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body .embed-twitter-body-media .embed-icon{display:none}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-title a:hover span{text-decoration:underline}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-body .embed-facebook-body-media .embed-facebook-body-media-album a{display:block;margin-top:-2em;padding-top:2em}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-body .embed-facebook-body-media .embed-facebook-body-media-link a{display:block;white-space:normal;border:1px solid #d3dae8;overflow:auto;padding:4px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-body .embed-facebook-body-media .embed-facebook-body-media-link a .embed-facebook-body-media-link-image{float:left;background-color:#f6f7f9;margin:-4px 6px -4px -4px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-body .embed-facebook-body-media .embed-facebook-body-media-link a .embed-facebook-body-media-link-image img{max-height:154px;width:auto}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-body .embed-facebook-body-media .embed-facebook-body-media-link a .embed-facebook-body-media-link-title{font-weight:bold;color:#3b5998}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-facebook .embed-facebook-body .embed-facebook-body-media .embed-facebook-body-media-link a .embed-facebook-body-media-link-domain{margin-bottom:4px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed video,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed audio{height:auto;max-width:100%}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed iframe,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed object,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed embed{display:block;max-width:100%}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-audioboo .embed-audioboo-body iframe{width:100%}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed>.embed-youtube,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed>.embed-vimeo,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed>.embed-vine{width:500px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-youtube .embed-youtube-body,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-vimeo .embed-vimeo-body,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body .embed-twitter-body-media .embed-twitter-body-media-gif,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body .embed-twitter-body-media .embed-twitter-body-media-youtube,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body .embed-twitter-body-media .embed-twitter-body-media-video,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body .embed-twitter-body-media .embed-twitter-body-media-vimeo{position:relative;padding-bottom:56.25%;padding-top:30px;height:0;overflow:hidden}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-vine .embed-vine-body,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body .embed-twitter-body-media .embed-twitter-body-media-vine{position:relative;padding-bottom:100%;padding-top:0;height:0;overflow:hidden}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body .embed-vine{max-width:500px}#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-youtube .embed-youtube-body iframe,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-vimeo .embed-vimeo-body iframe,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-vine .embed-vine-body iframe,#lbp #lbp-items li .lbp-item-entry .lbp-item-embed .embed-twitter .embed-twitter-body .embed-twitter-body-media div iframe{position:absolute;top:0;left:0;width:100%;height:100%}",p.styleSheet?p.styleSheet.cssText=et:p.appendChild(n.createTextNode(et)),it.length>0?it[0].parentNode.insertBefore(p,it[0]):c.appendChild(p),a=v.z,ot=v.l?-1:1,vt=0-ot,v.u.sort(function(n,t){var i=l(n.s),r=l(t.s);return i>r?ot:i<r?vt:0}),b='<div id="lbp">',i.notitle||(b+='<h2 id="lbp-headline">'+v.t+"<\/h2>"),b+='<div id="lbp-summary">'+v.a+'<\/div><h3 id="lbp-meta">',b+=(v.l?'<span id="lbp-status">Updating Live <\/span><span id="lbp-date" style="display:none;">':'<span id="lbp-date">')+v.d+' <\/span><a href="#" id="lbp-reverse" title="Reverse chronological order of updates">Reverse order<\/a> <a href="#" id="lbp-timestamps" title="Switch between absolute and relative timestamps">Timestamp format<\/a><\/h3>',b+='<hr><ol id="lbp-items"'+(i.authors?' class="lbp-show-authors"':"")+">",b+="<\/ol><hr><\/div>",ft.innerHTML=b,yt="o",r=n.getElementById("lbp-items"),(typeof i.pageSize!="number"||i.pageSize<1||i.pageSize%1!=0||w.toLowerCase().indexOf("b"+yt+"t")!=-1)&&(i.pageSize=!1),pt=i.pageSize?i.pageSize:v.u.length,d=0;d<pt;d++)if(r.appendChild(h(v.u.shift())),!v.u.length){i.pageSize=!1;break}if(i.pageSize&&(e=v.u,rt=n.createElement("li"),rt.setAttribute("id","lbp-more"),rt.innerHTML="Loading more...",r.appendChild(rt)),n.getElementById("lbp-reverse").onclick=function(){var c,l;o=!o;var a=r.parentNode,y=r.nextSibling,t=r.ownerDocument.createDocumentFragment(),v=r.ownerDocument.createDocumentFragment();for(i.pageSize&&(c=n.getElementById("lbp-more"),c&&c.parentNode.removeChild(c)),a.removeChild(r);r.lastChild;)r.lastChild.nodeName.toLowerCase()=="li"&&r.lastChild.id!="lbp-item-status"?t.appendChild(r.lastChild):v.appendChild(r.lastChild);if(i.pageSize){while(e.length>0)l=h(e.shift()),o?t.insertBefore(l,t.firstChild):t.appendChild(l);i.pageSize=!1}return r.appendChild(v),r.appendChild(t),a.insertBefore(r,y),this.className=o?"reversed":"",u&&f(),s(),!1},n.getElementById("lbp-timestamps").onclick=function(){return f(u),u=!u,this.className=u?"":"dynamic",!1},st=n.createElement("div"),st.innerHTML="<!--[if lte IE 8]><i><\/i><![endif]-->",st.getElementsByTagName("i")[0]&&(n.getElementById("lbp-timestamps").style.display="none"),i.delayImages||i.pageSize){function wt(t,i,r){return n.elementFromPoint(t,i)&&n.elementFromPoint(t,i).contains(r)}function bt(n,t){var i=n.getBoundingClientRect(),f=i.left,r=i.top,u=i.bottom;return(r>0&&r<=t||u>0&&u<=t)&&(wt(f,r,n)||wt(f,u,n))}ht={overflow:"overflow","overflow-x":"overflowX","overflow-y":"overflowY"};function kt(n){var i={},t;for(index in ht)t="auto",n.currentStyle?t=n.currentStyle[ht[index]]:window.getComputedStyle&&(t=document.defaultView.getComputedStyle(n,null).getPropertyValue(index)),i[t]=!0;return"scroll"in i||"auto"in i}function tt(){var a=t.innerHeight!==undefined?t.innerHeight:(n.documentElement||n.body.parentNode||n.body).clientHeight,c,l,o;if(i.delayImages)for(c=r.getElementsByTagName("img"),o=0;o<c.length;o++)c[o].getAttribute("data-src")&&bt(c[o],a)&&(c[o].src=c[o].getAttribute("data-src"),c[o].removeAttribute("data-src"));if(i.pageSize&&(l=n.getElementById("lbp-more"),l&&bt(l,a))){for(o=0;o<i.pageSize;o++)if(r.insertBefore(h(e.shift()),l),!e.length){l.parentNode.removeChild(l);i.pageSize=!1;break}u&&f();s()}}s=function(){for(var n=r;n instanceof Element;)kt(n)&&tt.call(n),n=n.parentNode;tt.call(t)};function ct(n,t,i){n!=null&&n!=undefined&&(n.addEventListener?n.addEventListener(t,i,!1):n.attachEvent?n.attachEvent("on"+t,i):n["on"+t]=i)}for(g=r;g instanceof Element;)kt(g)&&ct(g,"scroll",tt),g=g.parentNode;ct(t,"scroll",tt);ct(t,"resize",tt);s()}for(nt=n.createElement("iframe"),nt.src="//www.liveblogpro.com/stats/"+i.at+"-"+i.id,nt.style.width=nt.style.height="0px",nt.style.display="none",ft.appendChild(nt),v.l&&(i.dynamicTime&&(u=!0,f(),n.getElementById("lbp-timestamps").className="dynamic"),y=n.createElement("script"),y.type="text/javascript",y.src="//www.liveblogpro.com/j/client.0.8.9.js",c.appendChild(y),lt=!1,y.onload=y.onreadystatechange=function(){lt||this.readyState&&this.readyState!=="loaded"&&this.readyState!=="complete"||(lt=!0,y.onload=y.onreadystatechange=null,k())}),setInterval(function(){u&&f()},6e4),function(){function r(n){n=n||t.event;for(var r=n.target||n.srcElement,c,l,h;r&&r.nodeName.toLowerCase()!=="a";)r=r.parentNode;r&&r.nodeName.toLowerCase()==="a"&&r.href&&(c=r.href.match(e),c&&(l=Math.round(s/2-u/2),h=0,f>i&&(h=Math.round(f/2-i/2)),t.open(r.href,"intent",o+",width="+u+",height="+i+",left="+l+",top="+h),n.returnValue=!1,n.preventDefault&&n.preventDefault()))}if(!t.__twitterIntentHandler){var e=/twitter\.com(\:\d{2,4})?\/intent\/(\w+)/,o="scrollbars=yes,resizable=yes,toolbar=no,location=yes",u=550,i=420,f=screen.height,s=screen.width;n.addEventListener?n.addEventListener("click",r,!1):n.attachEvent&&n.attachEvent("onclick",r);t.__twitterIntentHandler=!0}}(),ut=n.createElement("script"),ut.type="text/javascript",ut.src="https://platform.vine.co/static/scripts/embed.js",c.appendChild(ut),at=document.querySelectorAll('iframe[src*="vine.co"]'),d=0;d<at.length;d++)at[d].className+=" loaded"}}}}(document,window);