import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

type Props = {
  inlineReport: any;
  personalWithDefaults: any;
  onClose: () => void;
};

export default function StudentReport({ inlineReport, personalWithDefaults, onClose }: Props) {
  if (!inlineReport) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-slate-50 p-6 print:static print:overflow-visible print:bg-white">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Admission Report</h1>
            <div className="text-sm text-gray-600">University ID: <span className="font-mono">{inlineReport.university_id}</span></div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button className="text-sm text-gray-600" onClick={onClose}>Close Report</button>
            {inlineReport.mr?.url && (
              <a href={inlineReport.mr.url} target="_blank" rel="noreferrer">
                <Button variant="outline">Download MR</Button>
              </a>
            )}
            <Button variant="outline" onClick={() => window.print()}>Print / Export PDF</Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student & Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 flex items-start">
                  <div className="w-28 h-28 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
                    {inlineReport.personal_info?.picture?.file_url ? (
                      <img src={inlineReport.personal_info.picture.file_url} alt="photo" className="w-full h-full object-cover" onError={(e: any) => { try { e.currentTarget.onerror = null; } catch (err) {} e.currentTarget.src = '/placeholder.svg'; }} />
                    ) : (
                      <img src={'/placeholder.svg'} alt="photo" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="font-medium">{personalWithDefaults.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Date of Birth</div>
                      <div>{personalWithDefaults.date_of_birth}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Gender</div>
                      <div>{personalWithDefaults.gender}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Quota</div>
                      <div>{personalWithDefaults.quota}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Religion</div>
                      <div>{personalWithDefaults.religion}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Disability / Blood Group</div>
                      <div>{personalWithDefaults.disability_status} / {personalWithDefaults.blood_group}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Student Mobile</div>
                      <div>{personalWithDefaults.student_mobile}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Student Email</div>
                      <div>{personalWithDefaults.student_email}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500">Present Address</div>
                      <div>{personalWithDefaults.present_address}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500">Permanent Address</div>
                      <div>{personalWithDefaults.permanent_address}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Father</div>
                      <div className="font-medium">{personalWithDefaults.father_name}</div>
                      <div className="text-sm text-gray-600">{personalWithDefaults.father_contact}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Mother</div>
                      <div className="font-medium">{personalWithDefaults.mother_name}</div>
                      <div className="text-sm text-gray-600">{personalWithDefaults.mother_contact}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Local Guardian</div>
                      <div className="font-medium">{personalWithDefaults.local_guardian?.name}</div>
                      <div className="text-sm text-gray-600">{personalWithDefaults.local_guardian?.contact}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-500">ID Numbers</div>
                    <div className="text-sm">{typeof personalWithDefaults.id_numbers === 'string' ? personalWithDefaults.id_numbers : JSON.stringify(personalWithDefaults.id_numbers)}</div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-500">Required Credits / Grading System</div>
                    <div className="text-sm">{personalWithDefaults.required_credits} / {personalWithDefaults.grading_system}</div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated IDs & Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500">University ID / Roll</div>
                  <div className="font-mono">{inlineReport.university_id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">UGC Unique ID</div>
                  <div className="font-mono">{inlineReport.ugc_id || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Program</div>
                  <div>{inlineReport.program}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Semester / Batch</div>
                  <div>{inlineReport.semester} / {inlineReport.batch}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">University Email</div>
                  <div>{inlineReport.university_email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Syllabus Version</div>
                  <div>{inlineReport.syllabus_version}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>First Semester Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-xs text-gray-600 border-b">
                      <th className="px-2 py-1">Code</th>
                      <th className="px-2 py-1">Title</th>
                      <th className="px-2 py-1">Credits</th>
                      <th className="px-2 py-1">Section</th>
                      <th className="px-2 py-1">Faculty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(inlineReport.first_semester_courses || []).map((c: any, i: number) => (
                      <tr key={i} className="odd:bg-white even:bg-gray-50">
                        <td className="px-2 py-1">{c.code}</td>
                        <td className="px-2 py-1">{c.title}</td>
                        <td className="px-2 py-1">{c.credits}</td>
                        <td className="px-2 py-1">{c.section}</td>
                        <td className="px-2 py-1">{c.faculty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>First Semester Tuition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-700">Download tuition bill or view detailed breakdown below.</div>
                <div className="flex items-center gap-2">
                  {inlineReport.first_semester_tuition?.url && (
                    <a href={inlineReport.first_semester_tuition.url} target="_blank" rel="noreferrer">
                      <Button className="bg-deep-plum"><Download className="w-4 h-4 mr-2" />Download</Button>
                    </a>
                  )}
                  <div className="text-sm font-mono">BDT {Number(inlineReport.first_semester_tuition?.amount || 0).toLocaleString()}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-sm text-gray-600 border-b">
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Cost Head</th>
                      <th className="px-3 py-2">Credit Taken</th>
                      <th className="px-3 py-2">Cost Amount</th>
                      <th className="px-3 py-2">Deductive Amount</th>
                      <th className="px-3 py-2">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const rows: any[] = [];
                      const fs = inlineReport.fee_structure || {};
                      rows.push({ head: 'Total Course Fee', credits: (inlineReport.first_semester_courses || []).reduce((s: number, c: any) => s + (c?.credits || 0), 0), amount: inlineReport.first_semester_tuition?.amount ? Math.max(0, inlineReport.first_semester_tuition.amount - (fs.labFeePerCourse || 0) * ((inlineReport.first_semester_courses || []).filter((c: any) => c.type === 'lab').length)) : (fs.perCreditFee ? (fs.perCreditFee * (inlineReport.first_semester_courses || []).reduce((s: number, c: any) => s + (c?.credits || 0), 0)) : 0), deductive: 0, remarks: 'Auto created payable during registration entry from ERP' });
                      rows.push({ head: 'Retake Course Fee', credits: '-', amount: fs.retakeFee || 12000, deductive: 0, remarks: '-' });
                      rows.push({ head: 'Semester Fee', credits: '-', amount: fs.semesterFee || 5000, deductive: 0, remarks: '-' });
                      rows.push({ head: 'F/Asst.', credits: '-', amount: fs.facultyAssistantFee || 1000, deductive: 0, remarks: '-' });
                      return rows.map((r: any, i: number) => (
                        <tr key={i} className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 align-top">{i + 1}</td>
                          <td className="px-3 py-2 align-top">{r.head}</td>
                          <td className="px-3 py-2 align-top">{r.credits}</td>
                          <td className="px-3 py-2 align-top">BDT {Number(r.amount || 0).toLocaleString()}</td>
                          <td className="px-3 py-2 align-top">BDT {Number(r.deductive || 0).toLocaleString()}</td>
                          <td className="px-3 py-2 align-top">{r.remarks}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
