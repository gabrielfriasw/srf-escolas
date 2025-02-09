import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { useStats } from '../../hooks/useStats';
import { Loader2, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface StatsModalProps {
  classId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  classId,
  isOpen,
  onClose,
}) => {
  const { stats, loading, error } = useStats(classId);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      const scale = 2; // Aumenta a qualidade da imagem
      const canvas = await html2canvas(contentRef.current, {
        scale: scale,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width / scale;
      const imgHeight = canvas.height / scale;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 20; // Margem superior de 20mm

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('estatisticas-turma.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  // Calcular dados para o gráfico de pizza
  const calculatePieData = () => {
    if (!stats.students.length || !stats.totalClasses) return null;

    const totalPossibleAttendances = stats.totalClasses * stats.students.length;
    const totalAbsences = stats.students.reduce((sum, student) => sum + student.absences, 0);
    const totalPresences = totalPossibleAttendances - totalAbsences;

    return {
      labels: ['Presenças', 'Faltas'],
      datasets: [
        {
          data: [totalPresences, totalAbsences],
          backgroundColor: ['#4ade80', '#f87171'],
          borderColor: ['#22c55e', '#ef4444'],
          borderWidth: 1,
        },
      ],
    };
  };

  // Calcular dados para o ranking de presenças
  const calculateRankingData = () => {
    if (!stats.students.length || !stats.totalClasses) return null;

    const studentsWithPresences = stats.students
      .map(student => ({
        name: student.name,
        presences: stats.totalClasses - student.absences,
        presencePercentage: ((stats.totalClasses - student.absences) / stats.totalClasses) * 100,
      }))
      .sort((a, b) => b.presencePercentage - a.presencePercentage)
      .slice(0, 10);

    return {
      labels: studentsWithPresences.map(s => s.name),
      datasets: [
        {
          label: 'Porcentagem de Presenças',
          data: studentsWithPresences.map(s => s.presencePercentage),
          backgroundColor: '#60a5fa',
          borderColor: '#3b82f6',
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Carregando Estatísticas</DialogTitle>
            <DialogDescription>
              Por favor, aguarde enquanto carregamos os dados da turma...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Erro ao Carregar</DialogTitle>
            <DialogDescription>
              Não foi possível carregar as estatísticas: {error}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const pieData = calculatePieData();
  const rankingData = calculateRankingData();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Estatísticas da Turma</DialogTitle>
          <DialogDescription>
            Visualize o resumo de presenças e faltas dos alunos.
          </DialogDescription>
        </DialogHeader>

        <div ref={contentRef} className="space-y-6 p-4 bg-white">
          <div className="flex justify-end">
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de Pizza - Presenças vs Faltas */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Distribuição de Presenças e Faltas</h3>
              {pieData && (
                <div className="w-full aspect-square">
                  <Pie 
                    data={pieData} 
                    options={{ 
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }} 
                  />
                </div>
              )}
            </div>

            {/* Gráfico de Barras - Top 10 Presenças */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Top 10 - Porcentagem de Presenças</h3>
              {rankingData && (
                <Bar
                  data={rankingData}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                          color: '#e5e7eb',
                        },
                        ticks: {
                          callback: (value) => `${value}%`,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Resumo Geral */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Resumo Geral</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500">Total de Aulas</p>
                <p className="text-2xl font-semibold">{stats.totalClasses}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500">Total de Alunos</p>
                <p className="text-2xl font-semibold">{stats.students.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500">Média de Faltas</p>
                <p className="text-2xl font-semibold">
                  {stats.students.length > 0
                    ? (
                        stats.students.reduce((acc, student) => acc + student.absences, 0) /
                        stats.students.length
                      ).toFixed(1)
                    : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};