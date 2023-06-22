/* eslint-disable no-use-before-define */
// import 'babel-polyfill'
import $ from 'jquery';
import { WOW } from './vendor/wow.min';
import { gtmSet, gaPush } from './gtm-events';
import Animations from './animations';

window.jQuery = window.$ = $;
require('waypoints/lib/jquery.waypoints');
require('jquery.easing');

/// /////// DocReady //////////
const animations = new Animations();
window.addEventListener('load', () => {
  goNextSection();
  detectDevice();
  faqOpener();
  animations.init();
  // video
  videoTeaser();
  new WOW().init();
  gtmSet();

  if (animations.screenWidth < 600) {
    freeze();
  }
});

function videoTeaser() {
  const startedClass = 'is_started';
  const savingClass = 'device-suspended-mode';
  const offsetPause = 400;
  const selectorVideo = '#video-teaser';

  const vd = document.querySelector(selectorVideo);

  // change video source on HD
  // let hdVideoUrl = './video/video.h264.mp4';
  // ($(window).width() >=960)? vd.src = hdVideoUrl : null;

  function playPause() {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop; const
      state = vd.paused;
    if (+scrolled >= offsetPause && !state) {
      vd.pause();
    } else if (+scrolled < offsetPause && state) {
      vd.play();
    }
  }

  const readyPlay = vd.play();
  if (readyPlay !== undefined) {
    readyPlay.then(() => {
      window.addEventListener('scroll', playPause);
      vd.classList.add(startedClass);
    }).catch((err) => { // console.warn('Automatic playback failed.');
      vd.classList.add(savingClass);
      $('.teaser,body').on('touchstart', () => {
        if (!vd.playing) { vd.play(); vd.classList.add(startedClass); }
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

// scroll-to
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

function toggleClasses() {
  const { body } = document;
  const page = document.querySelector('.page');
  const modal = document.querySelector('.ice-modal');
  body.classList.toggle('noscroll');
  page.classList.toggle('freezed');
  modal.classList.toggle('hidden');
}

function freeze() {
  const connectBtn = document.querySelector('.btn-primary');
  const modal = document.querySelector('.ice-modal');

  if (document.documentElement.clientWidth <= 600) {
    connectBtn.addEventListener('click', (event) => {
      event.preventDefault();
      toggleClasses();
      modal.addEventListener('animationend', () => {
        onAnimationComplete();
      });
    });
  }
}

function onAnimationComplete() {
  const connectBtn = document.querySelector('.btn-primary');
  window.location = connectBtn.href;
  setTimeout(() => {
    toggleClasses();
  }, 5000);
}

/// Detect device
function detectDevice() {
  const deviceOs = getMobileOs();
  document.querySelector('body').classList.add(`platform_${deviceOs}`);
}

function getMobileOs() {
  const uA = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(uA)) { return 'android'; }
  if (/iPad|iPhone|iPod/.test(uA) && !window.MSStream) { return 'ios'; }
  return 'unknown';
}
