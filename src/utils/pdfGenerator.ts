import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFReport, AttendanceModification } from '../types';

export const generatePDF = (report: PDFReport) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Relatório de Faltas', 14, 15);
  
  doc.setFontSize(12);
  doc.text(`Turma: ${report.className} - ${report.grade}`, 14, 25);
  doc.text(`Gerado por: ${report.generatedBy}`, 14, 32);
  doc.text(`Data: ${new Date(report.generatedAt).toLocaleDateString('pt-BR')}`, 14, 39);

  // Format data for table
  const tableData = report.students.map(student => {
    const modifications = student.modifications
      .map(mod => formatModification(mod))
      .join('\n');

    return [
      student.number,
      student.name,
      student.totalAbsences,
      student.absenceDates.map(date => 
        new Date(date).toLocaleDateString('pt-BR')
      ).join('\n'),
      modifications
    ];
  });

  // Add table
  autoTable(doc, {
    head: [['Nº', 'Nome', 'Total Faltas', 'Datas', 'Observações']],
    body: tableData,
    startY: 45,
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 40 },
      4: { cellWidth: 70 }
    },
  });

  // Save the PDF
  doc.save(`relatorio-${report.className.toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
};

const formatModification = (mod: AttendanceModification): string => {
  const date = new Date(mod.timestamp).toLocaleString('pt-BR');
  return `${date} - ${mod.type === 'ARRIVAL' ? 'Chegada' : 'Obs'}: ${mod.details} (${mod.userName})`;
};