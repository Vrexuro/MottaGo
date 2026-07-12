import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import type { ReportKpi, ChartPoint } from '../services/reportService';

// jspdf-autotable v4+ dropped the doc.autoTable(...) prototype-patching API
// in favor of a standalone autoTable(doc, options) function — doc.autoTable
// is no longer a function and calling it throws at runtime. doc.lastAutoTable
// is still set as a side effect on the doc instance after each call, which we
// use to chain table positions (see README: "doc.lastAutoTable.finalY").
interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number };
}

export interface LaporanPdfParams {
  storeName: string;
  city: string;
  periodLabel: string;
  generatedBy: string;
  kpi: ReportKpi;
  chartData: ChartPoint[];
}

function formatTanggalCetak(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function exportLaporanPdf(params: LaporanPdfParams): void {
  const { storeName, city, periodLabel, generatedBy, kpi, chartData } = params;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' }) as JsPDFWithAutoTable;
  const marginX = 14;
  let cursorY = 18;

  // ── Header ─────────────────────────────────────────────────────────────
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Laporan Sampah — MottaGo', marginX, cursorY);

  cursorY += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Store: ${storeName} — ${city}`, marginX, cursorY);

  cursorY += 5;
  doc.text(`Periode: ${periodLabel}`, marginX, cursorY);

  cursorY += 5;
  doc.text(`Dicetak oleh: ${generatedBy} pada ${formatTanggalCetak(new Date())}`, marginX, cursorY);

  cursorY += 8;
  doc.setDrawColor(200);
  doc.line(marginX, cursorY, 210 - marginX, cursorY);
  cursorY += 8;

  // ── KPI Summary ────────────────────────────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ringkasan', marginX, cursorY);
  cursorY += 4;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [['Metrik', 'Nilai']],
    body: [
      ['Total Sampah', `${kpi.totalSampahKg} kg`],
      ['Total Pickup', `${kpi.totalPickup} pickup`],
      ['Rata-rata Harian', `${kpi.rataHarianKg} kg/hari`],
      ['Efisiensi Kapasitas', `${kpi.efisiensiPct}%`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 84] },
    styles: { fontSize: 10 },
  });

  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 10;

  // ── Breakdown per periode ──────────────────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Rincian per Periode', marginX, cursorY);
  cursorY += 4;

  if (chartData.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Belum ada data untuk periode ini.', marginX, cursorY + 4);
  } else {
    autoTable(doc, {
      startY: cursorY,
      margin: { left: marginX, right: marginX },
      head: [['Periode', 'Organik (kg)', 'Anorganik (kg)', 'Minyak Jelantah (kg)', 'Total (kg)']],
      body: chartData.map((row) => {
        const total = row.organik + row.anorganik + row.minyak;
        return [
          row.minggu,
          row.organik.toFixed(1),
          row.anorganik.toFixed(1),
          row.minyak.toFixed(1),
          total.toFixed(1),
        ];
      }),
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 84] },
      styles: { fontSize: 10 },
    });
  }

  const fileName = `laporan-sampah-${storeName.replace(/\s+/g, '-').toLowerCase()}-${periodLabel.replace(/\s+/g, '')}.pdf`;
  doc.save(fileName);
}
