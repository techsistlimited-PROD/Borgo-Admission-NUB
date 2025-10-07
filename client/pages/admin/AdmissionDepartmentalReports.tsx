import React from 'react';

export default function AdmissionDepartmentalReports() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admission Departmental Reports</h1>
      <p className="text-sm text-gray-600 mb-4">Program-wise, semester-wise and year-wise admission reports, fee collection, waiver reports and exportable data.</p>
      <ul className="list-disc pl-6 space-y-1 text-sm">
        <li>Program-wise number of admitted students per semester</li>
        <li>Employee-wise admission fee collection</li>
        <li>Semester-wise waiver amounts and reports</li>
      </ul>
    </div>
  );
}
