import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AttendanceStats } from '../types';

export const exportStatsToPDF = (
  stats: AttendanceStats,
  className: string,
  period: string
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text(`Relatório de Frequência - ${className}`, 14, 15);
  doc.setFontSize(12);
  doc.text(`Período: ${period}`, 14, 25);

  // Summary
  doc.setFontSize(14);
  doc.text('Resumo', 14, 35);
  
  const summaryData = [
    ['Frequência Média', `${stats.averageAttendance.toFixed(1)}%`],
    ['Total de Faltas', stats.totalAbsences.toString()],
    ['Melhor Frequência', stats.students.length > 0 ? stats.students[0].name : 'N/A'],
  ];

  autoTable(doc, {
    startY: 40,
    head: [['Indicador', 'Valor']],
    body: summaryData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });

  // Students Table
  doc.text('Detalhamento por Aluno', 14, doc.lastAutoTable.finalY + 20);

  const studentData = stats.students
    .sort((a, b) => a.absences - b.absences)
    .map(student => [
      student.name || 'N/A',
      student.absences.toString()
    ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [['Aluno', 'Faltas']],
    body: studentData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });

  // Save the PDF
  doc.save(`relatorio-${className}-${period}.pdf`);
};