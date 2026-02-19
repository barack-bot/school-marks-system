import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Save, Download, CheckCircle, AlertCircle, ArrowLeft, Lock } from 'lucide-react';

const Spreadsheet = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [spreadsheetData, setSpreadsheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const spreadsheetRef = useRef(null);

  useEffect(() => {
    fetchSpreadsheetData();
  }, [classId]);

  const fetchSpreadsheetData = async () => {
    try {
      const response = await classesAPI.getSpreadsheet(classId);
      setSpreadsheetData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load spreadsheet');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (studentId, subjectId, currentValue) => {
    if (!spreadsheetData.permissions.canEdit || spreadsheetData.class.is_finalized) {
      return;
    }

    const cellKey = `${studentId}_${subjectId}`;
    const isEditable = spreadsheetData.permissions.canEditAll || 
                      spreadsheetData.permissions.editableSubjects.includes(subjectId);

    if (!isEditable) {
      return;
    }

    setSelectedCell({ studentId, subjectId });
    setEditValue(currentValue === null ? '' : currentValue.toString());
  };

  const handleCellChange = (value) => {
    setEditValue(value);
  };

  const handleCellBlur = async () => {
    if (!selectedCell) return;

    const { studentId, subjectId } = selectedCell;
    const score = editValue === '' ? null : parseFloat(editValue);

    if (isNaN(score) || (score !== null && (score < 0 || score > 100))) {
      setError('Score must be between 0 and 100');
      setSelectedCell(null);
      return;
    }

    setSaving(true);
    try {
      await classesAPI.updateCell(classId, {
        studentId,
        subjectId,
        score
      });

      // Update local data
      const cellKey = `${studentId}_${subjectId}`;
      setSpreadsheetData(prev => ({
        ...prev,
        marks: {
          ...prev.marks,
          [cellKey]: {
            score,
            enteredBy: user.id,
            updatedAt: new Date().toISOString()
          }
        }
      }));

      setSelectedCell(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update cell');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setSelectedCell(null);
      setEditValue('');
    }
  };

  const getCellValue = (studentId, subjectId) => {
    const cellKey = `${studentId}_${subjectId}`;
    const mark = spreadsheetData.marks[cellKey];
    return mark?.score;
  };

  const isCellEditable = (subjectId) => {
    if (!spreadsheetData.permissions.canEdit || spreadsheetData.class.is_finalized) {
      return false;
    }
    return spreadsheetData.permissions.canEditAll || 
           spreadsheetData.permissions.editableSubjects.includes(subjectId);
  };

  const getCellClass = (studentId, subjectId) => {
    const isEditable = isCellEditable(subjectId);
    const isSelected = selectedCell?.studentId === studentId && selectedCell?.subjectId === subjectId;
    
    let classes = 'spreadsheet-cell';
    
    if (!isEditable || spreadsheetData.class.is_finalized) {
      classes += ' bg-gray-50 cursor-not-allowed';
    } else {
      classes += ' hover:bg-primary-50 cursor-pointer';
    }
    
    if (isSelected) {
      classes += ' ring-2 ring-primary-500 border-primary-500';
    }
    
    return classes;
  };

  const handleFinalize = async () => {
    if (!window.confirm('Are you sure you want to finalize this class? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      await classesAPI.finalize(classId);
      await fetchSpreadsheetData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to finalize class');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await classesAPI.exportBroadsheet(classId);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${spreadsheetData.class.name}_broadsheet.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !spreadsheetData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-danger-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {spreadsheetData.class.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {spreadsheetData.class.level_name} - Year {spreadsheetData.class.year}, Term {spreadsheetData.class.term}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {spreadsheetData.class.is_finalized && (
                  <div className="flex items-center space-x-2 text-success-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Finalized</span>
                  </div>
                )}
                
                {spreadsheetData.class.is_finalized ? (
                  <button
                    onClick={handleExport}
                    className="btn btn-secondary flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                ) : (
                  spreadsheetData.permissions.canFinalize && (
                    <button
                      onClick={handleFinalize}
                      disabled={saving || spreadsheetData.class.completion_percentage < 100}
                      className="btn btn-success flex items-center disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Finalize Class
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {!spreadsheetData.class.is_finalized && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Completion Progress</span>
                  <span>{spreadsheetData.class.completion_percentage?.toFixed(1) || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${spreadsheetData.class.completion_percentage || 0}%` }}
                  ></div>
                </div>
                {spreadsheetData.class.completion_percentage < 100 && (
                  <p className="text-xs text-gray-500 mt-1">
                    All marks must be entered before finalizing
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="mb-4 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Spreadsheet */}
          <div className="card overflow-auto">
            <div className="min-w-max">
              <table className="w-full" ref={spreadsheetRef}>
                <thead>
                  <tr>
                    <th className="spreadsheet-header sticky left-0 bg-gray-100 z-10">
                      Admission No
                    </th>
                    <th className="spreadsheet-header sticky left-20 bg-gray-100 z-10">
                      Student Name
                    </th>
                    {spreadsheetData.subjects.map((subject) => (
                      <th key={subject.id} className="spreadsheet-header">
                        <div>
                          <div className="font-semibold">{subject.name}</div>
                          <div className="text-xs text-gray-500 font-normal">
                            {subject.teacher_name}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {spreadsheetData.students.map((student) => (
                    <tr key={student.id}>
                      <td className="spreadsheet-cell sticky left-0 bg-white z-10 font-medium">
                        {student.admission_number}
                      </td>
                      <td className="spreadsheet-cell sticky left-20 bg-white z-10">
                        {student.full_name}
                      </td>
                      {spreadsheetData.subjects.map((subject) => {
                        const value = getCellValue(student.id, subject.id);
                        const isEditing = selectedCell?.studentId === student.id && 
                                       selectedCell?.subjectId === subject.id;
                        
                        return (
                          <td
                            key={subject.id}
                            className={getCellClass(student.id, subject.id)}
                            onClick={() => handleCellClick(student.id, subject.id, value)}
                          >
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => handleCellChange(e.target.value)}
                                onBlur={handleCellBlur}
                                onKeyDown={handleKeyPress}
                                className="w-full h-full bg-transparent text-center outline-none"
                                min="0"
                                max="100"
                                step="0.5"
                                autoFocus
                              />
                            ) : (
                              <div className="flex items-center justify-center">
                                {value !== null ? value : ''}
                                {spreadsheetData.class.is_finalized && (
                                  <Lock className="h-3 w-3 text-gray-400 ml-1" />
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
