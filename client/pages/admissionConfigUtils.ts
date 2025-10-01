export function validateAdmissionSettings(settings: any) {
  const errors: Record<string, string> = {};

  if (!settings) return { errors };

  const start = settings.application_start_date ? new Date(settings.application_start_date) : null;
  const deadline = settings.application_deadline ? new Date(settings.application_deadline) : null;
  const lateDeadline = settings.late_fee_deadline ? new Date(settings.late_fee_deadline) : null;

  if (start && deadline && start > deadline) {
    errors.application_start_date = "Application start date must be before the application deadline.";
  }
  if (deadline && lateDeadline && deadline > lateDeadline) {
    errors.application_deadline = "Application deadline must be before the late fee deadline.";
  }

  if (settings.default_referral_commission != null) {
    const v = Number(settings.default_referral_commission);
    if (isNaN(v) || v < 0 || v > 100) {
      errors.default_referral_commission = "Default referral commission must be between 0 and 100.";
    }
  }

  return { errors };
}
