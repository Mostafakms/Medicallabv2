import React, { useEffect, useState, useRef, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// ErrorBoundary to catch runtime errors
class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
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

// Prefix all selectors in reportStyles with .report-wrapper to scope styles
const reportStyles = `
@media print {
  @page {
    size: A4 portrait;
    margin: 15mm 10mm 18mm 10mm;
  }
  html, body {
    width: 210mm;
    min-height: 297mm;
    background: #fff !important;
    color: #000 !important;
    font-size: 10pt;
    margin: 0 !important;
    padding: 0 !important;
  }
  .report-wrapper {
    background: #fff !important;
    color: #000 !important;
    width: 100%;
    min-height: 100vh;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    page-break-after: avoid !important;
  }
  .report-wrapper .report-header, .report-wrapper .report-footer {
    position: fixed;
    left: 0;
    right: 0;
    color: #222;
    background: #fff;
    z-index: 100;
    width: 100vw;
    max-width: 210mm;
    margin: 0 auto;
  }
  .report-wrapper .report-header {
    top: 0;
    border-bottom: 1px solid #ccc;
    padding: 8px 0 6px 0;
    height: 60px;
    font-size: 11pt;
  }
  .report-wrapper .report-footer {
    bottom: 0;
    border-top: 1px solid #ccc;
    padding: 4px 0 4px 0;
    font-size: 9pt;
    height: 30px;
  }
  .report-wrapper .report-content {
    margin-top: 70px !important;
    margin-bottom: 36px !important;
    background: #fff !important;
    color: #000 !important;
    width: 100%;
    max-width: 190mm;
    margin-left: auto;
    margin-right: auto;
    page-break-inside: avoid !important;
    font-size: 10pt;
  }
  .report-wrapper .no-print {
    display: none !important;
  }
  .report-wrapper .page-number:after {
    content: counter(page);
  }
  .report-wrapper .card, .report-wrapper .border, .report-wrapper .rounded-md, .report-wrapper .shadow-lg {
    box-shadow: none !important;
    border-radius: 0 !important;
    border: 1px solid #ccc !important;
    background: #fff !important;
  }
  .report-wrapper table {
    width: 100% !important;
    border-collapse: collapse !important;
    background: #fff !important;
    font-size: 9pt;
  }
  .report-wrapper th, .report-wrapper td {
    background: #fff !important;
    color: #000 !important;
    border: 1px solid #bbb !important;
    padding: 3px 5px !important;
    font-size: 9pt;
  }
  .report-wrapper .page-break {
    page-break-before: always !important;
    break-before: always !important;
    display: block !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
  }
  .report-wrapper .test-card-print {
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    display: block;
  }
  .report-wrapper .force-page-break {
    page-break-before: always !important;
    break-before: page !important;
    display: block !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
  }
}
.report-wrapper {
  background: #fff;
  color: #000;
  width: 100%;
  max-width: 900px;
  min-height: 100vh;
  margin: 0 auto;
  border: none;
  padding: 0;
  font-size: 10pt;
}
.report-wrapper .report-header, .report-wrapper .report-footer {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
.report-wrapper .report-content {
  margin-top: 70px;
  margin-bottom: 36px;
  background: #fff;
  color: #000;
  width: 100%;
  max-width: 850px;
  margin-left: auto;
  margin-right: auto;
  font-size: 10pt;
}
.report-wrapper .card, .report-wrapper .border, .report-wrapper .rounded-md, .report-wrapper .shadow-lg {
  box-shadow: none;
  border-radius: 0;
  border: 1px solid #ccc;
  background: #fff;
}
.report-wrapper table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 9pt;
}
.report-wrapper th, .report-wrapper td {
  background: #fff;
  color: #000;
  border: 1px solid #bbb;
  padding: 3px 5px;
  font-size: 9pt;
}
.report-wrapper .page-break {
  margin-top: 32px;
}
.report-wrapper .avoid-break {
  /* no-op for screen, only for print */
}
@media screen and (max-width: 950px) {
  .report-wrapper, .report-wrapper .report-header, .report-wrapper .report-footer, .report-wrapper .report-content {
    max-width: 100vw;
    width: 100vw;
    padding-left: 4px;
    padding-right: 4px;
  }
}
`;

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return {
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().split(' ')[0],
  };
};

const SampleReport = () => {
  const { accessionNumber } = useParams();
  const [sample, setSample] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>({});
  const [labInfo, setLabInfo] = useState<any>(null);
  const [labInfoLoading, setLabInfoLoading] = useState(true);
  const [labInfoError, setLabInfoError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Use the same BASE_API_URL as in Settings for consistency
  const BASE_API_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    if (accessionNumber) {
      fetch(`http://127.0.0.1:8000/api/samples/accession/${accessionNumber}`)
        .then(res => res.json())
        .then(data => {
          const found = Array.isArray(data.data)
            ? data.data.find((s: any) => s.accession_number === accessionNumber)
            : data.data;
          setSample(found);
          setLoading(false);
          // Fetch existing results for this sample (multiple tests)
          if (found && found.id) {
            fetch(`http://127.0.0.1:8000/api/sample-results-by-sample?sample_id=${found.id}`)
              .then(res => res.ok ? res.json() : Promise.resolve(null))
              .then(resultData => {
                if (resultData && resultData.data && Array.isArray(resultData.data)) {
                  const resultsMap: any = {};
                  resultData.data.forEach((r: any) => {
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

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/lab-settings`)
      .then(res => res.json())
      .then(data => {
        setLabInfo(data);
        setLabInfoLoading(false);
      })
      .catch(() => {
        setLabInfoError('Failed to load lab info');
        setLabInfoLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!sample) return <div className="text-center text-red-500">No sample data available.</div>;
  if (labInfoLoading) return <div>Loading lab info...</div>;
  if (labInfoError) return <div className="text-red-500">{labInfoError}</div>;
  if (!labInfo) return <div className="text-red-500">Lab info not available.</div>;

  // Move this block AFTER the above null/undefined checks
  const formattedCollection = sample && sample.collection_date
    ? formatDateTime(sample.collection_date)
    : { date: "N/A", time: "N/A" };
  const tests = Array.isArray(sample?.tests) ? sample.tests : [];
  const safeTests = Array.isArray(tests) ? tests : [];

  // PDF styles for @react-pdf/renderer
  const pdfStyles = StyleSheet.create({
    page: {
      padding: 24,
      fontSize: 10,
      fontFamily: 'Helvetica',
      color: '#222',
    },
    header: {
      borderBottom: '1px solid #ccc',
      marginBottom: 12,
      paddingBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    labInfo: {
      flexDirection: 'column',
      gap: 2,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    section: {
      marginBottom: 10,
    },
    table: {
      width: "auto",
      marginBottom: 8,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCellHeader: {
      fontWeight: "bold",
      border: "1px solid #bbb",
      padding: 3,
      flex: 1,
      backgroundColor: "#f3f4f6",
    },
    tableCell: {
      border: "1px solid #bbb",
      padding: 3,
      flex: 1,
    },
    signature: {
      marginTop: 24,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    signatureBox: {
      width: 120,
      borderBottom: "1px solid #888",
      height: 18,
      marginTop: 8,
    },
    footer: {
      position: "absolute",
      bottom: 18,
      left: 24,
      right: 24,
      fontSize: 9,
      color: "#888",
      borderTop: "1px solid #ccc",
      paddingTop: 4,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    logo: {
      width: 32, // even smaller width
      height: 32, // even smaller height
      marginRight: 8,
      marginBottom: 2,
      objectFit: 'contain',
      borderRadius: 4,
      backgroundColor: '#fff',
    },
  });

  // PDF Document component
  const SampleReportPDF = ({ sample, results, safeTests, LAB_INFO }: any) => (
    <Document>
      {/* Page 1: info + first test (if exists) */}
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {LAB_INFO.logo && (
              <Image src={LAB_INFO.logo} style={pdfStyles.logo} />
            )}
            <View style={pdfStyles.labInfo}>
              <Text style={pdfStyles.title}>{LAB_INFO.name}</Text>
              <Text>{LAB_INFO.address}</Text>
              <Text>Phone: {LAB_INFO.phone}</Text>
              <Text>Email: {LAB_INFO.email}</Text>
            </View>
          </View>
          <View>
            <Text>Report Date: {new Date().toLocaleDateString()}</Text>
            <Text>Accession #: {sample.accession_number || "N/A"}</Text>
          </View>
        </View>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.title}>Patient & Sample Information</Text>
          <Text>Patient Name: {sample.patient?.name || "N/A"}</Text>
          <Text>Phone: {sample.patient?.phone || "N/A"}</Text>
          <Text>Sample Type(s): {sample.sample_type || "N/A"}</Text>
          <Text>Collection Date: {sample.collection_date ? sample.collection_date.split('T')[0] : "N/A"}</Text>
          <Text>Collection Time: {sample.collection_date ? new Date(sample.collection_date).toTimeString().split(' ')[0] : "N/A"}</Text>
          <Text>Doctor: {sample.doctor_name || "N/A"}</Text>
          <Text>Gender: {sample.patient?.gender || "N/A"}</Text>
          <Text>Age: {sample.patient?.age || "N/A"}</Text>
        </View>
        {/* First test (if exists) */}
        {safeTests[0] && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.title}>
              Test: {safeTests[0].name || safeTests[0].code || safeTests[0].id || "N/A"}
              {safeTests[0].sample_types && (
                <> ({Array.isArray(safeTests[0].sample_types) ? safeTests[0].sample_types.join(', ') : safeTests[0].sample_types || "Unknown"})</>
              )}
            </Text>
            <View style={pdfStyles.table}>
              <View style={pdfStyles.tableRow}>
                <Text style={pdfStyles.tableCellHeader}>Parameter</Text>
                <Text style={pdfStyles.tableCellHeader}>Value</Text>
                <Text style={pdfStyles.tableCellHeader}>Unit</Text>
                <Text style={pdfStyles.tableCellHeader}>Normal Range</Text>
              </View>
              {Array.isArray(safeTests[0].parameters) && safeTests[0].parameters.length > 0 ? (
                safeTests[0].parameters.map((param: any, paramIndex: number) => {
                  const paramName = typeof param === 'object' && param.name ? param.name : param;
                  const paramUnits = typeof param === 'object' && param.units ? param.units : '';
                  const paramRange = typeof param === 'object' && param.normal_range ? param.normal_range : '';
                  return (
                    <View style={pdfStyles.tableRow} key={paramIndex}>
                      <Text style={pdfStyles.tableCell}>{paramName}</Text>
                      <Text style={pdfStyles.tableCell}>{results[safeTests[0].id]?.[paramName] || ''}</Text>
                      <Text style={pdfStyles.tableCell}>{paramUnits || '—'}</Text>
                      <Text style={pdfStyles.tableCell}>{paramRange || '—'}</Text>
                    </View>
                  );
                })
              ) : (
                <View style={pdfStyles.tableRow}>
                  <Text style={pdfStyles.tableCell}>No parameters available for this test.</Text>
                </View>
              )}
            </View>
            {safeTests[0].notes && (
              <Text style={{ fontSize: 9, marginTop: 2 }}>
                Notes: {safeTests[0].notes}
              </Text>
            )}
          </View>
        )}
        <View style={pdfStyles.signature}>
          <View>
            <Text>Lab Technician:</Text>
            <View style={pdfStyles.signatureBox} />
          </View>
          <View>
            <Text>Doctor:</Text>
            <View style={pdfStyles.signatureBox} />
          </View>
        </View>
        <View style={pdfStyles.footer} fixed>
          <Text>
            {LAB_INFO.name} © {new Date().getFullYear()} | {LAB_INFO.address} | Phone: {LAB_INFO.phone}
          </Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            fixed
          />
        </View>
      </Page>
      {/* One page per test, starting from the SECOND test (index 1) */}
      {safeTests.slice(1).map((test: any, index: number) => (
        <Page key={index + 1} size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {LAB_INFO.logo && (
                <Image src={LAB_INFO.logo} style={pdfStyles.logo} />
              )}
              <View style={pdfStyles.labInfo}>
                <Text style={pdfStyles.title}>{LAB_INFO.name}</Text>
                <Text>{LAB_INFO.address}</Text>
                <Text>Phone: {LAB_INFO.phone}</Text>
                <Text>Email: {LAB_INFO.email}</Text>
              </View>
            </View>
            <View>
              <Text>Report Date: {new Date().toLocaleDateString()}</Text>
              <Text>Accession #: {sample.accession_number || "N/A"}</Text>
            </View>
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.title}>
              Test: {test.name || test.code || test.id || "N/A"}
              {test.sample_types && (
                <> ({Array.isArray(test.sample_types) ? test.sample_types.join(', ') : test.sample_types || "Unknown"})</>
              )}
            </Text>
            <View style={pdfStyles.table}>
              <View style={pdfStyles.tableRow}>
                <Text style={pdfStyles.tableCellHeader}>Parameter</Text>
                <Text style={pdfStyles.tableCellHeader}>Value</Text>
                <Text style={pdfStyles.tableCellHeader}>Unit</Text>
                <Text style={pdfStyles.tableCellHeader}>Normal Range</Text>
              </View>
              {Array.isArray(test.parameters) && test.parameters.length > 0 ? (
                test.parameters.map((param: any, paramIndex: number) => {
                  const paramName = typeof param === 'object' && param.name ? param.name : param;
                  const paramUnits = typeof param === 'object' && param.units ? param.units : '';
                  const paramRange = typeof param === 'object' && param.normal_range ? param.normal_range : '';
                  return (
                    <View style={pdfStyles.tableRow} key={paramIndex}>
                      <Text style={pdfStyles.tableCell}>{paramName}</Text>
                      <Text style={pdfStyles.tableCell}>{results[test.id]?.[paramName] || ''}</Text>
                      <Text style={pdfStyles.tableCell}>{paramUnits || '—'}</Text>
                      <Text style={pdfStyles.tableCell}>{paramRange || '—'}</Text>
                    </View>
                  );
                })
              ) : (
                <View style={pdfStyles.tableRow}>
                  <Text style={pdfStyles.tableCell}>No parameters available for this test.</Text>
                </View>
              )}
            </View>
            {test.notes && (
              <Text style={{ fontSize: 9, marginTop: 2 }}>
                Notes: {test.notes}
              </Text>
            )}
          </View>
          <View style={pdfStyles.signature}>
            <View>
              <Text>Lab Technician:</Text>
              <View style={pdfStyles.signatureBox} />
            </View>
            <View>
              <Text>Doctor:</Text>
              <View style={pdfStyles.signatureBox} />
            </View>
          </View>
          <View style={pdfStyles.footer} fixed>
            <Text>
              {LAB_INFO.name} © {new Date().getFullYear()} | {LAB_INFO.address} | Phone: {LAB_INFO.phone}
            </Text>
            <Text
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
              fixed
            />
          </View>
        </Page>
      ))}
    </Document>
  );

  return (
    <ErrorBoundary>
      {/* Report Wrapper for PDF/Print */}
      <div ref={reportRef} className="report-wrapper">
        <style>{reportStyles}</style>
        {/* Header */}
        <div className="report-header print:report-header">
          <div className="flex items-start" style={{ borderBottom: '1px solid #ccc', margin: '24px 0 18px 0', padding: '8px 0 6px 0', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {labInfo.logo && (
                <img
                  src={labInfo.logo}
                  alt="Lab Logo"
                  style={{ width: 60, height: 60, marginRight: 12, marginBottom: 4, objectFit: 'contain', borderRadius: 4, background: '#fff' }}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>{labInfo.name}</span>
                <span>{labInfo.address}</span>
                <span>Phone: {labInfo.phone}</span>
                <span>Email: {labInfo.email}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span>Report Date: {new Date().toLocaleDateString()}</span><br />
              <span>Accession #: {sample.accession_number || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="report-content print:bg-white print:text-black avoid-break">
          <Card>
            <CardHeader>
              <CardTitle>Patient & Sample Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><strong>Patient Name:</strong> {sample.patient?.name || "N/A"}</p>
                <p><strong>Phone:</strong> {sample.patient?.phone || "N/A"}</p>
                <p><strong>Sample Type(s):</strong> {sample.sample_type || "N/A"}</p>
                <p><strong>Collection Date:</strong> {formattedCollection.date}</p>
                <p><strong>Collection Time:</strong> {formattedCollection.time}</p>
                <p><strong>Doctor:</strong> {sample.doctor_name || "N/A"}</p>
                <p><strong>Gender:</strong> {sample.patient?.gender || "N/A"}</p>
                <p><strong>Age:</strong> {sample.patient?.age || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {safeTests.map((test: any, index: number) => (
            <div
              key={index}
              className="test-card-print"
              style={{
                marginTop: 24,
                marginBottom: 0,
                width: "100%",
                maxWidth: "190mm",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <Card className="space-y-4 mt-6" style={{ boxShadow: "none", borderRadius: 0 }}>
                <CardHeader>
                  <CardTitle>
                    Test: {test.name || test.code || test.id || "N/A"}
                    {test.sample_types && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({Array.isArray(test.sample_types) ? test.sample_types.join(', ') : test.sample_types || "Unknown"})
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border p-4 rounded-md" style={{ borderRadius: 0 }}>
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
                            test.parameters.map((param: any, paramIndex: number) => {
                              const paramName = typeof param === 'object' && param.name ? param.name : param;
                              const paramUnits = typeof param === 'object' && param.units ? param.units : '';
                              const paramRange = typeof param === 'object' && param.normal_range ? param.normal_range : '';
                              return (
                                <tr key={paramIndex}>
                                  <td className="border px-2 py-1 font-medium">{paramName}</td>
                                  <td className="border px-2 py-1">{results[test.id]?.[paramName] || ''}</td>
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
                    {test.notes && (
                      <div className="mt-2 text-sm text-gray-700">
                        <strong>Notes:</strong> {test.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Signature area */}
          <div className="flex justify-between mt-12 px-2 avoid-break">
            <div>
              <span className="font-semibold">Lab Technician:</span>
              <div className="h-8 border-b border-gray-400 w-48"></div>
            </div>
            <div>
              <span className="font-semibold">Doctor:</span>
              <div className="h-8 border-b border-gray-400 w-48"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="report-footer print:report-footer">
          <span>
            {labInfo.name} &copy; {new Date().getFullYear()} | {labInfo.address} | Phone: {labInfo.phone}
          </span>
          <span>
            Page <span className="page-number" />
          </span>
        </div>
      </div>
      {/* Print & PDF buttons (hidden on print) */}
      <div className="mt-6 flex gap-2 no-print">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={() => window.print()}>
          Print Report
        </button>
        <PDFDownloadLink
          document={
            <SampleReportPDF
              sample={sample}
              results={results}
              safeTests={safeTests}
              LAB_INFO={labInfo}
            />
          }
          fileName={`SampleReport_${sample?.accession_number || 'report'}.pdf`}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </div>
    </ErrorBoundary>
  );
};

export default SampleReport;
