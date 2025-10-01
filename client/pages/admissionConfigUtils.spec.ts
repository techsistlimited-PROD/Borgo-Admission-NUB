import { describe, it, expect } from 'vitest';
import { validateAdmissionSettings } from './admissionConfigUtils';

describe('validateAdmissionSettings', () => {
  it('returns no errors for valid settings', () => {
    const settings = {
      application_start_date: '2024-01-01T00:00:00',
      application_deadline: '2024-02-01T00:00:00',
      late_fee_deadline: '2024-03-01T00:00:00',
      default_referral_commission: 5,
    };
    const { errors } = validateAdmissionSettings(settings);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('flags start date after deadline', () => {
    const settings = {
      application_start_date: '2024-03-01T00:00:00',
      application_deadline: '2024-02-01T00:00:00',
    };
    const { errors } = validateAdmissionSettings(settings);
    expect(errors.application_start_date).toBeDefined();
  });

  it('flags deadline after late deadline', () => {
    const settings = {
      application_start_date: '2024-01-01T00:00:00',
      application_deadline: '2024-04-01T00:00:00',
      late_fee_deadline: '2024-03-01T00:00:00',
    };
    const { errors } = validateAdmissionSettings(settings);
    expect(errors.application_deadline).toBeDefined();
  });

  it('flags invalid referral commission', () => {
    const settings = {
      default_referral_commission: 150,
    };
    const { errors } = validateAdmissionSettings(settings);
    expect(errors.default_referral_commission).toBeDefined();
  });
});
