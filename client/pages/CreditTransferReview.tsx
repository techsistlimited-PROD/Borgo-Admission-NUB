import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Trash, Plus, Check, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../hooks/use-toast";
import apiClient from "../lib/api";

export default function CreditTransferReview(){
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coursesCatalog, setCoursesCatalog] = useState<any[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [pickedCourse, setPickedCourse] = useState<any | null>(null);
  const [savedTransferCourses, setSavedTransferCourses] = useState<any[]>([]); // courses currently saved to application (transcript)
  const [pendingCourses, setPendingCourses] = useState<any[]>([]); // staged courses not yet saved
  const [saving, setSaving] = useState(false);
  const [makingStudent, setMakingStudent] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentCreated, setStudentCreated] = useState<any>(null);

  const load = async ()=>{
    if (!id) return;
    setLoading(true);
    try{
      const res = await apiClient.getApplication(id);
      if (res.success && res.data){
        setApplication(res.data.application || res.data);
        const existing = (res.data.application && res.data.application.transfer_courses) || res.data.transfer_courses || [];
        setSavedTransferCourses(Array.isArray(existing)? existing : []);
        setPendingCourses([]);
      }
    }catch(e){ console.error(e); toast({ title: 'Error', description: 'Failed to load applicant' , variant: 'destructive'}); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{ load(); }, [id]);

  const searchCourses = async (q: string)=>{
    try{
      const res = await apiClient.getCourses(q);
      if (res.success && res.data) setCoursesCatalog(Array.isArray(res.data)? res.data : []);
    }catch(e){ console.error(e); }
  }

  useEffect(()=>{
    const t = setTimeout(()=>{ if (searchCode && searchCode.length>=2) searchCourses(searchCode); }, 300);
    return ()=>clearTimeout(t);
  }, [searchCode]);

  const addPickedCourse = ()=>{
    if (!pickedCourse) return;
    // check duplicates in pending or saved (transcript)
    if (pendingCourses.find((c)=>c.code === pickedCourse.id || c.id === pickedCourse.id) || savedTransferCourses.find((c)=>c.code === pickedCourse.id || c.id === pickedCourse.id)){
      toast({ title: 'Already added', description: 'Course already in list' });
      return;
    }
    setPendingCourses(prev=>[...prev, { code: pickedCourse.id, title: pickedCourse.title, credits: pickedCourse.credits, grade: '', gpa: '' }]);
    setPickedCourse(null);
    setSearchCode('');
    setCoursesCatalog([]);
  }

  const removeCourse = (code: string)=>{
    // remove from pending if exists, otherwise from saved (transcript)
    if (pendingCourses.find(c=>c.code===code || c.id===code)){
      setPendingCourses(prev=>prev.filter(c=>c.code !== code));
      return;
    }
    setSavedTransferCourses(prev=>prev.filter(c=>c.code !== code));
  }

  const updateCourseField = (code: string, field: string, value: any)=>{
    // update pending first, otherwise saved
    if (pendingCourses.find(c=>c.code===code || c.id===code)){
      setPendingCourses(prev=> prev.map(c=> c.code===code ? { ...c, [field]: value } : c));
      return;
    }
    setSavedTransferCourses(prev=> prev.map(c=> c.code===code ? { ...c, [field]: value } : c));
  }

  const canMakeStudent = useMemo(()=>{
    if (!application) return false;
    if (!application.documents || !application.documents.transcript) return false;
    // require at least one saved (persisted) transfer course with grades
    if (savedTransferCourses.length === 0) return false;
    if (savedTransferCourses.some(c=> !c.grade || c.grade.toString().trim()==='' || c.gpa===undefined || c.gpa==='' )) return false;
    return true;
  }, [application, savedTransferCourses]);

  // CGPA calculations
  const transferStats = useMemo(()=>{
    const credits = transferCourses.reduce((s:number,c:any)=> s + (Number(c.credits)||0), 0);
    const weighted = transferCourses.reduce((s:number,c:any)=> s + ((Number(c.gpa)||0) * (Number(c.credits)||0)), 0);
    const transferGPA = credits>0 ? (weighted/credits) : 0;
    const currentCredits = Number(application?.completedCredits || application?.completed_credits || application?.academic_history?.completedCredits || 0);
    const currentCGPA = Number(application?.previousCGPA || application?.previous_cgpa || application?.academic_history?.previousCGPA || application?.academic_history?.previous_cgpa || 0);
    const combinedCredits = currentCredits + credits;
    const combinedCGPA = combinedCredits>0 ? ((currentCGPA*currentCredits) + (transferGPA*credits))/combinedCredits : 0;
    return { credits, transferGPA, currentCredits, currentCGPA, combinedCredits, combinedCGPA };
  }, [transferCourses, application]);

  const handleSave = async ()=>{
    if (!application) return;
    if (transferCourses.length===0){ toast({ title:'Error', description:'Add at least one course', variant:'destructive'}); return; }
    // validate fields
    for (const c of transferCourses){ if (!c.grade || c.gpa==='' ) { toast({ title:'Validation', description:'Please fill grade and GPA for all courses', variant:'destructive'}); return; } }
    setSaving(true);
    try{
      const res = await apiClient.saveTransferCourses({ applicant_id: application.id, courses: transferCourses });
      if (res.success) { toast({ title:'Saved', description:'Transfer courses saved' }); await load(); }
      else toast({ title:'Error', description: res.error || 'Failed to save', variant:'destructive' });
    }catch(e){ console.error(e); toast({ title:'Error', description:'Failed to save', variant:'destructive' }); }
    finally{ setSaving(false); }
  }

  const handleMakeStudent = async ()=>{
    if (!application) return;
    if (!canMakeStudent) { toast({ title:'Cannot proceed', description:'Ensure transcript and transfer courses with grades are present', variant:'destructive'}); return; }
    setMakingStudent(true);
    try{
      // ensure transfer courses saved first
      await apiClient.saveTransferCourses({ applicant_id: application.id, courses: transferCourses });
      const res = await apiClient.generateStudentForApplicant(application.id);
      if (res.success && res.data){
        setStudentCreated(res.data);
        setStudentModalOpen(true);
        try{ await apiClient.updateApplicationStatus(application.id, 'converted_to_student'); } catch(e){ console.warn(e); }
        try{ await apiClient.createStudentRecord(application.id, { university_id: res.data.student_id, ugc_id: res.data.ugc_id }); } catch(e){ console.warn(e); }
        await load();
      } else { toast({ title:'Error', description: res.error || 'Failed to generate student', variant:'destructive' }); }
    }catch(e){ console.error(e); toast({ title:'Error', description:'Failed to make student', variant:'destructive' }); }
    finally{ setMakingStudent(false); }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link to="/admin/credit-transfers" className="text-sm text-accent-purple hover:text-deep-plum">&larr; Back to Credit Transfer List</Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Applicant: {application?.applicant_name || application?.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Program</Label>
              <div>{application?.program_name || application?.program_code}</div>
            </div>
            <div>
              <Label>Campus</Label>
              <div>{application?.campus || '-'}</div>
            </div>
            <div className="md:col-span-2">
              <Label>Transcript</Label>
              {application?.documents?.transcript ? (
                <div className="border p-2 rounded">
                  <a href={application.documents.transcript} target="_blank" rel="noreferrer" className="text-blue-600">View Transcript (PDF)</a>
                </div>
              ) : (
                <div className="text-sm text-red-600">No transcript uploaded</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transfer Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input placeholder="Search course code or title" value={searchCode} onChange={(e:any)=>setSearchCode(e.target.value)} />
            <div className="flex-1">
              {coursesCatalog.slice(0,6).map(c=> (
                <div key={c.id} className={`p-2 border rounded mb-1 cursor-pointer ${pickedCourse?.id===c.id? 'bg-gray-100':''}`} onClick={()=>setPickedCourse(c)}>
                  <div className="font-medium">{c.id} - {c.title}</div>
                  <div className="text-sm text-gray-600">Credits: {c.credits}</div>
                </div>
              ))}
            </div>

            {/* Debug helper: load example courses directly into catalog for testing */}
            <div>
              <Button onClick={() => {
                const examples = [
                  { id: 'cse-201', title: 'Data Structures', credits: 3, code: 'CSE 201' },
                  { id: 'math-102', title: 'Calculus II', credits: 3, code: 'MATH 102' },
                  { id: 'eng-102', title: 'Academic Writing II', credits: 3, code: 'ENG 102' },
                ];
                setCoursesCatalog(examples);
              }}><Plus className="w-4 h-4 mr-2"/> Load Examples</Button>
            </div>

            <div>
              <Button onClick={addPickedCourse} disabled={!pickedCourse}><Plus className="w-4 h-4 mr-2"/> Add Course</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferCourses.map((c:any)=> (
                <TableRow key={c.code}>
                  <TableCell>{c.code}</TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.credits}</TableCell>
                  <TableCell>
                    <Input value={c.grade || ''} onChange={(e:any)=>updateCourseField(c.code,'grade',e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Input value={c.gpa || ''} onChange={(e:any)=>updateCourseField(c.code,'gpa',e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={()=>removeCourse(c.code)}><Trash className="w-4 h-4"/></Button>
                  </TableCell>
                </TableRow>
              ))}
              {transferCourses.length===0 && (
                <TableRow><TableCell colSpan={6}>No transfer courses added</TableCell></TableRow>
              )}
            </TableBody>
          </Table>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-500">Credits Transferred</div>
              <div className="font-semibold text-lg">{transferStats.credits}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-500">GPA from Transfer</div>
              <div className="font-semibold text-lg">{transferStats.transferGPA.toFixed(2)}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-500">Current NUB (Credits / CGPA)</div>
              <div className="font-semibold text-lg">{transferStats.currentCredits} / {transferStats.currentCGPA.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4 p-3 border rounded bg-gray-50">
            <div className="text-xs text-gray-500">Combined CGPA (after transfer)</div>
            <div className="font-semibold text-xl">{transferStats.combinedCGPA.toFixed(2)}</div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button onClick={handleSave} disabled={saving}><Check className="w-4 h-4 mr-2"/> Save Transfer Courses</Button>
            <Button className="bg-deep-plum" onClick={handleMakeStudent} disabled={!canMakeStudent || makingStudent}>
              {makingStudent? (<><Clock className="w-4 h-4 mr-2 animate-spin"/> Creating...</>) : ('Make Student')}
            </Button>
            <div className="text-sm text-gray-600 ml-4">Make Student is enabled when transcript present and all courses have grade & GPA.</div>
          </div>
        </CardContent>
      </Card>

      {/* Transcript Preview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transcript Preview (with Transferred Courses)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-xs text-gray-600 border-b">
                  <th className="px-2 py-1">Course Code</th>
                  <th className="px-2 py-1">Course Title</th>
                  <th className="px-2 py-1">Credits</th>
                  <th className="px-2 py-1">Grade</th>
                  <th className="px-2 py-1">Notes</th>
                </tr>
              </thead>
              <tbody>
                {(application?.transfer_courses || []).map((c:any,i:number)=> (
                  <tr key={`t-${i}`} className="odd:bg-white even:bg-gray-50">
                    <td className="px-2 py-1">{c.code}</td>
                    <td className="px-2 py-1">{c.title}</td>
                    <td className="px-2 py-1">{c.credits}</td>
                    <td className="px-2 py-1">{c.grade}</td>
                    <td className="px-2 py-1">Transferred</td>
                  </tr>
                ))}

                {transferCourses.map((c:any,i:number)=> (
                  <tr key={`new-${i}`} className="odd:bg-white even:bg-gray-50">
                    <td className="px-2 py-1">{c.code}</td>
                    <td className="px-2 py-1">{c.title}</td>
                    <td className="px-2 py-1">{c.credits}</td>
                    <td className="px-2 py-1">{c.grade || '-'}</td>
                    <td className="px-2 py-1">Transferred</td>
                  </tr>
                ))}

                {((application?.transfer_courses || []).length === 0 && transferCourses.length===0) && (
                  <tr><td colSpan={5} className="p-4 text-sm text-gray-500">No transferred courses added yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}
      {studentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-2">✅ Student Created with Credit Transfer</h3>
            <div className="mb-2">{studentCreated?.name || application?.applicant_name}</div>
            <div className="text-3xl font-mono font-bold mb-2">{studentCreated?.student_id}</div>
            <div className="text-sm text-gray-600 mb-4">UGC ID stored internally for reporting.</div>
            <div className="flex gap-2 justify-end">
              <Button onClick={()=>{ navigator.clipboard.writeText(studentCreated?.student_id || ''); toast({ title: 'Copied' }); }}>Copy Student ID</Button>
              <Button variant="outline" onClick={()=>setStudentModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
