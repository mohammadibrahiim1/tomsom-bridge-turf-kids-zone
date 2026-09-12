// ২৪ ঘন্টার "HH:MM" সময়কে ১২ ঘন্টার AM/PM ফরম্যাটে রূপান্তর করার ফাংশন
export const formatTo12Hour = (time24: string): string => {
  if (!time24) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';
  if (isNaN(hours)) return '';

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${formattedHours}:${minutes} ${period}`;
};

// দুই সময়ের ব্যবধান এবং প্লে/বাফার সময় গণনার ফাংশন
export const calculateSlotDurations = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return { playDuration: 0, bufferDuration: 0, totalDuration: 0 };

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let startInMinutes = startH * 60 + startM;
  let endInMinutes = endH * 60 + endM;

  // যদি শেষ সময় রাত ১২টা পার হয়ে যায় (Midnight crossover)
  if (endInMinutes <= startInMinutes) {
    endInMinutes += 24 * 60;
  }

  const totalDuration = endInMinutes - startInMinutes;
  const buffer = 5;
  const playDuration = totalDuration > buffer ? totalDuration - buffer : 0;

  return {
    playDuration,
    bufferDuration: buffer,
    totalDuration,
  };
};