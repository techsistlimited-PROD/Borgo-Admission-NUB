import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Download, Calendar, MapPin, Clock, User, GraduationCap } from 'lucide-react';

interface AdmitCardProps {
  studentInfo: {
    name: string;
    applicationId: string;
    phone: string;
    email: string;
    photo?: string;
  };
  programInfo: {
    name: string;
    level: 'undergraduate' | 'postgraduate';
  };
  testInfo: {
    date: string;
    time: string;
    venue: string;
    instructions: string[];
  };
  onDownload: () => void;
}

export default function AdmitCard({
  studentInfo,
  programInfo,
  testInfo,
  onDownload
}: AdmitCardProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-deep-plum">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-deep-plum text-white p-6 text-center">
            <h1 className="text-2xl font-bold font-poppins mb-2">
              Northern University Bangladesh
            </h1>
            <p className="text-lg">ADMISSION TEST ADMIT CARD</p>
            <p className="text-sm opacity-90 mt-1">
              {programInfo.level === 'undergraduate' ? 'Undergraduate' : 'Postgraduate'} Programs
            </p>
          </div>

          {/* Student Information */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-deep-plum mb-4">
                  <User className="w-5 h-5 inline mr-2" />
                  Candidate Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name:</label>
                    <p className="font-semibold">{studentInfo.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Application ID:</label>
                    <p className="font-semibold">{studentInfo.applicationId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone:</label>
                    <p className="font-semibold">{studentInfo.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email:</label>
                    <p className="font-semibold text-sm">{studentInfo.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Photo */}
              <div className="w-24 h-32 border-2 border-gray-300 rounded flex-shrink-0">
                {studentInfo.photo ? (
                  <img
                    src={studentInfo.photo}
                    alt="Student"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Program Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-deep-plum mb-3">
              <GraduationCap className="w-5 h-5 inline mr-2" />
              Program Applied For
            </h3>
            <p className="font-semibold text-lg">{programInfo.name}</p>
          </div>

          {/* Test Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-deep-plum mb-4">
              Test Schedule & Venue
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-accent-purple" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Date:</label>
                  <p className="font-semibold">{testInfo.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent-purple" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Time:</label>
                  <p className="font-semibold">{testInfo.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent-purple" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Venue:</label>
                  <p className="font-semibold">{testInfo.venue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-deep-plum mb-3">
              Important Instructions
            </h3>
            <ul className="space-y-2 text-sm">
              {testInfo.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-accent-purple rounded-full mt-2 flex-shrink-0"></span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">
                  Generated on: {new Date().toLocaleDateString('en-GB')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This is a computer-generated admit card. No signature required.
                </p>
              </div>
              <Button
                onClick={onDownload}
                className="bg-deep-plum hover:bg-accent-purple"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
