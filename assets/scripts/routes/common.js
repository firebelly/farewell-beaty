// Common js
import { CountUp } from 'countup.js';
import appState from '../util/appState';

// Shared vars
let $window = $(window),
    $body = $('body'),
    $document = $(document),
    transitionElements = [],
    resizeTimer;

export default {
  // JavaScript to be fired on all pages
  init() {
    // Transition elements to enable/disable on resize
    transitionElements = [];

    const countUpOptions = {
      duration: 1
    }

    // Init Functions
    _initInView();
    _initNateWalkin();
    _initAcidTrip();

    function _initInView() {
      // Handle Images In View
      function imageObserver(entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("-in-view");

            if (entry.target.classList.contains('stat') && !entry.target.classList.contains('-counted')) {
              let figureContainer = entry.target.querySelector('dt span');
              let figure = figureContainer.textContent;
              let countUp = new CountUp(figureContainer, figure, countUpOptions);
              countUp.start();
              entry.target.classList.add('-counted');
            }
          } else {
            // entry.target.classList.remove("-in-view");
          }
        });
      }

      // Observer Options
      const options = {
        threshold: 0.25
      };

      // Create a new observer
      let observer = new IntersectionObserver(imageObserver, options);

      // The element(s) to observe
      let images = document.querySelectorAll(".observe");

      // Attach them to the observer
      images.forEach((image) => {
        observer.observe(image);
      });

    }

    function _initNateWalkin() {
      let position = 0;
      let bgPos = '0 0';
      let nates = document.querySelectorAll('.walker');

      window.addEventListener('scroll', throttle(walkin, 100));

      function throttle(fn, wait) {
        var time = Date.now();
        return function () {
          if ((time + wait - Date.now()) < 0) {
            fn();
            time = Date.now();
          }
        }
      }

      function walkin() {
        if (position) {
          bgPos = '100% 0';
          position = 0;
        } else {
          bgPos = '0 0';
          position = 1;
        }

        nates.forEach(nate => {
          nate.style.backgroundPosition = bgPos;
        });
      }
    }

    function _initAcidTrip() {
      let width = window.innerWidth,
        height = window.innerHeight,
        canvas = document.getElementById('trip'),
        ctx = canvas.getContext('2d'),
        things = [],
        colors = ['#f0f', '#faf', '#fff'],
        textures = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];

      textures[0].src = 'https://emoji.slack-edge.com/T0J69PRC2/carl/9313727e4eab776e.png';
      textures[1].src = 'https://emoji.slack-edge.com/T0J69PRC2/beaty/f21362ee45ca59e9.png';
      textures[2].src = 'https://emoji.slack-edge.com/T0J69PRC2/hairlessnate/6fbee8545e3874d8.png';
      textures[3].src = 'https://emoji.slack-edge.com/T0J69PRC2/happy-nate/8c6e36a7dbfdffa6.png';
      textures[4].src = 'https://emoji.slack-edge.com/T0J69PRC2/nate-bookin/edfdd7a94964e079.gif';
      textures[5].src = 'https://emoji.slack-edge.com/T0J69PRC2/nate-truckin/c10f0f9ddb3021a7.gif';

      canvas.width = width;
      canvas.height = height;

      class Thing {
        constructor() {
          this.x = width / 2;
          this.y = height / 2;
          this.z = Math.random();
          this.directionX = Math.random() > .5 ? 1 : -1;
          this.directionY = Math.random() > .5 ? 1 : -1;
          this.directionZ = Math.random() > .5 ? 1 : -1;
          this.velocityX = Math.random() * 3;
          this.velocityY = Math.random() * 3;
          this.velocityZ = (Math.random() - .5) / 200;
          this.color = colors[Math.floor(Math.random() * 3)];
          this.texture = textures[Math.floor(Math.random() * textures.length)];
          this.width = 128;
          this.height = 128;
        }

        render() {
          this.x += this.velocityX * this.directionX;
          this.y += this.velocityY * this.directionY;
          this.z += this.velocityZ * this.directionZ;

          if (this.x < 0 || this.x > width - this.width) { this.directionX *= -1; }
          if (this.y < 0 || this.y > height - this.height) { this.directionY *= -1; }
          if (this.z < 0 || this.z > 1) { this.directionZ *= -1; }

          ctx.fillStyle = this.color;
          // ctx.globalAlpha = this.z;

          ctx.beginPath();
          // ctx.arc(this.x, this.y, this.width * Math.abs(this.z), 0, Math.PI * 2, true);
          ctx.drawImage(this.texture, this.x, this.y, this.width * this.z, this.height * this.z);
          ctx.fill();
        }
      }

      for (var i = 0; i < 30; i++) {
        things.push(new Thing());
      }

      let myReq;
      var render = () => {
        // ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < things.length; i++) {
          things[i].render();
        }

        myReq = requestAnimationFrame(render);
      }

      let tripTrigger = document.getElementById('trippin');
      tripTrigger.addEventListener('click', function(e) {
        if (canvas.classList.contains('-active')) {
          canvas.classList.remove('-active');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          cancelAnimationFrame(myReq);
        } else {
          canvas.classList.add('-active');
          render();
        }
      });
    }

    // Disabling transitions on certain elements on resize
    function _disableTransitions() {
      $.each(transitionElements, function() {
        $(this).css('transition', 'none');
      });
    }

    function _enableTransitions() {
      $.each(transitionElements, function() {
        $(this).attr('style', '');
      });
    }

    function _resize() {
      // Disable transitions when resizing
      _disableTransitions();

      // Functions to run on resize end
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Re-enable transitions
        _enableTransitions();
      }, 250);
    }
    $(window).resize(_resize);

  },
  finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
  },
};
