import React from 'react';

export default function CreditTransferManagement() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Credit Transfer Student Management</h1>
      <p className="text-sm text-gray-600 mb-4">Manage transferred courses, grade equivalency, integration of transferred grades into current CGPA and transcript exports.</p>
      <ul className="list-disc pl-6 space-y-1 text-sm">
        <li>Transferred course grade equivalency mapping</li>
        <li>Transferred grades calculation with current CGPA</li>
        <li>Include transferred grades in transcript</li>
      </ul>
    </div>
  );
}
