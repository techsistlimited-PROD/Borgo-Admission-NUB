import React from 'react';

export default function ReportCentre() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Report Centre</h1>
      <p className="text-sm text-gray-600 mb-4">Central place for generating and downloading student lists, address labels, credit transfer lists and other admission related reports.</p>
      <ul className="list-disc pl-6 space-y-1 text-sm">
        <li>Student list details and address exports</li>
        <li>Admitted/Registered students address (envelop) exports</li>
        <li>Credit transferred student list</li>
      </ul>
    </div>
  );
}
