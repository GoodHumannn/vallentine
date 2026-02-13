// Utility to handle Time Checks
// We rely on standard Date objects which handle absolute time comparisons correctly
// provided the unlock dates are in ISO format with timezone offsets.

export const getISTTime = (): Date => {
  return new Date();
};

export const isLevelUnlocked = (unlockIsoString: string, isDev: boolean): boolean => {
  if (isDev) return true;
  const now = new Date();
  const unlockDate = new Date(unlockIsoString); 
  return now >= unlockDate;
};

// Target: Feb 14th 00:00:00 IST (Level 8 unlock)
// Countdown Trigger: Feb 13th 23:55:00 IST
export const getCountdownStatus = () => {
  const now = new Date();
  // NOTE: Adjust year as needed. Assuming 2026 based on data.
  const targetYear = 2026; 
  
  const countdownStart = new Date(`${targetYear}-02-13T23:55:00+05:30`);
  const valentineStart = new Date(`${targetYear}-02-14T00:00:00+05:30`);

  if (now >= countdownStart && now < valentineStart) {
    return { show: true, target: valentineStart };
  }
  return { show: false, target: valentineStart };
};