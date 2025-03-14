import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import autoTable from 'jspdf-autotable'
import { jsPDF } from 'jspdf'

export interface ExportableData {
  id: number
  [key: string]: any
}

export class ExportUtils {
  private static processValue(value: any): string {
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return value?.toString() || ''
  }

  static exportToCSV<T extends ExportableData>(
    data: T[],
    filename: string,
    columns: { key: string; label: string }[]
  ): void {
    const csvData = data.map((item) => {
      const row: Record<string, any> = {}
      columns.forEach(({ key, label }) => {
        row[label] = this.processValue(item[key])
      })
      return row
    })

    const worksheet = XLSX.utils.json_to_sheet(csvData)
    const csvContent = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, `${filename}.csv`)
  }

  static exportToExcel<T extends ExportableData>(
    data: T[],
    filename: string,
    columns: { key: string; label: string }[]
  ): void {
    const excelData = data.map((item) => {
      const row: Record<string, any> = {}
      columns.forEach(({ key, label }) => {
        row[label] = this.processValue(item[key])
      })
      return row
    })

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, filename)
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    saveAs(blob, `${filename}.xlsx`)
  }

  static exportToPDF<T extends ExportableData>(
    data: T[],
    filename: string,
    columns: { key: string; label: string }[]
  ): void {
    const doc = new jsPDF()

    doc.text(filename, 14, 16)

    const tableColumn = columns.map((col) => col.label)
    const tableRows = data.map((item) =>
      columns.map(({ key }) => this.processValue(item[key]))
    )

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })

    doc.save(`${filename}.pdf`)
  }
}
