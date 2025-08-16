import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mobile' | 'email';
  contact: string;
  onVerificationSuccess: () => void;
  language?: 'en' | 'bn';
}

export default function OTPModal({ 
  isOpen, 
  onClose, 
  type, 
  contact, 
  onVerificationSuccess,
  language = 'en' 
}: OTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const texts = {
    en: {
      mobileTitle: 'Mobile Verification',
      emailTitle: 'Email Verification',
      mobileSubtitle: 'Enter the 6-digit code sent to',
      emailSubtitle: 'Enter the 6-digit code sent to',
      otpLabel: 'Verification Code',
      verify: 'Verify',
      resendCode: 'Resend Code',
      resendTimer: 'Resend in',
      seconds: 'seconds',
      success: 'Verification Successful!',
      error: 'Invalid code. Please try again.',
      close: 'Close',
      verifying: 'Verifying...'
    },
    bn: {
      mobileTitle: 'মোবাইল যাচাইকরণ',
      emailTitle: 'ইমেইল যাচাইকরণ',
      mobileSubtitle: 'পাঠানো ৬ ডিজিটের কোড প্রবেশ করান',
      emailSubtitle: 'পাঠানো ৬ ডিজিটের কোড প্রবেশ করান',
      otpLabel: 'যাচাইকরণ কোড',
      verify: 'যাচাই করুন',
      resendCode: 'কোড পুনরায় পাঠান',
      resendTimer: 'পুনরায় পাঠান',
      seconds: 'সেকেন্ডে',
      success: 'যাচাইকরণ সফল!',
      error: 'ভুল কোড। আবার চেষ্টা কর��ন।',
      close: 'বন্ধ করুন',
      verifying: 'যাচাই করা হচ্ছে...'
    }
  };

  const t = texts[language];

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setVerificationStatus('idle');
      setResendTimer(60);
      setCanResend(false);
      
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    setIsVerifying(true);
    setVerificationStatus('idle');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate verification logic (in real app, this would be an API call)
    if (otpCode === '123456') {
      setVerificationStatus('success');
      setTimeout(() => {
        onVerificationSuccess();
        onClose();
      }, 1500);
    } else {
      setVerificationStatus('error');
    }

    setIsVerifying(false);
  };

  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(60);
    setVerificationStatus('idle');
    setOtp(['', '', '', '', '', '']);

    // Start timer again
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate resend API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
            {type === 'mobile' ? '📱' : '✉️'}
            {type === 'mobile' ? t.mobileTitle : t.emailTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="text-center">
            <p className="text-gray-600">
              {type === 'mobile' ? t.mobileSubtitle : t.emailSubtitle}
            </p>
            <p className="font-semibold text-deep-plum mt-1">{contact}</p>
          </div>

          {/* OTP Input */}
          <div className="space-y-3">
            <Label htmlFor="otp-0" className="text-base font-medium">
              {t.otpLabel}
            </Label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-bold border-2 focus:border-accent-purple"
                  disabled={isVerifying || verificationStatus === 'success'}
                />
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {verificationStatus === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{t.success}</span>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">{t.error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={!isOtpComplete || isVerifying || verificationStatus === 'success'}
              className="w-full bg-deep-plum hover:bg-accent-purple"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t.verifying}
                </>
              ) : (
                t.verify
              )}
            </Button>

            {/* Resend Button */}
            <div className="text-center">
              {canResend ? (
                <Button
                  variant="outline"
                  onClick={handleResend}
                  className="text-accent-purple border-accent-purple hover:bg-accent-purple hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t.resendCode}
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  {t.resendTimer} {resendTimer} {t.seconds}
                </p>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isVerifying}
              className="text-gray-500 hover:text-gray-700"
            >
              {t.close}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Email Verification Modal Component
interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
  language?: 'en' | 'bn';
}

export function EmailVerificationModal({ 
  isOpen, 
  onClose, 
  email, 
  onSuccess,
  language = 'en' 
}: EmailModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const texts = {
    en: {
      title: 'Email Verification',
      subtitle: 'We will send a verification link to',
      sendLink: 'Send Verification Link',
      linkSent: 'Verification link sent!',
      checkEmail: 'Please check your email and click the verification link.',
      resendLink: 'Resend Link',
      success: 'Email verified successfully!',
      error: 'Failed to send verification link. Please try again.',
      close: 'Close',
      sending: 'Sending...'
    },
    bn: {
      title: 'ইমেইল যাচাইকরণ',
      subtitle: 'আমরা যাচাইকরণ লিংক পাঠাব',
      sendLink: 'যাচাইকরণ লিংক পাঠান',
      linkSent: 'যাচাইকরণ লিংক পাঠানো হয়েছে!',
      checkEmail: 'অনুগ্রহ করে আপনার ইমেইল চেক করুন এবং যাচাইকরণ লিংক�� ক্লিক করুন।',
      resendLink: 'লিংক পুনরায় পাঠান',
      success: 'ইমেইল সফলভাবে যাচাই করা হয়েছে!',
      error: 'যাচাইকরণ লিংক পাঠাতে ব্যর্থ। আবার চেষ্টা করুন।',
      close: 'বন্ধ করুন',
      sending: 'পাঠানো হচ্ছে...'
    }
  };

  const t = texts[language];

  const handleSendLink = async () => {
    setIsSending(true);
    setVerificationStatus('idle');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success (in real app, this would be based on API response)
    setLinkSent(true);
    setVerificationStatus('success');
    setIsSending(false);

    // Auto-close after success
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
            ✉️ {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600">{t.subtitle}</p>
            <p className="font-semibold text-deep-plum mt-1">{email}</p>
          </div>

          {verificationStatus === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <div className="text-center">
                <p className="font-medium">{t.linkSent}</p>
                <p className="text-sm mt-1">{t.checkEmail}</p>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">{t.error}</span>
            </div>
          )}

          <div className="space-y-3">
            {!linkSent ? (
              <Button
                onClick={handleSendLink}
                disabled={isSending}
                className="w-full bg-deep-plum hover:bg-accent-purple"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {t.sending}
                  </>
                ) : (
                  t.sendLink
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSendLink}
                variant="outline"
                className="w-full text-accent-purple border-accent-purple hover:bg-accent-purple hover:text-white"
              >
                {t.resendLink}
              </Button>
            )}

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isSending}
                className="text-gray-500 hover:text-gray-700"
              >
                {t.close}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
