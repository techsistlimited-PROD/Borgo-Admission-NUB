import { useState } from 'react';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, XCircle, Filter, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function Notifications() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [filter, setFilter] = useState('all');
  const [readNotifications, setReadNotifications] = useState<number[]>([]);

  const texts = {
    en: {
      title: 'Notifications Center',
      back: 'Back to Dashboard',
      filterAll: 'All',
      filterUnread: 'Unread',
      filterRead: 'Read',
      filterByType: 'Filter by Type',
      markAllRead: 'Mark All as Read',
      noNotifications: 'No notifications found',
      otpSent: 'OTP Sent',
      paymentReceived: 'Payment Received',
      applicationApproved: 'Application Approved',
      applicationRejected: 'Application Rejected',
      idCreated: 'Student ID Created',
      documentsRequired: 'Documents Required',
      new: 'New',
      read: 'Read'
    },
    bn: {
      title: 'বিজ্ঞপ্তি কেন্দ্র',
      back: 'ড্যাশবোর্ডে ফিরুন',
      filterAll: 'সব',
      filterUnread: 'অপঠিত',
      filterRead: 'পঠিত',
      filterByType: 'ধরন অনুযায়ী ফিল্টার',
      markAllRead: 'সব পঠিত করুন',
      noNotifications: 'কোন বিজ্ঞপ্তি পাওয়া যায়নি',
      otpSent: 'ওটিপি পাঠানো',
      paymentReceived: 'পেমেন্ট প্রাপ্ত',
      applicationApproved: 'আবেদন অনুমোদিত',
      applicationRejected: 'আবেদন প্রত্যাখ্যাত',
      idCreated: 'ছাত্র আইডি তৈর���',
      documentsRequired: 'কাগজপত্র প্রয়োজন',
      new: 'নতুন',
      read: 'পঠিত'
    }
  };

  const t = texts[language];

  const notifications = [
    {
      id: 1,
      type: 'success',
      category: 'application_approved',
      title: 'Application Approved',
      message: 'Your application NU2024001234 for BSc Computer Science has been approved. Congratulations!',
      timestamp: '2024-01-20 14:30',
      read: false
    },
    {
      id: 2,
      type: 'info',
      category: 'payment_received',
      title: 'Payment Received',
      message: 'We have received your payment of BDT 54,750 for application NU2024001234.',
      timestamp: '2024-01-19 10:15',
      read: false
    },
    {
      id: 3,
      type: 'success',
      category: 'id_created',
      title: 'Student ID Created',
      message: 'Your student ID (NU24CS001234) has been created. You can download your credentials from the dashboard.',
      timestamp: '2024-01-18 16:45',
      read: true
    },
    {
      id: 4,
      type: 'warning',
      category: 'documents_required',
      title: 'Additional Documents Required',
      message: 'Please upload your original HSC certificate for application NU2024001235.',
      timestamp: '2024-01-17 09:20',
      read: false
    },
    {
      id: 5,
      type: 'info',
      category: 'otp_sent',
      title: 'OTP Verification',
      message: 'OTP code has been sent to your mobile number +880 1234567890.',
      timestamp: '2024-01-16 12:30',
      read: true
    },
    {
      id: 6,
      type: 'error',
      category: 'application_rejected',
      title: 'Application Rejected',
      message: 'Your application NU2024001236 has been rejected due to incomplete documents.',
      timestamp: '2024-01-15 11:00',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (notificationId: number) => {
    setReadNotifications(prev => [...prev, notificationId]);
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read && !readNotifications.includes(n.id)).map(n => n.id);
    setReadNotifications(prev => [...prev, ...unreadIds]);
  };

  const isRead = (notification: any) => notification.read || readNotifications.includes(notification.id);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !isRead(notification);
    if (filter === 'read') return isRead(notification);
    return true;
  });

  const unreadCount = notifications.filter(n => !isRead(n)).length;

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-accent-purple hover:text-deep-plum mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Link>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {t.title}
              </h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} {t.new}
                </Badge>
              )}
            </div>
            
            {/* Language Toggle */}
            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-deep-plum text-white'
                    : 'text-gray-600 hover:text-deep-plum'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === 'bn'
                    ? 'bg-deep-plum text-white'
                    : 'text-gray-600 hover:text-deep-plum'
                }`}
              >
                BN
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t.filterByType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.filterAll}</SelectItem>
                    <SelectItem value="unread">{t.filterUnread}</SelectItem>
                    <SelectItem value="read">{t.filterRead}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={markAllAsRead}
                variant="outline"
                disabled={unreadCount === 0}
                className="text-accent-purple border-accent-purple hover:bg-accent-purple hover:text-white"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                {t.markAllRead}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t.noNotifications}</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`shadow-lg transition-all cursor-pointer hover:shadow-xl ${
                  isRead(notification) ? 'bg-white' : getNotificationBg(notification.type)
                } ${!isRead(notification) ? 'border-l-4 border-l-accent-purple' : ''}`}
                onClick={() => !isRead(notification) && markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            isRead(notification) ? 'text-gray-700' : 'text-deep-plum'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 text-sm ${
                            isRead(notification) ? 'text-gray-600' : 'text-gray-800'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            {notification.timestamp}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          {isRead(notification) ? (
                            <Badge variant="outline" className="text-gray-500">
                              {t.read}
                            </Badge>
                          ) : (
                            <Badge className="bg-accent-purple text-white">
                              {t.new}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-deep-plum">{notifications.length}</div>
              <p className="text-sm text-gray-600">Total Notifications</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-accent-purple">{unreadCount}</div>
              <p className="text-sm text-gray-600">Unread</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => isRead(n)).length}
              </div>
              <p className="text-sm text-gray-600">Read</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
