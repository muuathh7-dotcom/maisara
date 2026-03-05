// Fake purchase counter that increases gradually daily
export const calculatePackageCounter = (packageId: string): number => {
  // Base numbers for each package (starting counts)
  const baseCounts = {
    "transport-only": 2847,
    "express-vip": 4203
  };

  // Starting date (when counters began) - recent date to keep numbers reasonable
  const startDate = new Date('2024-09-01');
  const currentDate = new Date();
  
  // Calculate days passed since start date
  const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Get base count for the package
  const baseCount = baseCounts[packageId as keyof typeof baseCounts] || 2000;
  
  // Add 3-8 bookings per day (random but consistent per day)
  const dailyIncrease = 3 + (daysPassed % 6); // varies between 3-8 per day
  const currentCount = baseCount + (daysPassed * dailyIncrease);
  
  return currentCount;
};