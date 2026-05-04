export type AuthErrorContext = 'signIn' | 'register' | 'passwordReset';

export function mapAuthErrorMessage(
  error: unknown,
  context: AuthErrorContext
): string {
  const code = getErrorCode(error);

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Sign in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must contain at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact an administrator.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    default:
      return getFallbackMessage(context);
  }
}

function getErrorCode(error: unknown): string | null {
  if (typeof error === 'string') {
    return parseAuthCode(error);
  }

  if (!error || typeof error !== 'object') {
    return null;
  }

  if ('code' in error) {
    const code = (error as { code: unknown }).code;

    if (typeof code === 'string') {
      return code;
    }
  }

  if ('message' in error) {
    const message = (error as { message: unknown }).message;

    if (typeof message === 'string') {
      return parseAuthCode(message);
    }
  }

  return null;
}

function parseAuthCode(value: string): string | null {
  const match = value.match(/auth\/[a-z0-9-]+/);

  return match ? match[0] : null;
}

function getFallbackMessage(context: AuthErrorContext): string {
  if (context === 'register') {
    return 'Unable to create account. Please try again.';
  }

  if (context === 'passwordReset') {
    return 'Unable to send password reset email. Please try again.';
  }

  return 'Unable to sign in. Please check your credentials.';
}
