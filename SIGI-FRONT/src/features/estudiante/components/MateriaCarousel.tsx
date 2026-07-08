import React, { useState, useRef, useEffect } from 'react';
import { Box,  IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { TarjetaMateria } from './TarjetaMateria';

interface Props {
  materias: any[]; 
  getEstadoTexto: (condicion: string) => string;
}

export const MateriaCarousel: React.FC<Props> = ({ materias, getEstadoTexto }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 4;
  const totalPages = Math.ceil(materias.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);


  const containerRef = useRef<HTMLDivElement>(null);
  
  const [slideWidth, setSlideWidth] = useState(0);

  
  useEffect(() => {
    const updateSlideWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const gap = 16; 
        const cardWidth = (containerWidth - gap * (itemsPerPage - 1)) / itemsPerPage;
        setSlideWidth(cardWidth + gap);
      }
    };
    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    return () => window.removeEventListener('resize', updateSlideWidth);
  }, [itemsPerPage]);

  
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  const handlePrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  if (materias.length === 0) {
    return <Typography variant="body2" color="text.secondary">No hay materias en curso.</Typography>;
  }

  
  const offset = currentPage * slideWidth;

  return (
    <Box sx={{ position: 'relative', px: { xs: 1, sm: 2 } }}>
      <Box sx={{ overflow: 'hidden' }}>
        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            gap: 2, 
            transform: `translateX(-${offset}px)`,
            transition: 'transform 0.3s ease',
          }}
        >
          {materias.map((materia) => (
            <Box
              key={materia.id}
              sx={{
                flex: `0 0 calc((100% - ${itemsPerPage - 1} * 16px) / ${itemsPerPage})`,
                minWidth: 0,
              }}
            >
              <TarjetaMateria
                nombre={materia.nombre}
                nota={materia.promedio}
                asistencia={materia.porcentajeAsistencia}
                estado={getEstadoTexto(materia.condicion)}
              />
            </Box>
          ))}
        </Box>
      </Box>

      
      {totalPages > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            disabled={currentPage === 0}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.paper' },
              zIndex: 1,
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.paper' },
              zIndex: 1,
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentPage(idx)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: idx === currentPage ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};