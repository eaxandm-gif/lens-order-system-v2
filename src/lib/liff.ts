import liff from '@line/liff';

export type LineProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

export async function initializeLiff(): Promise<LineProfile> {
  const liffId = import.meta.env.VITE_LIFF_ID as string;
  if (!liffId) throw new Error('Missing VITE_LIFF_ID');

  await liff.init({ liffId });
  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: window.location.href });
    throw new Error('Redirecting to LINE Login');
  }
  return liff.getProfile();
}

export function getIdToken(): string {
  const token = liff.getIDToken();
  if (!token) throw new Error('LINE ID token unavailable');
  return token;
}
