export function getLoggedUserId(): number | null {
  const raw = localStorage.getItem('user_id');
  // console.log('raw user_id from localStorage:', raw);
  return raw ? parseInt(raw, 10) : null;
}