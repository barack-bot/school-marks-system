import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classesAPI } from '../services/api';
import { ArrowLeft, Download, Search } from 'lucide-react';

const Broadsheet = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  const [broadsheet, setBroadsheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBroadsheet();
  }, [classId]);

  const fetchBroadsheet = async () => {
    try {
      const response = await classesAPI.getBroadsheet(classId);
      setBroadsheet(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load broadsheet');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await classesAPI.exportBroadsheet(classId);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${broadsheet.className}_broadsheet.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'text-success-600 font-semibold',
      'B': 'text-primary-600',
      'C': 'text-warning-600',
      'D': 'text-orange-600',
      'E': 'text-danger-600'
    };
    return colors[grade] || 'text-gray-600';
  };

  const filteredStudents = broadsheet?.students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-danger-600 mb-4">
            <Download className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Broadsheet Unavailable</h2>
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
                    {broadsheet.className} - Broadsheet
                  </h1>
                  <p className="text-sm text-gray-600">
                    Final examination results
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleExport}
                className="btn btn-primary flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search by name or admission number..."
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-primary-600">{filteredStudents.length}</p>
            </div>
            <div className="card p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Average</h3>
              <p className="text-3xl font-bold text-success-600">
                {(filteredStudents.reduce((sum, s) => sum + parseFloat(s.average_mark), 0) / filteredStudents.length).toFixed(1)}%
              </p>
            </div>
            <div className="card p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Subjects</h3>
              <p className="text-3xl font-bold text-primary-600">{broadsheet.subjects.length}</p>
            </div>
          </div>

          {/* Broadsheet Table */}
          <div className="card overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  {broadsheet.subjects.map((subject) => (
                    <th key={subject.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {subject.name}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                        <span className="text-sm font-medium text-primary-600">{student.class_position}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.admission_number}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.full_name}</div>
                    </td>
                    {broadsheet.subjects.map((subject) => {
                      const cellKey = `${student.admission_number}_${subject.id}`;
                      const result = broadsheet.subjectResults[cellKey];
                      return (
                        <td key={subject.id} className="px-4 py-4 whitespace-nowrap text-center">
                          {result ? (
                            <div>
                              <span className="text-sm font-medium text-gray-900">{result.score}</span>
                              <div className={`text-xs ${getGradeColor(result.grade)}`}>
                                {result.grade}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-gray-900">{student.total_marks}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-gray-900">{student.average_mark}%</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.grade === 'A' ? 'bg-success-100 text-success-800' :
                        student.grade === 'B' ? 'bg-primary-100 text-primary-800' :
                        student.grade === 'C' ? 'bg-warning-100 text-warning-800' :
                        student.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                        'bg-danger-100 text-danger-800'
                      }`}>
                        Grade {student.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="card p-12 text-center">
              <div className="text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Broadsheet;
