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
    <div className="p-6 print:bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Admission Report</h1>
            <div className="text-sm text-gray-600">University ID: <span className="font-mono">{inlineReport.university_id}</span></div>
          </div>
          <div className="flex flex-col items-end gap-2 print:hidden">
            {inlineReport.mr?.url && (
              <a href={inlineReport.mr.url} target="_blank" rel="noreferrer">
                <Button variant="outline">Download MR</Button>
              </a>
            )}
            <Button variant="outline" onClick={() => window.print()}>Print / Export PDF</Button>
          </div>
        </div>

        {/* First two sections grouped in one div, stacked vertically */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Student Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      <div className="md:col-span-1 flex items-start">
                        <div className="w-36 h-36 rounded border overflow-hidden bg-gray-50 flex items-center justify-center mr-4">
                          {inlineReport.personal_info?.picture?.file_url ? (
                            <img src={inlineReport.personal_info.picture.file_url} alt="photo" className="w-full h-full object-cover" onError={(e: any) => { try { e.currentTarget.onerror = null; } catch (err) {} e.currentTarget.src = '/placeholder.svg'; }} />
                          ) : (
                            <img src={'/placeholder.svg'} alt="photo" className="w-full h-full object-cover" />
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-gray-500">Full name</div>
                            <div className="font-semibold text-base">{personalWithDefaults.name}</div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-500">Date of Birth</div>
                            <div className="font-medium">{personalWithDefaults.date_of_birth}</div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-500">Gender</div>
                            <div className="font-medium">{personalWithDefaults.gender}</div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-500">Quota</div>
                            <div className="font-medium">{personalWithDefaults.quota}</div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-500">Religion</div>
                            <div className="font-medium">{personalWithDefaults.religion}</div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-500">Disability / Blood Group</div>
                            <div className="font-medium">{personalWithDefaults.disability_status} / {personalWithDefaults.blood_group}</div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-500">Student Mobile</div>
                            <div className="font-medium">{personalWithDefaults.student_mobile}</div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-500">Student Email</div>
                            <div className="font-medium">{personalWithDefaults.student_email}</div>
                          </div>

                          <div className="sm:col-span-2 lg:col-span-3">
                            <div className="text-xs text-gray-500">Present Address</div>
                            <div className="text-sm font-medium">{personalWithDefaults.present_address}</div>
                          </div>

                          <div className="sm:col-span-2 lg:col-span-3">
                            <div className="text-xs text-gray-500">Permanent Address</div>
                            <div className="text-sm font-medium">{personalWithDefaults.permanent_address}</div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="w-full sm:w-1/2 md:w-1/3">
                        <div className="text-xs text-gray-500">Father</div>
                        <div className="font-medium">{personalWithDefaults.father_name}</div>
                        <div className="text-sm text-gray-600">{personalWithDefaults.father_contact}</div>
                      </div>

                      <div className="w-full sm:w-1/2 md:w-1/3">
                        <div className="text-xs text-gray-500">Mother</div>
                        <div className="font-medium">{personalWithDefaults.mother_name}</div>
                        <div className="text-sm text-gray-600">{personalWithDefaults.mother_contact}</div>
                      </div>

                      <div className="w-full sm:w-1/2 md:w-1/3">
                        <div className="text-xs text-gray-500">Local Guardian</div>
                        <div className="font-medium">{personalWithDefaults.local_guardian?.name}</div>
                        <div className="text-sm text-gray-600">{personalWithDefaults.local_guardian?.contact}</div>
                      </div>

                      <div className="w-full sm:w-1/2 md:w-1/3">
                        <div className="text-xs text-gray-500">ID Numbers</div>
                        <div className="text-sm">{typeof personalWithDefaults.id_numbers === 'string' ? personalWithDefaults.id_numbers : JSON.stringify(personalWithDefaults.id_numbers)}</div>
                      </div>

                      <div className="w-full sm:w-1/2 md:w-1/3">
                        <div className="text-xs text-gray-500">Required Credits / Grading System</div>
                        <div className="text-sm">{personalWithDefaults.required_credits} / {personalWithDefaults.grading_system}</div>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Identifiers & Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="mb-2"><div className="text-xs text-gray-500">University ID / Roll</div><div className="font-mono font-semibold">{inlineReport.university_id}</div></div>
                    <div className="mb-2"><div className="text-xs text-gray-500">UGC Unique ID</div><div className="font-mono font-semibold">{inlineReport.ugc_id || '-'}</div></div>
                    <div className="mb-2"><div className="text-xs text-gray-500">Program</div><div className="font-medium">{inlineReport.program}</div></div>
                    <div className="mb-2"><div className="text-xs text-gray-500">Semester / Batch</div><div className="font-medium">{inlineReport.semester} / {inlineReport.batch}</div></div>
                    <div className="mb-2"><div className="text-xs text-gray-500">University Email</div><div className="font-medium">{inlineReport.university_email}</div></div>
                    <div className="mb-2"><div className="text-xs text-gray-500">Syllabus Version</div><div className="font-medium">{inlineReport.syllabus_version}</div></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Remaining report content */}
        <div className="space-y-4">

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>First Semester Registration</CardTitle>
              <div className="print:hidden">
                {inlineReport.first_semester_courses_download_url && (
                  <a href={inlineReport.first_semester_courses_download_url} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="ml-2"><Download className="w-4 h-4 mr-2" />Download</Button>
                  </a>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-xs text-gray-600 border-b">
                      <th className="px-2 py-1 text-left">Code</th>
                      <th className="px-2 py-1 text-left">Title</th>
                      <th className="px-2 py-1 text-center">Credits</th>
                      <th className="px-2 py-1 text-left">Section</th>
                      <th className="px-2 py-1 text-left">Faculty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(inlineReport.first_semester_courses || []).map((c: any, i: number) => (
                      <tr key={i} className="odd:bg-white even:bg-gray-50">
                        <td className="px-2 py-1 text-left">{c.code}</td>
                        <td className="px-2 py-1 text-left">{c.title}</td>
                        <td className="px-2 py-1 text-center">{c.credits}</td>
                        <td className="px-2 py-1 text-left">{c.section}</td>
                        <td className="px-2 py-1 text-left">{c.faculty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tuition Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-sm text-gray-600 border-b">
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Cost Head</th>
                      <th className="px-3 py-2 text-center">Credit Taken</th>
                      <th className="px-3 py-2 text-right">Cost Amount</th>
                      <th className="px-3 py-2 text-right">Deductive Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const rows: any[] = [];
                      const fs = inlineReport.fee_structure || {};
                      rows.push({ head: 'Total Course Fee', credits: (inlineReport.first_semester_courses || []).reduce((s: number, c: any) => s + (c?.credits || 0), 0), amount: inlineReport.first_semester_tuition?.amount ? Math.max(0, inlineReport.first_semester_tuition.amount - (fs.labFeePerCourse || 0) * ((inlineReport.first_semester_courses || []).filter((c: any) => c.type === 'lab').length)) : (fs.perCreditFee ? (fs.perCreditFee * (inlineReport.first_semester_courses || []).reduce((s: number, c: any) => s + (c?.credits || 0), 0)) : 0), deductive: 0 });
                      rows.push({ head: 'Retake Course Fee', credits: '-', amount: fs.retakeFee || 12000, deductive: 0 });
                      rows.push({ head: 'Semester Fee', credits: '-', amount: fs.semesterFee || 5000, deductive: 0 });
                      rows.push({ head: 'F/Asst.', credits: '-', amount: fs.facultyAssistantFee || 1000, deductive: 0 });
                      const total = rows.reduce((s: number, r: any) => s + (Number(r.amount || 0) - Number(r.deductive || 0)), 0);
                      return (
                        <>
                          {rows.map((r: any, i: number) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                              <td className="px-3 py-2 align-top text-left">{i + 1}</td>
                              <td className="px-3 py-2 align-top text-left">{r.head}</td>
                              <td className="px-3 py-2 align-top text-center">{r.credits}</td>
                              <td className="px-3 py-2 align-top text-right">BDT {Number(r.amount || 0).toLocaleString()}</td>
                              <td className="px-3 py-2 align-top text-right">BDT {Number(r.deductive || 0).toLocaleString()}</td>
                            </tr>
                          ))}

                          <tr className="">
                            <td colSpan={5} />
                          </tr>
                          <tr>
                            <td colSpan={3} />
                            <td className="px-3 py-2 text-right font-medium">Total Fee</td>
                            <td className="px-3 py-2 text-right font-mono">BDT {Number(total || 0).toLocaleString()}</td>
                          </tr>
                        </>
                      );
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
