export default {
  content: ["./src/**/*.{astro,ts}"],
  // hover: utilities only apply on devices that can hover, so touch screens never get "stuck" hover states
  future: { hoverOnlyWhenSupported: true },
  theme: { extend: {
    colors: {
      cream: "#FFF8EE", sand: "#F8ECDD", ink: "#2B1D16", mute: "#6B5A4E", line: "#EAD9C5", card: "#FFFFFF",
      brand: "#A6360A",        // buttons and accent text: 5.2:1 or better on every pastel, 6.7:1 with white text
      coral: "#F26B3A",        // decoration only (never small text)
      peach: "#FFE4D2", butter: "#FFF0B8", mint: "#D8F1E4", sky: "#DCEBFA", lilac: "#EADFFB", rose: "#FFDDE5",
      wa: "#14803F",           // WhatsApp green with accessible white text (5.0:1)
    },
    fontFamily: {
      display: ["Fraunces", "Georgia", "Times New Roman", "serif"],
      sans: ["Figtree", "system-ui", "Helvetica Neue", "Arial", "sans-serif"],
    },
    borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
    transitionTimingFunction: {
      out: "cubic-bezier(0.23, 1, 0.32, 1)",
      "in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
      drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
    },
  } },
};
