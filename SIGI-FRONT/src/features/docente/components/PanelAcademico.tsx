/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box } from '@mui/material';
import AlertBanner from './AlertBanner';
import GradesTable from './GradesTable';
import MetricCards from './MetricCards';
import { Student } from '../types';

interface PanelAcademicoProps {
  students: Student[];
  onUpdateGrades: (studentId: string, updatedGrades: Partial<Student['grades']>) => void;
  onUpdateAttendance: (studentId: string, attendance: number) => void;
  onAddStudent: (newStudentData: Omit<Student, 'id'>) => void;
  onDeleteStudent: (studentId: string) => void;
  searchQuery: string;
}

export default function PanelAcademico({
  students,
  onUpdateGrades,
  onUpdateAttendance,
  onAddStudent,
  onDeleteStudent,
  searchQuery,
}: PanelAcademicoProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Warning Alarm block notifier */}
      <AlertBanner students={students} onUpdateGrades={onUpdateGrades} />

      {/* Students roster Matriz de Calificaciones Grid */}
      <GradesTable
        students={students}
        onUpdateGrades={onUpdateGrades}
        onUpdateAttendance={onUpdateAttendance}
        onAddStudent={onAddStudent}
        onDeleteStudent={onDeleteStudent}
        searchQuery={searchQuery}
      />

      {/* Statistics Widgets Summary at the bottom */}
      <MetricCards students={students} />
    </Box>
  );
}

