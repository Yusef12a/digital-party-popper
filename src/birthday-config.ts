// ============================================================
//  HIER ALLES ANPASSEN
//  Name und Geburtsdatum des Geburtstagskindes eintragen.
//  Alles andere auf der Seite berechnet sich automatisch:
//  Datums-Badge, Alter (Zahlen-Luftballons) und der Countdown.
// ============================================================

export const birthdayConfig = {
  // Name des Geburtstagskindes
  name: "Soso",

  // Geburtsdatum im Format "Jahr-Monat-Tag"
  // Beispiel: "2009-10-31" für den 31. Oktober 2009
  birthDate: "2009-10-31",
};

// --- Ab hier muss nichts mehr geändert werden ---

export type BirthdayInfo = {
  isToday: boolean;
  nextBirthday: Date;
  turningAge: number;
  dateLabel: string;
};

export function getBirthdayInfo(now: Date = new Date()): BirthdayInfo {
  const [birthYearText, monthText, dayText] = birthdayConfig.birthDate.split("-");
  const birthYear = Number(birthYearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const today = startOfDay(now);
  const isToday =
    now.getMonth() === month - 1 && now.getDate() === day;

  let nextBirthday = new Date(today.getFullYear(), month - 1, day);
  if (!isToday && nextBirthday.getTime() < today.getTime()) {
    nextBirthday = new Date(today.getFullYear() + 1, month - 1, day);
  }

  const turningAge = nextBirthday.getFullYear() - birthYear;
  const monthName = nextBirthday.toLocaleDateString("en-US", {
    month: "long",
  });

  return {
    isToday,
    nextBirthday,
    turningAge,
    dateLabel: `${monthName} ${day}`,
  };
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getCountdown(target: Date, now: Date): Countdown {
  const totalSeconds = Math.max(
    0,
    Math.floor((target.getTime() - now.getTime()) / 1000),
  );
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
