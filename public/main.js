const output = document.getElementById('output');
const loginForm = document.getElementById('loginForm');
const links = document.getElementById('links');
const adminDashBtn = document.getElementById('adminDash');
const studentDashBtn = document.getElementById('studentDash');
const roomsBtn = document.getElementById('roomsBtn');
const complaintsBtn = document.getElementById('complaintsBtn');
const announcementsBtn = document.getElementById('announcementsBtn');
const paymentsBtn = document.getElementById('paymentsBtn');
const logoutBtn = document.getElementById('logoutBtn');

const api = (path, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(`/api${path}`, { ...options, headers }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || JSON.stringify(data));
    return data;
  });
};

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  output.textContent = 'Logging in...';
  try {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { token, user } = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    output.textContent = `Logged in as ${user.name} (${user.role})`;
    links.style.display = 'block';
  } catch (err) {
    output.textContent = `Login failed: ${err.message}`;
  }
});

adminDashBtn.addEventListener('click', async () => {
  try {
    const data = await api('/admin/dashboard');
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) { output.textContent = err.message; }
});

studentDashBtn.addEventListener('click', async () => {
  try {
    const data = await api('/student/dashboard');
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) { output.textContent = err.message; }
});

roomsBtn.addEventListener('click', async () => {
  try {
    const data = await api('/rooms');
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) { output.textContent = err.message; }
});

complaintsBtn.addEventListener('click', async () => {
  try {
    const data = await api('/complaints');
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) { output.textContent = err.message; }
});

announcementsBtn.addEventListener('click', async () => {
  try {
    const data = await api('/announcements');
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) { output.textContent = err.message; }
});

paymentsBtn.addEventListener('click', async () => {
  try {
    const data = await api('/payments');
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) { output.textContent = err.message; }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  links.style.display = 'none';
  output.textContent = 'Logged out';
});