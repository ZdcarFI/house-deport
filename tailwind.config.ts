import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(accordion|autocomplete|avatar|button|card|checkbox|chip|dropdown|image|input|link|modal|navbar|select|toggle|table|popover|user|divider|ripple|spinner|listbox|scroll-shadow|menu|spacer).js"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
