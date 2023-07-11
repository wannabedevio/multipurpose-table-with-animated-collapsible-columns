/**
 * demo.js
 *
 * Licensed under the MIT license.
 * https://opensource.org/license/mit/
 * 
 * Copyright 2023, WANNABEDEV
 * https://wannabedev.io
 */

 const initTable = () => {
  const tableWrapper = document.querySelector('.table-wrapper');
  const loader = document.querySelector('.loader');
  const triggers = document.querySelectorAll('.trigger');
  const tableRows = document.querySelectorAll('tbody tr');

  imagesLoaded(tableWrapper).on('done', () => {
    loader.classList.add('is-loaded');

    triggers.forEach((trigger, index) => {
      const thisTH = trigger;
      const thisItem = trigger.querySelector('p');
      const thisItemSpan = trigger.querySelector('span');
      const t = gsap.timeline().paused(true); // Create a paused timeline
      const rev = true; // Start with reversed animation

      t
        .set(thisTH, {
          className: '+=active'
        })
        .to(thisItem, {
          rotation: 0,
          transformOrigin: "50% 50%",
          paddingLeft: 96,
          paddingRight: 96,
          force3D: true,
          ease: "sine.inOut",
          duration: 0.15
        })
        .to(thisItemSpan, {
          rotation: 0,
          transformOrigin: "50% 50%",
          paddingLeft: 12,
          paddingRight: 12,
          force3D: true,
          ease: "sine.inOut",
          duration: 0.15
        }, '-=0.075');

      tableRows.forEach((row) => {
        const cells = row.querySelectorAll('td');

        cells.forEach((cell) => {
          if (index === cell.cellIndex - 1) {
            t
              .to(cell.querySelector('span'), {
                width: 'inherit',
                maxWidth: '232px',
                duration: 0.15
              }, '-=0.075')
              .to(cell.querySelector('span'), {
                whiteSpace: 'initial',
                height: 'auto',
                autoAlpha: 1,
                y: 8,
                ease: "sine.inOut",
                duration: 0.15
              }, '-=0.075');
          }
        });
      });

      t.reversed(rev);
      trigger.animation = t;
    });

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', function () {
        if (this.animation.reversed()) {
          this.animation.play();
        } else {
          this.animation.reverse();
        }
      });
    });
  });
};

initTable();
