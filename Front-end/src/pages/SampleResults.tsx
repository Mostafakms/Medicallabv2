import React, { useEffect, useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// ErrorBoundary to catch runtime errors
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="text-red-600 p-4">An error occurred: {this.state.error?.toString()}</div>;
    }
    return this.props.children;
  }
}

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return {
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().split(' ')[0],
  };
};

const SampleResults = () => {
  const { accessionNumber } = useParams();
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({});

  useEffect(() => {
    if (accessionNumber) {
      fetch(`http://127.0.0.1:8000/api/samples/accession/${accessionNumber}`)
        .then(res => res.json())
        .then(data => {
          const found = Array.isArray(data.data)
            ? data.data.find(s => s.accession_number === accessionNumber)
            : data.data;
          setSample(found);
          setLoading(false);
          // Fetch existing results for this sample
          if (found && found.id) {
            // Fetch all results for this sample (multiple tests)
            fetch(`http://127.0.0.1:8000/api/sample-results-by-sample?sample_id=${found.id}`)
              .then(res => res.ok ? res.json() : Promise.resolve(null))
              .then(resultData => {
                if (resultData && resultData.data && Array.isArray(resultData.data)) {
                  // Map results: { [testId]: { ...parameters } }
                  const resultsMap = {};
                  resultData.data.forEach(r => {
                    resultsMap[r.test_id] = r.results;
                  });
                  setResults(resultsMap);
                }
              });
          }
        })
        .catch(() => {
          setError('Failed to fetch sample data.');
          setLoading(false);
        });
    }
  }, [accessionNumber]);

  // Handler for result input change
  const handleResultChange = (testId, paramName, value) => {
    setResults(prev => ({
      ...prev,
      [testId]: {
        ...(prev[testId] || {}),
        [paramName]: value
      }
    }));
  };

  // Save handler: POST or PUT for each test result
  const handleSaveResults = async () => {
    if (!sample || !sample.id) return;
    const tests = Array.isArray(sample.tests) ? sample.tests : [];
    try {
      for (const test of tests) {
        const testId = test.id;
        const testResults = results[testId] || {};
        // Check if results already exist for this sample and test
        const res = await fetch(`http://127.0.0.1:8000/api/sample-results/${sample.id}?test_id=${testId}`);
        const exists = res.ok;
        const method = exists ? 'PUT' : 'POST';
        const url = exists
          ? `http://127.0.0.1:8000/api/sample-results/${sample.id}`
          : 'http://127.0.0.1:8000/api/sample-results';
        const body = exists
          ? JSON.stringify({ results: testResults, test_id: testId })
          : JSON.stringify({ sample_id: sample.id, test_id: testId, results: testResults });
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body,
        });
      }
      alert('Results saved to database.');
    } catch (err) {
      alert('Failed to save results.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!sample) return <div className="text-center text-red-500">No sample data available.</div>;

  const formattedCollection = sample.collection_date
    ? formatDateTime(sample.collection_date)
    : { date: "N/A", time: "N/A" };
  const tests = Array.isArray(sample.tests) ? sample.tests : [];

  // Add logging to debug white page issue
  if (process.env.NODE_ENV !== 'production') {
    console.log('Sample:', sample);
    console.log('Tests:', tests);
    console.log('Results:', results);
  }

  // Defensive checks for tests rendering
  const safeTests = Array.isArray(tests) ? tests : [];

  // Add logging to debug render cycles
  console.log('Rendering SampleResults component');

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Results for Sample #{sample.accession_number || "N/A"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Patient Name:</strong> {sample.patient?.name || "N/A"}</p>
              <p><strong>Sample Type(s):</strong> {sample.sample_type || "N/A"}</p>
              <p><strong>Collection Date:</strong> {formattedCollection.date}</p>
              <p><strong>Collection Time:</strong> {formattedCollection.time}</p>
            </div>
          </CardContent>
        </Card>

        {safeTests.map((test, index) => (
          <Card key={index} className="space-y-4">
            <CardHeader>
              <CardTitle>Sample Type: {test.sample_types.join(', ') || "Unknown"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border p-4 rounded-md">
                <p><strong>Test Name:</strong> {test.name || test.code || test.id || "N/A"}</p>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-left w-1/4 min-w-[120px]">Parameter</th>
                        <th className="border px-2 py-1 text-left w-1/4 min-w-[120px]">Value</th>
                        <th className="border px-2 py-1 text-left w-1/4 min-w-[100px]">Unit</th>
                        <th className="border px-2 py-1 text-left w-1/4 min-w-[120px]">Normal Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(test.parameters) && test.parameters.length > 0 ? (
                        test.parameters.map((param, paramIndex) => {
                          const paramName = typeof param === 'object' && param.name ? param.name : param;
                          const paramUnits = typeof param === 'object' && param.units ? param.units : '';
                          const paramRange = typeof param === 'object' && param.normal_range ? param.normal_range : '';
                          return (
                            <tr key={paramIndex}>
                              <td className="border px-2 py-1 font-medium">{paramName}</td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 border rounded"
                                  value={results[test.id]?.[paramName] || ''}
                                  onChange={e => handleResultChange(test.id, paramName, e.target.value)}
                                  placeholder="Enter value"
                                />
                              </td>
                              <td className="border px-2 py-1">{paramUnits || '—'}</td>
                              <td className="border px-2 py-1">{paramRange || '—'}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td colSpan={4} className="text-gray-500 text-center">No parameters available for this test.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSaveResults}
        >
          Save Results
        </button>
      </div>
    </ErrorBoundary>
  );
};

export default SampleResults;
