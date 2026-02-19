import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classesAPI } from '../services/api';
import { Plus, BookOpen, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data);
    } catch (err) {
      setError('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (isFinalized) => {
    if (isFinalized) {
      return <CheckCircle className="h-5 w-5 text-success-600" />;
    }
    return <Clock className="h-5 w-5 text-warning-600" />;
  };

  const getStatusText = (isFinalized) => {
    return isFinalized ? 'Finalized' : 'In Progress';
  };

  const getStatusColor = (isFinalized) => {
    return isFinalized ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your classes and student marks
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div key={classItem.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {classItem.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {classItem.level_name} - Year {classItem.year}, Term {classItem.term}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(classItem.is_finalized)}`}>
                    {getStatusIcon(classItem.is_finalized)}
                    <span>{getStatusText(classItem.is_finalized)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      Students
                    </div>
                    <span className="font-medium text-gray-900">{classItem.student_count}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Subjects
                    </div>
                    <span className="font-medium text-gray-900">{classItem.subject_count}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Progress
                    </div>
                    <span className="font-medium text-gray-900">
                      {classItem.completion_percentage?.toFixed(1) || 0}%
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Link
                    to={`/classes/${classItem.id}/spreadsheet`}
                    className="w-full btn btn-primary flex justify-center items-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Open Spreadsheet
                  </Link>
                  
                  {classItem.is_finalized && (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/classes/${classItem.id}/analytics`}
                        className="btn btn-secondary text-sm flex justify-center items-center"
                      >
                        Analytics
                      </Link>
                      <Link
                        to={`/classes/${classItem.id}/broadsheet`}
                        className="btn btn-secondary text-sm flex justify-center items-center"
                      >
                        Broadsheet
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {classes.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                <p className="text-gray-500">Get started by creating your first class</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
