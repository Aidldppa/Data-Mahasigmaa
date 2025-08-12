// Redirect ke login jika belum login (kecuali di login/register)
const AUTH_KEY = 'isLoggedIn_v1';
const isLoginPage = location.pathname.endsWith('login.html');
const isRegisterPage = location.pathname.endsWith('register.html');
if (!isLoginPage && !isRegisterPage) {
  const auth = localStorage.getItem(AUTH_KEY);
  // Jika belum login sebagai customer ATAU admin, redirect ke login
  if (!auth || (auth !== 'admin' && !auth.startsWith('customer:'))) {
    window.location.href = 'login.html';
  }
}
