// Extend JSX to support legacy HTML elements for authentic 2003 experience
declare namespace JSX {
  interface IntrinsicElements {
    marquee: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        scrollamount?: number;
        direction?: 'left' | 'right' | 'up' | 'down';
        behavior?: 'scroll' | 'slide' | 'alternate';
      },
      HTMLElement
    >;
  }
}
