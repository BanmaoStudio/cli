import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

export const useDeviceScreen = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind);

  const isMobile = breakpoints.smaller("sm").value;

  return {
    isMobile,
  };
};
