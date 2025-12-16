const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3400'

// Helper to get token (defined early so it can be used in getJSON)
function getToken(){
  return localStorage.getItem('token')
}

async function getJSON(path: string, requireAuth = false) {
  const headers: HeadersInit = {}
  if (requireAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  const res = await fetch(`${API_BASE}${path}`, { headers })
  if(!res.ok) {
    const errorText = await res.text()
    console.error(`API Error ${res.status} for ${path}:`, errorText)
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

async function postJSON(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
    body: JSON.stringify(body)
  })
  if(!res.ok) throw new Error('Network error')
  return res.json()
}

async function deleteJSON(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
  })
  if(!res.ok) throw new Error('Network error')
  return res.json()
}

export async function fetchProducts(requireAuth = false){
  return getJSON('/product', requireAuth)
}

export async function fetchBrands(){
  return getJSON('/brands')
}

export async function fetchAds(){
  return getJSON('/ads')
}

export async function createProduct(body: any){
  return postJSON('/product', body)
}

export async function createBrand(body: any){
  return postJSON('/brands', body)
}

export async function createAd(body: any){
  return postJSON('/ads', body)
}

export async function deleteProduct(id: string){
  return deleteJSON(`/product/${id}`)
}

export async function updateProduct(id: string, body: any){
  const res = await fetch(`${API_BASE}/product/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken() || ''}` },
    body: JSON.stringify(body)
  })
  if(!res.ok) throw new Error(`Network error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function approveProduct(id: string){
  if (!id) {
    throw new Error('Product ID is required')
  }
  const token = getToken()
  if (!token) {
    throw new Error('Authentication required')
  }
  const res = await fetch(`${API_BASE}/product/${id}/approve`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  if(!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || `Network error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function rejectProduct(id: string){
  if (!id) {
    throw new Error('Product ID is required')
  }
  const token = getToken()
  if (!token) {
    throw new Error('Authentication required')
  }
  const res = await fetch(`${API_BASE}/product/${id}/reject`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  if(!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || `Network error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function deleteBrand(id: string){
  return deleteJSON(`/brands/${id}`)
}

export async function deleteAd(id: string){
  return deleteJSON(`/ads/${id}`)
}

export async function fetchOrders(){
  return getJSON('/cart', true) // Requires authentication
}

export async function createOrder(body: any){
  return postJSON('/cart', body)
}

export async function chatMessage(message: string){
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  return res.json()
}

export async function signUp(email: string, password: string, name: string){
  const res = await fetch(`${API_BASE}/user/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  })
  if(!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Sign up failed')
  }
  return res.json()
}

export async function signIn(email: string, password: string){
  const res = await fetch(`${API_BASE}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if(!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Sign in failed')
  }
  const data = await res.json()
  // Store token in localStorage
  if(data.token) {
    localStorage.setItem('token', data.token)
    // Decode token to get user role
    const payload = JSON.parse(atob(data.token.split('.')[1]))
    localStorage.setItem('userRole', payload.role || 'client')
    localStorage.setItem('userId', payload.userID || '')
  }
  return data
}

export function signOut(){
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
}

// getToken is already defined above
export { getToken }

export function getUserRole(){
  return localStorage.getItem('userRole') || 'client'
}

export async function acceptOrder(id: string){
  if (!id) throw new Error("Order ID is missing for acceptance.");
  const res = await fetch(`${API_BASE}/cart/${id}/accept`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /cart/${id}/accept:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export async function rejectOrder(id: string){
  if (!id) throw new Error("Order ID is missing for rejection.");
  const res = await fetch(`${API_BASE}/cart/${id}/reject`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /cart/${id}/reject:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export async function acceptBrand(id: string){
  if (!id) throw new Error("Brand ID is missing for acceptance.");
  const res = await fetch(`${API_BASE}/brands/${id}/accept`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /brands/${id}/accept:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export async function rejectBrand(id: string){
  if (!id) throw new Error("Brand ID is missing for rejection.");
  const res = await fetch(`${API_BASE}/brands/${id}/reject`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /brands/${id}/reject:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export async function acceptAd(id: string){
  if (!id) throw new Error("Ad ID is missing for acceptance.");
  const res = await fetch(`${API_BASE}/ads/${id}/accept`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /ads/${id}/accept:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export async function rejectAd(id: string){
  if (!id) throw new Error("Ad ID is missing for rejection.");
  const res = await fetch(`${API_BASE}/ads/${id}/reject`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /ads/${id}/reject:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export async function fetchNotifications(unreadOnly = false){
  const res = await fetch(`${API_BASE}/notifications${unreadOnly ? '?unreadOnly=true' : ''}`, {
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /notifications:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export async function getUnreadNotificationCount(){
  const res = await fetch(`${API_BASE}/notifications/unread-count`, {
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /notifications/unread-count:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export async function markNotificationAsRead(id: string){
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /notifications/${id}/read:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export async function markAllNotificationsAsRead(){
  const res = await fetch(`${API_BASE}/notifications/all/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken() || ''}` }
  })
  if(!res.ok) {
    const errorText = await res.text();
    console.error(`API Error ${res.status} for /notifications/all/read:`, errorText);
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json()
}

export default { fetchProducts, fetchBrands, fetchAds, createProduct, createBrand, createAd, deleteProduct, deleteBrand, deleteAd, updateProduct, approveProduct, rejectProduct, fetchOrders, createOrder, acceptOrder, rejectOrder, acceptBrand, rejectBrand, acceptAd, rejectAd, fetchNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, chatMessage, signUp, signIn, signOut, getToken, getUserRole }
