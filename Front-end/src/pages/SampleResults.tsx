import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
          // If API returns a list, find the correct sample
          const found = Array.isArray(data.data)
            ? data.data.find(s => s.accession_number === accessionNumber)
            : data.data;
          setSample(found);
          setLoading(false);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!sample) return <div className="text-center text-red-500">No sample data available.</div>;

  const formattedCollection = sample.collection_date
    ? formatDateTime(sample.collection_date)
    : { date: "N/A", time: "N/A" };
  const tests = Array.isArray(sample.tests) ? sample.tests : [];

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Results for Sample #{sample.accession_number || "N/A"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Patient Name:</strong> {sample.patient?.name || "N/A"}</p>
            <p><strong>Sample Type:</strong> {sample.sample_type || "N/A"}</p>
            <p><strong>Collection Date:</strong> {formattedCollection.date}</p>
            <p><strong>Collection Time:</strong> {formattedCollection.time}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.length > 0 ? (
              tests.map((test, index) => (
                <div key={index} className="border p-4 rounded-md">
                  <p><strong>Test Name:</strong> {test.name || test.code || test.id || "N/A"}</p>
                  <p><strong>Parameters:</strong></p>
                  {Array.isArray(test.parameters) && test.parameters.length > 0 ? (
                    test.parameters.map((param, paramIndex) => {
                      return (
                        <div key={paramIndex} className="ml-4 border p-4 rounded-md my-2 bg-gray-50">
                          <p className="text-lg font-medium mb-2">{param.name}</p>
                          <label className="block">
                            <span className="text-gray-700">Result:</span>
                            <input
                              type="text"
                              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                              placeholder="Enter result"
                              value={results[test.id]?.[param.name] || ''}
                              onChange={e => handleResultChange(test.id, param.name, e.target.value)}
                            />
                          </label>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div>
                              <span className="text-gray-700 text-sm">Units:</span>
                              <div className="mt-1 font-medium">{param.units || "Not applicable"}</div>
                            </div>
                            <div>
                              <span className="text-gray-700 text-sm">Normal Range:</span>
                              <div className="mt-1 font-medium">{param.normal_range || "Not established"}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">No parameters available for this test.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tests available for this sample.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={() => {
          // For now, just log the results. Replace with API call as needed.
          console.log('Results to save:', results);
          alert('Results saved (see console for data).');
        }}
      >
        Save Results
      </button>
    </div>
  );
};

export default SampleResults;
