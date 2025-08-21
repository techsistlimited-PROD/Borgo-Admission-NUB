import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, CheckCircle, CreditCard, Phone } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { useToast } from "../hooks/use-toast";

interface BkashPaymentProps {
  amount: number;
  purpose: string;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentCancel: () => void;
}

export default function BkashPayment({
  amount,
  purpose,
  onPaymentSuccess,
  onPaymentCancel,
}: BkashPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [step, setStep] = useState<"phone" | "payment" | "verification">(
    "phone",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePhoneSubmit = () => {
    if (!phoneNumber || phoneNumber.length !== 11) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 11-digit bKash number",
        variant: "destructive",
      });
      return;
    }
    setStep("payment");
  };

  const handlePaymentInitiate = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    try {
      // In real implementation, this would call bKash API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful payment initiation
      setStep("verification");
      toast({
        title: "Payment Initiated",
        description: "Please complete the payment on your bKash app",
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!transactionId || transactionId.length < 8) {
      toast({
        title: "Invalid Transaction ID",
        description: "Please enter a valid transaction ID",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment verification
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate successful verification
      toast({
        title: "Payment Verified",
        description: "Your payment has been successfully verified!",
      });

      onPaymentSuccess(transactionId);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify payment. Please check transaction ID.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="bg-pink-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          bKash Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Amount to Pay:</span>
            <span className="text-2xl font-bold text-pink-600">৳{amount}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{purpose}</p>
        </div>

        {step === "phone" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bkash-phone">
                <Phone className="w-4 h-4 inline mr-2" />
                bKash Account Number
              </Label>
              <Input
                id="bkash-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 11))
                }
                placeholder="01XXXXXXXXX"
                maxLength={11}
              />
              <p className="text-xs text-gray-500">
                Enter your 11-digit bKash account number
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onPaymentCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePhoneSubmit}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
                disabled={phoneNumber.length !== 11}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                You will be redirected to bKash app to complete the payment of ৳
                {amount}
              </AlertDescription>
            </Alert>

            <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
              <p className="text-sm font-medium text-pink-800 mb-2">
                Payment Details:
              </p>
              <div className="text-sm text-pink-700 space-y-1">
                <p>• Amount: ৳{amount}</p>
                <p>• Phone: {phoneNumber}</p>
                <p>• Purpose: {purpose}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep("phone")}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handlePaymentInitiate}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </div>
        )}

        {step === "verification" && (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Payment initiated successfully! Please complete it on your bKash
                app.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="transaction-id">Transaction ID</Label>
              <Input
                id="transaction-id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID from bKash"
              />
              <p className="text-xs text-gray-500">
                You'll receive the transaction ID after completing payment
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onPaymentCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerifyPayment}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isProcessing || !transactionId}
              >
                {isProcessing ? "Verifying..." : "Verify Payment"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
