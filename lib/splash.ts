// Sự kiện + cờ session dùng chung giữa SplashScreen và mọi animation "chạy ngay khi vào web"
// (vd. Hero) để chúng biết khi nào splash đã chạy xong (hoặc đã từng chạy trong phiên này rồi).

export const SPLASH_COMPLETE_EVENT = "amp:splash-complete";

const SPLASH_SESSION_KEY = "amp-splash-shown";

export function hasSplashPlayed() {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
  } catch {
    // Safari private mode / storage bị chặn - coi như đã chạy để không chặn UI
    return true;
  }
}

export function markSplashPlayed() {
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    // ignore
  }
}
