// CSV séparateur ";" (convention Excel FR) + BOM UTF-8 pour les accents.
const BOM = String.fromCharCode(0xfeff);

export function toCsv(headers: string[], rows: (string | number | null)[][]): string {
  const escape = (value: string | number | null) => {
    const s = value === null || value === undefined ? "" : String(value);
    return /["\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers, ...rows].map((row) => row.map(escape).join(";"));
  return BOM + lines.join("\r\n");
}
