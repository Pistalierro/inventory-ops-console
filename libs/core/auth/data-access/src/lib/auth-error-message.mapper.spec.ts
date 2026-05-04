import { mapAuthErrorMessage } from './auth-error-message.mapper';

describe('mapAuthErrorMessage', () => {
  it('should map invalid credential errors', () => {
    expect(
      mapAuthErrorMessage({ code: 'auth/invalid-credential' }, 'signIn')
    ).toBe('Invalid email or password.');
  });

  it('should map auth codes from error messages', () => {
    expect(
      mapAuthErrorMessage(
        new Error('Firebase: Error (auth/invalid-credential).'),
        'signIn'
      )
    ).toBe('Invalid email or password.');
  });

  it('should map existing account errors', () => {
    expect(
      mapAuthErrorMessage({ code: 'auth/email-already-in-use' }, 'register')
    ).toBe('An account with this email already exists. Sign in instead.');
  });

  it('should return context fallback for unknown errors', () => {
    expect(mapAuthErrorMessage(new Error('Unknown'), 'passwordReset')).toBe(
      'Unable to send password reset email. Please try again.'
    );
  });
});
