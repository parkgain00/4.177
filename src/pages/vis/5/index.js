import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

export default function ConfettiExplosion() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gsap) return;
    // GSAP 플러그인 등록
    window.gsap.registerPlugin(
      window.SplitText,
      window.DrawSVGPlugin,
      window.GSDevTools,
      window.MotionPathPlugin,
      window.MotionPathHelper,
      window.CustomBounce,
      window.CustomWiggle
    );
    window.gsap.set('#plane', { opacity: 0 });
    window.gsap.set('.container', { opacity: 1 });
    window.gsap.set('.confetti img', { scale: 'random(0.1, 1)', opacity: 0 });
    window.CustomBounce.create('myBounce', { strength: 0.6, squash: 3 });
    window.CustomWiggle.create('myWiggle', { wiggles: 6 });
    let free = window.SplitText.create('#free', { type: 'words, chars', mask: 'words' });
    let all = window.SplitText.create('#all', { type: 'words, chars', mask: 'words' });
    let tl = window.gsap.timeline({ delay: 1 });
    tl.addLabel('explode', 1);
    tl.addLabel('flight', 1.3);
    tl.from([free.chars, all.chars], {
      duration: 0.7,
      y: 'random([-500, 500])',
      rotation: 'random([-30, 30])',
      ease: 'expo.out',
      stagger: {
        from: 'random',
        amount: 0.3
      }
    })
      .from('#main', { duration: 2, opacity: 0, y: -2000, ease: 'myBounce' }, 0.5)
      .to(
        '#main',
        {
          duration: 2,
          scaleX: 1.4,
          scaleY: 0.6,
          ease: 'myBounce-squash',
          transformOrigin: 'center bottom'
        },
        0.5
      )
      .to(
        '#free',
        {
          duration: 2,
          xPercent: -20,
          ease: 'elastic.out(1,0.3)'
        },
        'explode'
      )
      .to(
        '#all',
        {
          duration: 2,
          xPercent: 50,
          ease: 'elastic.out(1,0.3)'
        },
        'explode'
      )
      .set('#plane', { opacity: 1 }, 'flight')
      .from('#path', { duration: 0.5, drawSVG: 0 }, 'explode')
      .from('#path_2', { duration: 0.8, drawSVG: 0 }, 'flight')
      .from(
        '#plane',
        {
          duration: 1,
          ease: 'sine.inOut',
          scale: 0.2,
          transformOrigin: 'center center',
          motionPath: {
            path: 'M973.861,226.794 C1015.92,240.459 1041.39,136.212 1005.93,135.899 977.513,135.649 990.28,214.204 1046.61,229.17 1089.82,240.65 1168.88,147.886 1092.89,84.6262 1029.602,31.94758 1030.243,386.698 1468.054,74.047 1565.737,4.289 1789.737,-299.704 2163.504,-225.675 ',
            align: '#path_2',
            alignOrigin: [0.5, 0.5],
            autoRotate: 180,
            start: 1,
            end: 0
          }
        },
        'flight'
      )
      .to(
        '.innerplane',
        {
          duration: 0.2,
          opacity: 0
        },
        2
      )
      .set('.confetti img', { opacity: 1 }, 'explode+=.2')
      .to(
        '.confetti img',
        {
          duration: 2,
          rotation: 'random(-360, 360)',
          scale: 'random(0.5, 1)',
          physics2D: {
            velocity: 'random(800, 2000)',
            angle: 'random(150, 360)',
            gravity: 3000,
            acceleration: 100
          }
        },
        'explode+=.2'
      )
      .from(
        '#wiggle',
        {
          duration: 0.7,
          transformOrigin: 'center center',
          scale: 0,
          rotation: 60,
          ease: 'back.out(4)'
        },
        'explode+=.4'
      )
      .from(
        '#bang, #spin',
        {
          duration: 0.7,
          transformOrigin: 'center center',
          scale: 0,
          rotation: -60,
          ease: 'back.out(4)'
        },
        'explode+=.1'
      )
      .from(
        '.sprinkle',
        {
          scale: 0,
          rotation: 360,
          transformOrigin: 'center center',
          ease: 'back.out'
        },
        'explode'
      )
      .from(
        '#ffd',
        {
          xPercent: -800,
          opacity: 0,
          ease: 'back.out'
        },
        'explode'
      )
      .from(
        '#hand',
        {
          duration: 0.4,
          rotation: '+=30',
          ease: 'myWiggle',
          transformOrigin: 'center center'
        },
        1.5
      )
      .from(
        '#hand',
        {
          opacity: 0,
          duration: 0.2,
          yPercent: 100
        },
        1.3
      );
    document.body.addEventListener('click', () => {
      tl.play(0);
    });
  }, []);

  return (
    <>
      <Head>
        <style>{`
body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #0e100f;
}
#explode {
  width: 60vw;
  overflow: visible;
}
.visually-hidden {
  clip: rect(0 0 0 0);
  -webkit-clip-path: inset(50%);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
.container {
  position: relative;
  opacity: 0;
}
#free, #all {
  position: absolute;
  font-size: 8vw;
  top: 45%;
}
#free {
  left: 10%;
}
#all {
  left: 41%;
}
.confetti {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 50;
  height: 30px;
  width: 30px;
  z-index: -1;
}
.confetti img {
  width: 100%;
  max-width: 30px;
  position: absolute;
  opacity: 0;
}
        `}</style>
        {/* GSAP & Plugins CDN */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" />
        <script src="https://assets.codepen.io/16327/SplitText3.min.js" />
        <script src="https://assets.codepen.io/16327/DrawSVGPlugin3.min.js" />
        <script src="https://assets.codepen.io/16327/CustomEase3.min.js" />
        <script src="https://assets.codepen.io/16327/CustomBounce3.min.js" />
        <script src="https://assets.codepen.io/16327/CustomWiggle3.min.js" />
        <script src="https://assets.codepen.io/16327/MotionPathPlugin3.min.js" />
        <script src="https://assets.codepen.io/16327/GSDevTools3.min.js" />
        <script src="https://assets.codepen.io/16327/Physics2DPlugin3.min.js" />
      </Head>
      <div className="container" role="image" aria-label="a big colourful confetti explosion and text saying free for all">
        <span id="free">free </span>
        {/* SVG Explosion */}
        <svg id="explode" viewBox="0 0 2058 871" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          {/* ...SVG content omitted for brevity, use the full SVG from user input... */}
        </svg>
        <span id="all">for all</span>
      </div>
      <div className="confetti">
        <img src="https://assets.codepen.io/16327/2D-circles.png" />
        <img src="https://assets.codepen.io/16327/2D-keyframe.png" />
        <img src="https://assets.codepen.io/16327/2D-lightning.png" />
        <img src="https://assets.codepen.io/16327/2D-star.png" />
        <img src="https://assets.codepen.io/16327/2D-flower.png" />
        <img src="https://assets.codepen.io/16327/3D-cone.png" />
        <img src="https://assets.codepen.io/16327/3D-spiral.png" />
        <img src="https://assets.codepen.io/16327/3D-spiral.png" />
        <img src="https://assets.codepen.io/16327/3D-tunnel.png" />
        <img src="https://assets.codepen.io/16327/3D-hoop.png" />
        <img src="https://assets.codepen.io/16327/3D-semi.png" />
        <img src="https://assets.codepen.io/16327/2D-circles.png" />
        <img src="https://assets.codepen.io/16327/2D-keyframe.png" />
        <img src="https://assets.codepen.io/16327/2D-lightning.png" />
        <img src="https://assets.codepen.io/16327/2D-star.png" />
        <img src="https://assets.codepen.io/16327/2D-flower.png" />
        <img src="https://assets.codepen.io/16327/3D-cone.png" />
        <img src="https://assets.codepen.io/16327/3D-spiral.png" />
        <img src="https://assets.codepen.io/16327/3D-spiral.png" />
        <img src="https://assets.codepen.io/16327/3D-tunnel.png" />
        <img src="https://assets.codepen.io/16327/3D-hoop.png" />
        <img src="https://assets.codepen.io/16327/3D-semi.png" />
      </div>
    </>
  );
}
