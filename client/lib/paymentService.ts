// Payment Service for integrating with various payment providers

export interface PaymentConfig {
  amount: number;
  currency: string;
  applicationId: string;
  userId: string;
  userEmail: string;
  userPhone: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
  requiresPhone: boolean;
  requiresPin: boolean;
  testMode: boolean;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "bkash",
    name: "bKash",
    provider: "bKash Limited",
    icon: "💳",
    description: "Pay securely with your bKash account",
    requiresPhone: true,
    requiresPin: false, // We don\'t handle PIN for security
    testMode: true,
  },
  {
    id: "rocket",
    name: "Rocket",
    provider: "Dutch-Bangla Bank",
    icon: "🚀",
    description: "Pay securely with your Rocket account",
    requiresPhone: true,
    requiresPin: false, // We don\'t handle PIN for security
    testMode: true,
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    provider: "Visa/Mastercard",
    icon: "💳",
    description: "Pay with your credit or debit card",
    requiresPhone: false,
    requiresPin: false,
    testMode: true,
  },
  {
    id: "offline",
    name: "Bank Transfer/Cash",
    provider: "University Account",
    icon: "🏦",
    description: "Pay via bank transfer or cash deposit",
    requiresPhone: false,
    requiresPin: false,
    testMode: false,
  },
];

class PaymentService {
  private baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  // bKash Integration
  async initiateBkashPayment(
    config: PaymentConfig,
    mobileNumber: string,
  ): Promise<string> {
    try {
      // In production, this would call bKash's Create Payment API
      const paymentData = {
        mode: "0011", // Checkout
        payerReference: config.userId,
        callbackURL: `${window.location.origin}/payment/callback/bkash`,
        amount: config.amount.toString(),
        currency: config.currency,
        intent: "sale",
        merchantInvoiceNumber: `NU-${config.applicationId}-${Date.now()}`,
        merchantAssociationInfo: config.userEmail,
      };

      console.log("Initiating bKash payment:", paymentData);

      // For demo purposes, redirect to a mock bKash page
      const mockBkashUrl = this.generateMockBkashUrl(paymentData, mobileNumber);
      return mockBkashUrl;

      // In production, you would make an API call like:
      // const response = await fetch(`${this.baseUrl}/payments/bkash/create`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(paymentData)
      // });
      // const result = await response.json();
      // return result.bkashURL;
    } catch (error) {
      console.error("bKash payment initiation failed:", error);
      throw new Error("Failed to initiate bKash payment");
    }
  }

  // Rocket Integration
  async initiateRocketPayment(
    config: PaymentConfig,
    mobileNumber: string,
  ): Promise<string> {
    try {
      // In production, this would call Rocket's API
      const paymentData = {
        trxID: `NU-${config.applicationId}-${Date.now()}`,
        amount: config.amount.toString(),
        currency: config.currency,
        msisdn: mobileNumber,
        userID: config.userId,
        referenceID: config.applicationId,
        callBackURL: `${window.location.origin}/payment/callback/rocket`,
      };

      console.log("Initiating Rocket payment:", paymentData);

      // For demo purposes, redirect to a mock Rocket page
      const mockRocketUrl = this.generateMockRocketUrl(
        paymentData,
        mobileNumber,
      );
      return mockRocketUrl;
    } catch (error) {
      console.error("Rocket payment initiation failed:", error);
      throw new Error("Failed to initiate Rocket payment");
    }
  }

  // Card Payment Integration (SSLCommerz, Stripe, etc.)
  async initiateCardPayment(
    config: PaymentConfig,
    cardData: any,
  ): Promise<string> {
    try {
      // In production, integrate with SSLCommerz or similar gateway
      const paymentData = {
        total_amount: config.amount,
        currency: config.currency,
        tran_id: `NU-${config.applicationId}-${Date.now()}`,
        success_url: `${window.location.origin}/payment/success`,
        fail_url: `${window.location.origin}/payment/failed`,
        cancel_url: `${window.location.origin}/payment/cancelled`,
        cus_name: config.userId,
        cus_email: config.userEmail,
        cus_phone: config.userPhone,
        product_name: "University Admission Fee",
        product_category: "Education",
        product_profile: "general",
      };

      console.log("Initiating card payment:", paymentData);

      // Mock card payment URL
      const mockCardUrl = this.generateMockCardUrl(paymentData);
      return mockCardUrl;
    } catch (error) {
      console.error("Card payment initiation failed:", error);
      throw new Error("Failed to initiate card payment");
    }
  }

  // Generate mock URLs for testing
  private generateMockBkashUrl(paymentData: any, mobileNumber: string): string {
    const params = new URLSearchParams({
      amount: paymentData.amount,
      invoice: paymentData.merchantInvoiceNumber,
      mobile: mobileNumber,
      reference: paymentData.payerReference,
      callback: paymentData.callbackURL,
    });

    // In a real implementation, this would be bKash's actual checkout URL
    return `https://checkout.pay.bka.sh/v1.2.0-beta/checkout/payment/create?${params.toString()}`;
  }

  private generateMockRocketUrl(
    paymentData: any,
    mobileNumber: string,
  ): string {
    const params = new URLSearchParams({
      amount: paymentData.amount,
      trxID: paymentData.trxID,
      msisdn: mobileNumber,
      callback: paymentData.callBackURL,
    });

    // In a real implementation, this would be Rocket's actual payment URL
    return `https://rocket.com.bd/payment/create?${params.toString()}`;
  }

  private generateMockCardUrl(paymentData: any): string {
    const params = new URLSearchParams({
      amount: paymentData.total_amount.toString(),
      tran_id: paymentData.tran_id,
      success_url: paymentData.success_url,
      fail_url: paymentData.fail_url,
    });

    // In a real implementation, this would be SSLCommerz or similar gateway URL
    return `https://securepay.sslcommerz.com/gwprocess/v4/gw.php?${params.toString()}`;
  }

  // Validate mobile number for bKash/Rocket
  validateMobileNumber(number: string, provider: "bkash" | "rocket"): boolean {
    // Remove spaces and special characters
    const cleaned = number.replace(/[\s\-\(\)]/g, "");

    // Check if it's a valid Bangladesh mobile number
    const bdMobileRegex = /^(\+88)?01[3-9]\d{8}$/;

    if (!bdMobileRegex.test(cleaned)) {
      return false;
    }

    // Provider-specific validation
    if (provider === "bkash") {
      // bKash supports most operators
      return /^(\+88)?01[3-9]\d{8}$/.test(cleaned);
    } else if (provider === "rocket") {
      // Rocket is primarily DBBL, but supports others
      return /^(\+88)?01[3-9]\d{8}$/.test(cleaned);
    }

    return false;
  }

  // Format mobile number
  formatMobileNumber(number: string): string {
    const cleaned = number.replace(/[\s\-\(\)]/g, "");
    if (cleaned.startsWith("+88")) {
      return cleaned;
    } else if (cleaned.startsWith("88")) {
      return "+" + cleaned;
    } else if (cleaned.startsWith("01")) {
      return "+88" + cleaned;
    }
    return cleaned;
  }

  // Get payment status (for callbacks)
  async getPaymentStatus(
    transactionId: string,
    provider: string,
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, provider }),
      });

      return await response.json();
    } catch (error) {
      console.error("Failed to get payment status:", error);
      throw error;
    }
  }

  // Record payment attempt
  async recordPaymentAttempt(
    config: PaymentConfig,
    method: string,
    details: any,
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/payments/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: config.applicationId,
          userId: config.userId,
          paymentMethod: method,
          amount: config.amount,
          currency: config.currency,
          details,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to record payment attempt:", error);
      // Don't throw, as this is just logging
    }
  }
}

// Singleton instance
const paymentService = new PaymentService();

export default paymentService;

// Helper function to get payment method by ID
export const getPaymentMethod = (id: string): PaymentMethod | undefined => {
  return paymentMethods.find((method) => method.id === id);
};

// Constants for payment providers
export const PAYMENT_PROVIDERS = {
  BKASH: "bkash",
  ROCKET: "rocket",
  CARD: "card",
  OFFLINE: "offline",
} as const;

export type PaymentProvider =
  (typeof PAYMENT_PROVIDERS)[keyof typeof PAYMENT_PROVIDERS];
