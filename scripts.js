(() => {
  const html = document.documentElement;
  const frameCount = 148;
  const section2 = document.getElementById("section2");
  const section1Header = document.getElementById("section1Header");
  const section2Header = document.getElementById("section2Header");
  const section2InitialTop = section2.getBoundingClientRect().top;
  let section2HeaderOpacity = 0;
  let section2HeaderTransform = 0;
  let stopAt = 0;
  const section1HeaderMaxFontSize = 100;
  const section1HeaderFontSize = parseInt(window.getComputedStyle(section1Header).fontSize, 10);

  document.addEventListener('scroll', () => handleScrollEvent());

  const handleScrollEvent = () => {
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;

    const frameIndex = Math.min(
      frameCount - 1,
      Math.ceil(scrollFraction * frameCount)
    );

    section1Header.style.fontSize = `${section1HeaderFontSize + Math.min(frameIndex * 1.5, section1HeaderMaxFontSize)}px`;
    if (window.pageYOffset < section2InitialTop) {
      section2HeaderOpacity = 0;
      section2.style.position = '';
      section2.style.top = '';
    } else if (window.pageYOffset > section2InitialTop && window.pageYOffset < section2InitialTop + parseInt(window.getComputedStyle(section2).height, 10)) {
      section2.style.position = 'fixed';
      section2.style.top = '0';
      section2HeaderOpacity = ((window.pageYOffset - section2InitialTop) / parseInt(window.getComputedStyle(section2).height, 10));
      section2HeaderTransform = section2HeaderOpacity * 100;
    } else if (window.pageYOffset > section2InitialTop + parseInt(window.getComputedStyle(section2).height, 10)) {
      if (!stopAt) {
        stopAt = window.pageYOffset;
        section2.style.top = `${stopAt}px`;
        section2.style.position = '';
      }
      section2HeaderOpacity = 1;
    } else {
      section2.style.top = '';
      section2.style.position = '';
    }

    section2Header.style.opacity = section2HeaderOpacity;
    section2Header.style.transform = `translateY(calc(50vh - ${section2HeaderTransform}px))`;

  }
})();
