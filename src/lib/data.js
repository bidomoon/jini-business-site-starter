import { supabase, supabaseEnabled } from './supabase'
import { demoSettings, demoProducts, demoCases, demoPosts } from '../data/demo'

const KEY = 'jini_business_starter_v1'
const readLocal = () => {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    const seed = { settings: demoSettings, products: demoProducts, cases: demoCases, posts: demoPosts, inquiries: [] }
    localStorage.setItem(KEY, JSON.stringify(seed))
    return seed
  }
  try { return JSON.parse(raw) } catch { return { settings: demoSettings, products: demoProducts, cases: demoCases, posts: demoPosts, inquiries: [] } }
}
const writeLocal = (data) => localStorage.setItem(KEY, JSON.stringify(data))

export async function getSettings(){
  if (!supabaseEnabled) return readLocal().settings
  const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
  return data || demoSettings
}
export async function saveSettings(payload){
  if (!supabaseEnabled) { const d=readLocal(); d.settings={...d.settings,...payload}; writeLocal(d); return d.settings }
  const { data, error } = await supabase.from('site_settings').upsert({ id: 1, ...payload }).select().single(); if(error) throw error; return data
}
export async function listProducts(){
  if (!supabaseEnabled) return readLocal().products
  const { data, error } = await supabase.from('products').select('*').order('created_at',{ascending:false}); if(error) throw error; return data
}
export async function saveProduct(item){
  if (!supabaseEnabled) { const d=readLocal(); const idx=d.products.findIndex(x=>x.id===item.id); const row={...item,id:item.id||crypto.randomUUID()}; if(idx>=0)d.products[idx]=row;else d.products.unshift(row); writeLocal(d); return row }
  const { data,error }=await supabase.from('products').upsert(item).select().single(); if(error) throw error; return data
}
export async function deleteProduct(id){
  if (!supabaseEnabled){const d=readLocal();d.products=d.products.filter(x=>x.id!==id);writeLocal(d);return}
  const {error}=await supabase.from('products').delete().eq('id',id); if(error) throw error
}
export async function listCases(){
  if (!supabaseEnabled) return readLocal().cases
  const { data,error }=await supabase.from('installation_cases').select('*').order('installed_at',{ascending:false}); if(error) throw error; return data
}
export async function getCase(id){ return (await listCases()).find(x=>String(x.id)===String(id)) }
export async function saveCase(item){
  if (!supabaseEnabled){const d=readLocal();const idx=d.cases.findIndex(x=>x.id===item.id);const row={...item,id:item.id||crypto.randomUUID()};if(idx>=0)d.cases[idx]=row;else d.cases.unshift(row);writeLocal(d);return row}
  const {data,error}=await supabase.from('installation_cases').upsert(item).select().single(); if(error) throw error; return data
}
export async function deleteCase(id){
  if (!supabaseEnabled){const d=readLocal();d.cases=d.cases.filter(x=>x.id!==id);writeLocal(d);return}
  const {error}=await supabase.from('installation_cases').delete().eq('id',id); if(error) throw error
}
export async function listPosts(){
  if (!supabaseEnabled) return readLocal().posts
  const {data,error}=await supabase.from('posts').select('*').order('created_at',{ascending:false});if(error)throw error;return data
}
export async function savePost(item){
  if(!supabaseEnabled){const d=readLocal();const idx=d.posts.findIndex(x=>x.id===item.id);const row={...item,id:item.id||crypto.randomUUID(),created_at:item.created_at||new Date().toISOString().slice(0,10)};if(idx>=0)d.posts[idx]=row;else d.posts.unshift(row);writeLocal(d);return row}
  const {data,error}=await supabase.from('posts').upsert(item).select().single();if(error)throw error;return data
}
export async function deletePost(id){
  if(!supabaseEnabled){const d=readLocal();d.posts=d.posts.filter(x=>x.id!==id);writeLocal(d);return}
  const {error}=await supabase.from('posts').delete().eq('id',id);if(error)throw error
}
export async function submitInquiry(payload){
  if(!supabaseEnabled){const d=readLocal();d.inquiries.unshift({id:crypto.randomUUID(),status:'new',created_at:new Date().toISOString(),...payload});writeLocal(d);return}
  const {error}=await supabase.from('inquiries').insert(payload);if(error)throw error
}
export async function listInquiries(){
  if(!supabaseEnabled)return readLocal().inquiries
  const {data,error}=await supabase.from('inquiries').select('*').order('created_at',{ascending:false});if(error)throw error;return data
}
export async function updateInquiryStatus(id,status){
  if(!supabaseEnabled){const d=readLocal();d.inquiries=d.inquiries.map(x=>x.id===id?{...x,status}:x);writeLocal(d);return}
  const {error}=await supabase.from('inquiries').update({status}).eq('id',id);if(error)throw error
}
export async function uploadImage(file, folder='general'){
  if(!file) return ''
  if(!supabaseEnabled){
    return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})
  }
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'-')
  const path=folder + '/' + Date.now() + '-' + safe
  const {error}=await supabase.storage.from('site-media').upload(path,file,{upsert:false,cacheControl:'3600'});if(error)throw error
  const {data}=supabase.storage.from('site-media').getPublicUrl(path)
  return data.publicUrl
}
