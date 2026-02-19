import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classesAPI } from '../services/api';
import { ArrowLeft, TrendingUp, Users, Award, BarChart3 } from 'lucide-react';

const Analytics = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [classId]);

  const fetchAnalytics = async () => {
    try {
      const response = await classesAPI.getAnalytics(classId);
      setAnalytics(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-success-100 text-success-800',
      'B': 'bg-primary-100 text-primary-800',
      'C': 'bg-warning-100 text-warning-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-danger-100 text-danger-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-success-600' };
    if (score >= 70) return { level: 'Good', color: 'text-primary-600' };
    if (score >= 60) return { level: 'Average', color: 'text-warning-600' };
    if (score >= 50) return { level: 'Below Average', color: 'text-orange-600' };
    return { level: 'Poor', color: 'text-danger-600' };
  };

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
            <BarChart3 className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Analytics Unavailable</h2>
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

  const classPerformance = getPerformanceLevel(analytics.statistics.classAverage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Class Analytics</h1>
                <p className="text-sm text-gray-600">
                  Performance analysis and statistics
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.statistics.totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-success-100 rounded-lg p-3">
                  <TrendingUp className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Class Average</p>
                  <p className={`text-2xl font-bold ${classPerformance.color}`}>
                    {analytics.statistics.classAverage}%
                  </p>
                  <p className="text-xs text-gray-500">{classPerformance.level}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-warning-100 rounded-lg p-3">
                  <Award className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Highest Score</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.statistics.highest}%</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Lowest Score</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.statistics.lowest}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Grade Distribution */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
              <div className="space-y-3">
                {Object.entries(analytics.statistics.gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(grade)}`}>
                        Grade {grade}
                      </span>
                      <span className="text-sm text-gray-600">{count} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            grade === 'A' ? 'bg-success-500' :
                            grade === 'B' ? 'bg-primary-500' :
                            grade === 'C' ? 'bg-warning-500' :
                            grade === 'D' ? 'bg-orange-500' : 'bg-danger-500'
                          }`}
                          style={{ width: `${(count / analytics.statistics.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {((count / analytics.statistics.totalStudents) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h2>
              <div className="space-y-3">
                {analytics.students.slice(0, 10).map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.full_name}</p>
                        <p className="text-xs text-gray-500">{student.admission_number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{student.average_mark}%</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.grade)}`}>
                        Grade {student.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="card p-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(
                analytics.subjectResults.reduce((acc, result) => {
                  const subjectName = result.subject_name;
                  if (!acc[subjectName]) {
                    acc[subjectName] = [];
                  }
                  acc[subjectName].push(result.score);
                  return acc;
                }, {})
              ).map(([subjectName, scores]) => {
                const average = scores.reduce((a, b) => a + b, 0) / scores.length;
                const highest = Math.max(...scores);
                const lowest = Math.min(...scores);
                
                return (
                  <div key={subjectName} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{subjectName}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average:</span>
                        <span className="font-medium">{average.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Highest:</span>
                        <span className="font-medium text-success-600">{highest}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lowest:</span>
                        <span className="font-medium text-danger-600">{lowest}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
