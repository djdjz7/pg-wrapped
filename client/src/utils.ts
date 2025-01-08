export function dateToString(date: Date | string): string {
  const d = new Date(date)
  return `${d.getFullYear()} 年
    ${(d.getMonth() + 1).toString().padStart(2, '0')} 月
      ${d.getDate().toString().padStart(2, '0')} 日
      ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}
