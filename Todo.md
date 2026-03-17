flip fold transitions when in the about section

The one you're describing — where the current slide folds away like a door on a hinge using rotateX with transform-origin at the edge — is called a Flip/Fold transition, sometimes referred to as a page fold or trapdoor effect in CSS animation libraries. In tools like Swiper.js it's called the flip effect, and in PowerPoint/Keynote it's the "Flip" or "Cube" family.

.deck {
  perspective: 900px; /* gives the 3D depth */
}

.slide {
  transform-origin: bottom center; /* hinge point */
  transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
}

/* outgoing slide folds away */
.slide.exit {
  transform: rotateX(90deg);
}

/* incoming slide folds in from behind */
.slide.enter {
  transform-origin: top center;
  transform: rotateX(-90deg); /* starts folded, animates to 0 */
}


split open transition when scrolling between projects


Taffy pull transitions on contact section

Page peel on services