import html2canvas from 'html2canvas';

export const useExportLayout = () => {
  const exportAsImage = async (element: HTMLElement) => {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Melhor qualidade
        useCORS: true,
        logging: false,
      });

      // Converter para base64
      const image = canvas.toDataURL('image/jpeg', 0.8);
      return image;
    } catch (error) {
      console.error('Error exporting layout:', error);
      throw error;
    }
  };

  return { exportAsImage };
};
