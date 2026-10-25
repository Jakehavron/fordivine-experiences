/* FORDIVINE tree navigation. Shared by React preview and static export. */
(function () {
  'use strict';
  function init(root) {
    if (root.dataset.treeReady) return;
    root.dataset.treeReady = 'true';
    var aside = root.closest('.article-tree-toc'), details = aside.querySelector('details'), summary = details.querySelector('summary');
    var links = Array.from(root.querySelectorAll('ol a')), rows = links.map(function(a){return a.parentElement;});
    var nodes = links.map(function(a){return document.getElementById(a.hash.slice(1));});
    var pill=root.querySelector('.tree-pill'),marker=root.querySelector('.tree-marker'),accent=root.querySelector('.tree-rail-accent');
    var compact=matchMedia('(max-width:900px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
    var active=0,hovered=null,focused=null,centers=[],end=0,y=0,velocity=0,target=0,frame=0,scrollFrame=0,last=0,measured=false;
    function paint(){
      marker.style.transform='translateY('+(y-3.5)+'px) rotate(45deg)';
      pill.style.transform='translateY('+(y-Number(pill.dataset.height||32)/2)+'px)';
      accent.style.transform='scaleY('+(end?Math.max(0,Math.min(1,y/end)):0)+')';
      marker.style.opacity=pill.style.opacity=accent.style.opacity='1';
    }
    function tick(time){
      var dt=Math.min((time-last)/1000||1/60,.05);last=time;
      var omega=26,d=y-target,v=velocity,c=v+omega*d,e=Math.exp(-omega*dt);
      y=target+(d+c*dt)*e;velocity=(v-omega*c*dt)*e;paint();
      if(Math.abs(y-target)>.05||Math.abs(velocity)>.05) frame=requestAnimationFrame(tick);
      else{frame=0;y=target;velocity=0;paint();}
    }
    function move(index,immediate){
      if(!details.open||!centers.length||index<0)return;
      target=centers[index];var h=rows[index].offsetHeight;pill.style.height=h+'px';pill.dataset.height=String(h);
      if(immediate||reduced.matches||!measured){if(frame)cancelAnimationFrame(frame);frame=0;y=target;velocity=0;paint();}
      else if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}
    }
    function selected(){return hovered!==null?hovered:focused!==null?focused:active;}
    function measure(){
      if(!details.open)return;
      var bounds=root.getBoundingClientRect();centers=rows.map(function(row){var r=row.getBoundingClientRect();return r.top-bounds.top+r.height/2;});
      end=centers.length?centers[centers.length-1]:0;root.style.setProperty('--tree-end',end+'px');move(selected(),true);measured=true;root.dataset.measured='true';
    }
    function setActive(index){
      active=index;links.forEach(function(a,i){rows[i].classList.toggle('is-active',i===index);if(i===index)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
      move(selected(),false);
    }
    function update(){
      scrollFrame=0;var index=0;nodes.forEach(function(node,i){if(node&&node.getBoundingClientRect().top<=145)index=i;});
      if(window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-3)index=nodes.length-1;
      if(index!==active)setActive(index);
    }
    function schedule(){if(!scrollFrame)scrollFrame=requestAnimationFrame(update);}
    function reset(){details.open=!compact.matches;details.dataset.ready='true';summary.tabIndex=compact.matches?0:-1;hovered=focused=null;measure();schedule();}
    root.addEventListener('pointerleave',function(){hovered=null;move(selected(),false);});
    links.forEach(function(a,i){
      a.addEventListener('pointerenter',function(event){if(event.pointerType==='touch')return;hovered=i;move(i,false);});
      a.addEventListener('focus',function(){focused=i;move(i,false);});
      a.addEventListener('blur',function(){focused=null;move(selected(),false);});
      a.addEventListener('click',function(){
        hovered=focused=null;setActive(i);
        if(compact.matches)details.open=false;
        requestAnimationFrame(function(){var node=nodes[i];if(node){node.setAttribute('tabindex','-1');node.focus({preventScroll:true});}});
      });
    });
    summary.addEventListener('click',function(event){if(!compact.matches)event.preventDefault();});
    details.addEventListener('toggle',function(){if(!compact.matches&&!details.open)details.open=true;measure();});
    details.addEventListener('keydown',function(event){if(event.key==='Escape'&&compact.matches&&details.open){details.open=false;summary.focus();}});
    var observer=new ResizeObserver(measure);observer.observe(root);rows.forEach(function(row){observer.observe(row);});
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('hashchange',schedule);window.addEventListener('resize',schedule);
    compact.addEventListener('change',reset);reduced.addEventListener('change',function(){move(selected(),true);});
    reset();update();if(document.fonts)document.fonts.ready.then(measure);
  }
  function boot(){document.querySelectorAll('[data-tree-nav]').forEach(init);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
