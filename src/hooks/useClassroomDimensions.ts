import { useState, useEffect } from 'react';

interface Dimensions {
  deskWidth: number;
  deskHeight: number;
  deskSpacingX: number;
  deskSpacingY: number;
  desksPerRow: number;
}

export const useClassroomDimensions = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    deskWidth: 180,
    deskHeight: 90,
    deskSpacingX: 40,
    deskSpacingY: 40,
    desksPerRow: 4,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        let desksPerRow = 4;
        let deskWidth = 180;
        let deskSpacingX = 40;

        // Adjust dimensions based on container width
        if (containerWidth < 640) { // sm breakpoint
          desksPerRow = 2;
          deskWidth = 160;
          deskSpacingX = 20;
        } else if (containerWidth < 768) { // md breakpoint
          desksPerRow = 3;
          deskWidth = 170;
          deskSpacingX = 30;
        } else if (containerWidth < 1024) { // lg breakpoint
          desksPerRow = 3;
          deskWidth = 180;
          deskSpacingX = 40;
        }

        setDimensions({
          deskWidth,
          deskHeight: deskWidth * 0.5,
          deskSpacingX,
          deskSpacingY: deskSpacingX,
          desksPerRow,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [containerRef]);

  return dimensions;
};