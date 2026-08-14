import { toGregorian } from "jalaali-js";

export function formatShamsiDateString(jalaliDate: string): string {
  const [datePart, timePart] = jalaliDate.split(" ");
  const [jy, jm, jd] = datePart.split("-").map(Number);

  const { gy, gm, gd } = toGregorian(jy, jm, jd);

  const miladiStr = `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")} ${timePart}`;

  return new Date(miladiStr).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric", hour: "numeric", second: "numeric", minute: "numeric", hourCycle: "h23" });
}
