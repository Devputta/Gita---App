export function validateChapterNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 18;
}

export function validateVerseNumber(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}
