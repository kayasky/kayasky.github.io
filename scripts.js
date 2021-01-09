const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const introHeader = document.getElementById("intro__header");
const section1 = document.getElementById("section1");
const section2 = document.getElementById("section2");
const section2InitialTop = section2.getBoundingClientRect().top;
const context = canvas.getContext("2d");
let stopAt = 0;

const frameCount = 148;
const introHeaderMaxFontSize = 100;
const introHeaderFontSize = parseInt(window.getComputedStyle(introHeader).fontSize, 10);
const currentFrame = index => (
  `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
)

const preloadImages = () => {
  for (let i = 1; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
  }
};

const img = new Image()
img.src = currentFrame(1);
canvas.width = 1158;
canvas.height = 770;
img.onload = function () {
  context.drawImage(img, 0, 0);
}

const updateImage = index => {
  img.src = currentFrame(index);
  context.drawImage(img, 0, 0);
}

window.addEventListener('scroll', () => {
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;

  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );

  //requestAnimationFrame(() => updateImage(frameIndex + 1))
  introHeader.style.fontSize = `${introHeaderFontSize + Math.min(frameIndex * 1.5, introHeaderMaxFontSize)}px`;
  console.log(section2InitialTop, window.pageYOffset, parseInt(window.getComputedStyle(section2).height, 10));
  if (window.pageYOffset < section2InitialTop) {

  } else if (window.pageYOffset > section2InitialTop && window.pageYOffset < section2InitialTop + parseInt(window.getComputedStyle(section2).height, 10)) {
    section2.style.top = `${window.pageYOffset}px`;
  } else if (window.pageYOffset > section2InitialTop + parseInt(window.getComputedStyle(section2).height, 10)) {
    if (!stopAt) {
      stopAt = window.pageYOffset;
      section2.style.top = `${stopAt}px`;
    }

  } else {
    section2.style.top = '';
  }

});

preloadImages()
