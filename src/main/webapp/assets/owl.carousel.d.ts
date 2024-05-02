// owl.carousel.d.ts
declare namespace JQueryOwlCarousel {
  interface OwlCarouselOptions {
    items?: number;
    loop?: boolean;
    margin?: number;
    nav?: boolean;
    dots?: boolean;
    autoplay?: boolean;
    autoplayTimeout?: number;
    autoplayHoverPause?: boolean;
    slideBy?: number | string;
    center?: boolean;
    responsive?: {
      [breakpoint: number]: {
        items: number;
        nav?: boolean;
        dots?: boolean;
        loop?: boolean;
      };
    };
    merge?: boolean;
    mergeFit?: boolean;
    autoWidth?: boolean;
    startPosition?: number | string;
    URLhashListener?: boolean;
    navText?: string[];
    navElement?: string;
    rewind?: boolean;
    rtl?: boolean;
    stagePadding?: number;
    lazyLoad?: boolean;
    lazyLoadEager?: number;
    autoplaySpeed?: number | boolean;
    dotsSpeed?: number | boolean;
    dragEndSpeed?: number | boolean;
    // ... add more options as needed
  }
}

interface JQuery {
  owlCarousel(options?: JQueryOwlCarousel.OwlCarouselOptions): JQuery;
}
