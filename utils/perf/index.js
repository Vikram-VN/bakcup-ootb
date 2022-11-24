/* eslint-disable no-undef */
// Stores the current layout shift score for the page.
let clsScore = 0;
let perfObserver = null;

export const measureTime = mark => {
  const landmark = `CFW-${mark}`;
  const startTime = `${landmark}-START`;
  const endTime = `${landmark}-END`;

  return {
    start() {
      if (__ENABLE_USER_TIMING_API__ && typeof performance !== 'undefined' && performance.mark) {
        performance.mark(startTime);
      }
    },

    stop(label) {
      if (__ENABLE_USER_TIMING_API__ && typeof performance !== 'undefined' && performance.mark && performance.measure) {
        performance.mark(endTime);
        try {
          performance.measure(label ? label : landmark, startTime, endTime);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
};

/**
 * Logs Layout shift entries which are greater than given value
 */
export const onLayoutShiftEntry = entry => {
  // Only count layout shifts without recent user input.
  if (entry && !entry.hadRecentInput) {
    const shiftValue = entry.value;
    clsScore += shiftValue;
    // log major layout shifts
    if (shiftValue > 0.04) {
      console.log('%cLayoutShift', 'color: red; background: #80ff00; font-size: 14px;', entry);
    }
  }
};

/**
 * prints CLS value
 */
export const flushAndLogCLS = () => {
  if (perfObserver) {
    try {
      // Force any pending records to be dispatched.
      perfObserver.takeRecords().forEach(entry => onLayoutShiftEntry(entry));
      console.log(`%cTotal CLS for Previous Page ${clsScore}`, 'color: white; background: red; font-size: 16px;');
      clsScore = 0;
    } catch (e) {
      console.log(`Error while logging CLS ${e}`);
    }
  }
};

/**
 * Initiates Layout shift observer
 */
export const observeLayoutShift = () => {
  if ('PerformanceObserver' in window) {
    try {
      perfObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          onLayoutShiftEntry(entry);
        }
      });
      perfObserver.observe({type: 'layout-shift', buffered: true});
    } catch (e) {
      console.log(`Error while observing CLS${e}`);
    }
  }
};
