import React from 'react';

export default function FeeStructurePackageManagement() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Fee Structure & Package Management</h1>
      <p className="text-sm text-gray-600 mb-4">Manage registration packages, fee items, waivers, quotas, discounts and auto-generation of fee bills and receipts.</p>
      <ul className="list-disc pl-6 space-y-1 text-sm">
        <li>Registration packages and per-credit calculations</li>
        <li>Waiver management according to SSC/HSC and other policies</li>
        <li>Quota & discount management</li>
      </ul>
    </div>
  );
}
