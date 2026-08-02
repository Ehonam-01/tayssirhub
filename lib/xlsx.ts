import ExcelJS from "exceljs";

export async function toXlsx(
  sheetName: string,
  headers: string[],
  rows: (string | number | null)[][],
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.addRow(headers).font = { bold: true };
  for (const row of rows) sheet.addRow(row);

  headers.forEach((header, i) => {
    const maxLength = Math.max(header.length, ...rows.map((row) => String(row[i] ?? "").length));
    sheet.getColumn(i + 1).width = Math.min(Math.max(maxLength + 2, 10), 40);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
