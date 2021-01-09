const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const section1Header = document.getElementById("section1Header");
const section2Header = document.getElementById("section2Header");
let section2HeaderOpacity = 0;
let section2HeaderTransform = 0;
const section1 = document.getElementById("section1");
const section2 = document.getElementById("section2");
const section2InitialTop = section2.getBoundingClientRect().top;
const context = canvas.getContext("2d");
let stopAt = 0;
let last_known_scroll_position = 0;
let ticking = false;


const frameCount = 148;
const section1HeaderMaxFontSize = 100;
const section1HeaderFontSize = parseInt(window.getComputedStyle(section1Header).fontSize, 10);
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

document.addEventListener('scroll', function () {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    handleScrollEvent();

    ticking = true;
  }
});

const handleScrollEvent = () => {
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;

  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );

  requestAnimationFrame(() => { updateImage(frameIndex + 1); ticking = false;})
  section1Header.style.fontSize = `${section1HeaderFontSize + Math.min(frameIndex * 1.5, section1HeaderMaxFontSize)}px`;
  if (window.pageYOffset < section2InitialTop) {
    section2HeaderOpacity = 0;
  } else if (window.pageYOffset > section2InitialTop && window.pageYOffset < section2InitialTop + parseInt(window.getComputedStyle(section2).height, 10)) {
    section2.style.top = `${window.pageYOffset}px`;
    section2HeaderOpacity = ((window.pageYOffset - section2InitialTop) / parseInt(window.getComputedStyle(section2).height, 10));

    section2HeaderTransform = section2HeaderOpacity * 100;
  } else if (window.pageYOffset > section2InitialTop + parseInt(window.getComputedStyle(section2).height, 10)) {
    if (!stopAt) {
      stopAt = window.pageYOffset;
      section2.style.top = `${stopAt}px`;
    }
    section2HeaderOpacity = 1;

  } else {
    section2.style.top = '';
  }

  section2Header.style.opacity = section2HeaderOpacity;
  section2Header.style.transform = `translateY(calc(50vh - ${section2HeaderTransform}px))`;

}

preloadImages()
