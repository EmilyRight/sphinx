//import 'babel-polyfill'
import $ from 'jquery'
import { WOW } from './vendor/wow.min.js'

window.jQuery = window.$ = $;
require('waypoints/lib/jquery.waypoints.js');
require('jquery.easing');


////////// DocReady //////////
$(function(){
    detectDevice();
    videoTeaser();
    faqOpener()
    new WOW().init();

    goNextSection()


    /// Waypoints
    $('.section-layer').waypoint(function(dir){pointThis(dir, this)},{offset: '20%'});
    function pointThis(d,el){let $el = $(el.element);
        (d === 'down')? $el.addClass('on_point') : $el.removeClass('on_point');
    }



//window.addEventListener("resize", () => {getOrientation();}, true);
//window.addEventListener("orientationchange", () => {startGame()}, false);
}); //end DocReady
//////////////////////////////


function videoTeaser(){
    let startedClass = 'is_started',
        savingClass = 'device-suspended-mode',
        offsetPause = 400,
        selectorVideo = '#video-teaser';

    let vd = document.querySelector(selectorVideo);

    //change video source on HD
    //let hdVideoUrl = './video/video.h264.mp4'; ($(window).width() >=960)? vd.src = hdVideoUrl : null;

    function playPause(){
        let scrolled = window.pageYOffset || document.documentElement.scrollTop, state = vd.paused;
        if(+scrolled >= offsetPause && !state){vd.pause()}
        else if(+scrolled < offsetPause && state){vd.play()}
    }

    let readyPlay = vd.play();
    if(readyPlay !== undefined){
        readyPlay.then(function(){
            window.addEventListener('scroll', playPause);
            vd.classList.add(startedClass);
        }).catch(function(err){//console.warn('Automatic playback failed.');
            vd.classList.add(savingClass);
            $('.teaser,body').on('touchstart', function(){
                if(!vd.playing){vd.play();vd.classList.add(startedClass);}
            });
        });
    }
}
function setActive(arr) {
    const activeClassName = 'active';
    arr.forEach((el) => {
      const itemText = el.childNodes[3]; // хардкод текстового дочернего узла
      if (el.classList.contains(activeClassName)) {
        itemText.style.transition = 'none';
        el.classList.remove(activeClassName);
      }
    });
}

function faqOpener() {
    const itemsList = document.querySelectorAll('.faq__item');
    const activeClassName = 'active';
    const openedClassName = 'faq_opened';
    const faqBlock = document.querySelector('.faq');
    const faqTitle = document.querySelector('.faq__title');
    itemsList.forEach((item) => {
      item.addEventListener('click', () => {
        const itemText = item.childNodes[3]; // хардкод текстового дочернего узла
        if (item.classList.contains(activeClassName)) {
          itemText.style.transition = 'none';
          item.classList.remove(activeClassName);
        } else {
          setActive(itemsList);
          itemText.style.transition = '0.2s ease-in-out';
          item.classList.add(activeClassName);
        }
      });
    });
  }

//scroll-to
function goNextSection() {

    const goNextBtns = document.querySelectorAll('.js-go-next');
    const sectionsList = document.querySelectorAll('section');

    goNextBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
          const btnParentNode = btn.closest('section');

        let sectionToScrollTo;
        sectionsList.forEach((el, index) => {
          if (el === btnParentNode) {
              sectionToScrollTo = sectionsList[index + 1];

            scrollToElement(sectionToScrollTo);
          }
        });
      });
    });
  }

  function scrollToElement(el) {
    const offs = 0;
    const y = el.getBoundingClientRect().top + window.pageYOffset + offs;
    window.scrollTo({ top: y, behavior: 'smooth' }); // element.scrollIntoView();
  }

/// Detect device
function detectDevice() {
    let deviceOs = getMobileOs();
    document.querySelector('body').classList.add('platform_' + deviceOs);
}
function getMobileOs(){
    let uA = navigator.userAgent || navigator.vendor || window.opera;

    if(/android/i.test(uA)) {return 'android'}
    if(/iPad|iPhone|iPod/.test(uA) && !window.MSStream){return 'ios'}
    return 'unknown'
}
function getOrientation(){
    let orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait"; //  return orientation;
}


//animate digit
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if(progress < 1) {window.requestAnimationFrame(step)}
    };
    window.requestAnimationFrame(step);
}