import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, NavLink, useParams } from 'react-router-dom'
import {
  Phone, MessageCircle, Menu, X, CheckCircle2, Monitor, Utensils,
  BarChart3, Headphones, Wrench, ArrowRight, ShieldCheck, MapPin,
  Search, LogIn, LayoutDashboard, Package, Images, FileText, Inbox,
  Settings, LogOut, Plus, Trash2, Upload, Save, ExternalLink
} from 'lucide-react'
import {
  getSettings, saveSettings, listProducts, saveProduct, deleteProduct,
  listCases, getCase, saveCase, deleteCase, listPosts, savePost,
  deletePost, submitInquiry, listInquiries, updateInquiryStatus, uploadImage
} from './lib/data'
import { supabase, supabaseEnabled } from './lib/supabase'

function useSeo(title, description='스마트포스 POS 및 식수관리 솔루션') {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [title, description])
}

function Brand({ settings }) {
  return <Link to="/" className="brand">
    <div className="brand-mark">S</div>
    <div><strong>{settings.company_name}</strong><span>{settings.tagline}</span></div>
  </Link>
}

function SiteShell({ children, settings }) {
  const [open, setOpen] = useState(false)
  const nav = [
    ['/', '홈'], ['/products', '제품소개'], ['/cases', '설치사례'],
    ['/news', '소식'], ['/support', '고객지원'], ['/contact', '견적문의']
  ]
  return <div className="site-shell">
    <header className="header">
      <div className="container header-inner">
        <Brand settings={settings} />
        <nav className="desktop-nav">
          {nav.map(([path, name]) => <NavLink key={path} to={path} className={({isActive}) => isActive ? 'active' : ''}>{name}</NavLink>)}
        </nav>
        <div className="header-cta">
          <a href={'tel:' + settings.phone} className="phone-link"><Phone size={18}/><b>{settings.phone}</b></a>
          <Link to="/contact" className="btn btn-accent">상담 신청</Link>
        </div>
        <button className="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <div className="mobile-nav">{nav.map(([path, name]) => <Link key={path} to={path} onClick={() => setOpen(false)}>{name}</Link>)}</div>}
    </header>
    {children}
    <footer className="footer">
      <div className="container footer-grid">
        <div><Brand settings={settings}/><p>POS · 식수관리 · 설치 · 운영지원</p></div>
        <div><b>대표번호</b><p>{settings.phone}</p><p>{settings.address}</p></div>
        <div><b>바로가기</b><p><Link to="/cases">설치사례</Link> · <Link to="/contact">견적문의</Link></p><p><Link to="/admin">관리자</Link></p></div>
      </div>
      <div className="container copyright">© 2026 {settings.company_name}. All rights reserved.</div>
    </footer>
    <div className="floating">
      <a href={'tel:' + settings.phone}><Phone size={18}/> 전화</a>
      <Link to="/contact"><MessageCircle size={18}/> 문의</Link>
    </div>
  </div>
}

function PageHero({ title, sub }) {
  return <section className="page-hero"><div className="container"><span>SMARTPOS</span><h1>{title}</h1><p>{sub}</p></div></section>
}

function ContactStrip({ settings }) {
  return <section className="contact-strip">
    <div className="container contact-strip-inner">
      <div><span>CONTACT US</span><h2>설치·제품 상담이 필요하신가요?</h2><p>현장에 맞는 구성을 빠르게 안내드립니다.</p></div>
      <div className="strip-actions">
        <a href={'tel:' + settings.phone} className="big-phone"><Phone/> {settings.phone}</a>
        <Link to="/contact" className="btn btn-accent">온라인 문의하기</Link>
      </div>
    </div>
  </section>
}

function Home({ settings }) {
  useSeo(settings.company_name + ' | 현장에 딱 맞는 POS 솔루션', settings.hero_subtitle)
  const [cases, setCases] = useState([])
  const [products, setProducts] = useState([])
  useEffect(() => { listCases().then(setCases); listProducts().then(setProducts) }, [])
  const features = [
    ['POS 판매 관리', Monitor, '빠르고 편리한 주문·판매 관리'],
    ['식수/함바 관리', Utensils, '구내식당·현장식당 식수 집계'],
    ['매출·정산', BarChart3, '일별·월별 매출과 정산 확인'],
    ['원격 지원', Headphones, '문제 발생 시 신속한 원격지원'],
    ['설치 및 교육', Wrench, '방문 설치와 사용법 교육']
  ]
  return <>
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">SMART POS SOLUTION</div>
          <h1>현장에 딱 맞는<br/><span>스마트 POS 솔루션</span></h1>
          <p>{settings.hero_subtitle}</p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary">상담 신청하기 <ArrowRight size={18}/></Link>
            <Link to="/cases" className="btn btn-light">설치사례 보기</Link>
          </div>
          <div className="trust-row">
            <span><ShieldCheck/> 안정적 운영</span><span><Wrench/> 방문 설치</span><span><Headphones/> 사후지원</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="device-wrap">
            <div className="pos-screen">
              <div className="screen-top">SMART POS</div>
              <div className="screen-grid"><span>메뉴 01</span><span>메뉴 02</span><span>메뉴 03</span><span>메뉴 04</span></div>
              <div className="screen-total">합계 12,000원</div>
            </div>
            <div className="printer">RECEIPT</div>
          </div>
          <div className="hero-badge">설치부터 교육까지<br/><b>한 번에</b></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-head"><div><span>SMARTPOS FUNCTION</span><h2>운영에 필요한 핵심 기능</h2></div><Link to="/products">제품 자세히 보기 →</Link></div>
        <div className="feature-grid">
          {features.map(([title, Icon, desc]) => <div className="feature-card" key={title}><Icon/><h3>{title}</h3><p>{desc}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section soft">
      <div className="container">
        <div className="section-head"><div><span>PRODUCT</span><h2>주요 제품 및 솔루션</h2></div><Link to="/products">전체 제품 →</Link></div>
        <div className="card-grid three">
          {products.slice(0,3).map(p => <article className="image-card" key={p.id}><img src={p.image_url} alt={p.name}/><div><small>{p.category}</small><h3>{p.name}</h3><p>{p.summary}</p></div></article>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-head"><div><span>INSTALLATION CASE</span><h2>실제 설치사례로 확인하세요</h2></div><Link to="/cases">더 많은 설치사례 →</Link></div>
        <div className="card-grid four">
          {cases.slice(0,4).map(c => <Link className="case-card" to={'/cases/' + c.id} key={c.id}><img src={c.cover_url} alt={c.title}/><div><small>{c.region} · {c.industry}</small><h3>{c.title}</h3><p>{c.description}</p></div></Link>)}
        </div>
      </div>
    </section>

    <section className="process">
      <div className="container">
        <div className="section-head light-head"><div><span>OUR PROCESS</span><h2>간단한 절차로 시작하세요</h2></div></div>
        <div className="process-grid">
          {[
            ['01','상담','운영 환경과 필요한 기능을 확인합니다.'],
            ['02','현장 확인','설치 환경과 장비 구성을 점검합니다.'],
            ['03','설치','현장에 맞춰 장비와 프로그램을 설치합니다.'],
            ['04','교육·지원','사용법 안내와 운영지원을 제공합니다.']
          ].map(x => <div key={x[0]}><b>{x[0]}</b><h3>{x[1]}</h3><p>{x[2]}</p></div>)}
        </div>
      </div>
    </section>
    <ContactStrip settings={settings}/>
  </>
}

function Products() {
  useSeo('제품소개 | 스마트포스')
  const [items, setItems] = useState([])
  useEffect(() => { listProducts().then(setItems) }, [])
  return <><PageHero title="제품소개" sub="현장에 맞는 POS와 운영 솔루션을 구성합니다."/><main className="section"><div className="container"><div className="card-grid three">
    {items.map(p => <article className="image-card large" key={p.id}><img src={p.image_url} alt={p.name}/><div><small>{p.category}</small><h2>{p.name}</h2><p>{p.summary}</p><Link to="/contact" className="text-link">설치 상담하기 →</Link></div></article>)}
  </div></div></main></>
}

function Cases() {
  useSeo('설치사례 | 스마트포스')
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  useEffect(() => { listCases().then(setItems) }, [])
  const filtered = items.filter(x => (x.title + x.region + x.industry).toLowerCase().includes(q.toLowerCase()))
  return <><PageHero title="설치사례" sub="업종과 현장에 맞춘 실제 설치 사례를 확인하세요."/><main className="section"><div className="container">
    <div className="searchbox"><Search/><input value={q} onChange={e => setQ(e.target.value)} placeholder="지역·업종·설치사례 검색"/></div>
    <div className="card-grid three">{filtered.map(c => <Link className="case-card" to={'/cases/' + c.id} key={c.id}><img src={c.cover_url} alt={c.title}/><div><small>{c.region} · {c.industry}</small><h3>{c.title}</h3><p>{c.description}</p></div></Link>)}</div>
  </div></main></>
}

function CaseDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  useEffect(() => { getCase(id).then(setItem) }, [id])
  useSeo(item ? item.title + ' | 설치사례' : '설치사례')
  if (!item) return <main className="section"><div className="container">불러오는 중...</div></main>
  return <main><PageHero title={item.title} sub={item.region + ' · ' + item.industry + ' · ' + (item.installed_at || '')}/><section className="section"><div className="container detail-grid">
    <img className="detail-image" src={item.cover_url} alt={item.title}/>
    <div><div className="eyebrow">INSTALLATION CASE</div><h2>{item.title}</h2><p className="lead">{item.description}</p>
      <div className="specs"><span><MapPin/> 지역 <b>{item.region}</b></span><span><Utensils/> 업종 <b>{item.industry}</b></span><span><CheckCircle2/> 상태 <b>설치완료</b></span></div>
      <Link to="/contact" className="btn btn-primary">비슷한 구성 상담하기</Link>
    </div>
  </div></section></main>
}

function News() {
  useSeo('소식 | 스마트포스')
  const [posts, setPosts] = useState([])
  useEffect(() => { listPosts().then(setPosts) }, [])
  return <><PageHero title="소식·공지" sub="신규 설치와 제품, 운영 관련 소식을 안내합니다."/><main className="section"><div className="container news-list">
    {posts.map(p => <article key={p.id}><small>{String(p.created_at).slice(0,10)}</small><h3>{p.title}</h3><p>{p.excerpt}</p></article>)}
  </div></main></>
}

function Support() {
  useSeo('고객지원 | 스마트포스')
  const faqs = [
    ['설치까지 얼마나 걸리나요?', '상담 후 현장 환경과 장비 구성에 따라 일정을 안내드립니다.'],
    ['기존 POS 교체도 가능한가요?', '가능합니다. 현재 사용 장비와 데이터 이전 필요 여부를 확인해 안내합니다.'],
    ['식수관리만 별도로 상담할 수 있나요?', '가능합니다. 현장 인원과 정산 방식에 맞춰 구성합니다.'],
    ['A/S는 어떻게 접수하나요?', '대표전화 또는 홈페이지 문의를 통해 접수할 수 있습니다.']
  ]
  return <><PageHero title="고객지원" sub="설치 전 상담부터 운영 중 지원까지 함께합니다."/><main className="section"><div className="container"><div className="faq-grid">
    {faqs.map(x => <div key={x[0]}><h3>{x[0]}</h3><p>{x[1]}</p></div>)}
  </div></div></main></>
}

function Contact({ settings }) {
  useSeo('견적문의 | 스마트포스')
  const empty = {company:'', name:'', phone:'', region:'', business_type:'', message:''}
  const [form, setForm] = useState(empty)
  const [done, setDone] = useState(false)
  const submit = async e => {
    e.preventDefault()
    await submitInquiry(form)
    setForm(empty)
    setDone(true)
  }
  return <><PageHero title="견적·설치 문의" sub="운영환경을 알려주시면 맞는 구성을 안내드립니다."/><main className="section"><div className="container contact-grid">
    <div><span className="eyebrow">CONTACT</span><h2>빠르게 상담받아보세요.</h2><p>제품, 설치, 식수관리, 기존 장비 교체 등 필요한 내용을 남겨주세요.</p>
      <div className="contact-info"><a href={'tel:' + settings.phone}><Phone/> <b>{settings.phone}</b></a><span><MapPin/> {settings.address}</span></div>
    </div>
    <form className="form-card" onSubmit={submit}>
      <div className="form-row"><input required placeholder="회사/매장명" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/><input placeholder="담당자" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
      <div className="form-row"><input required placeholder="연락처" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><input placeholder="지역" value={form.region} onChange={e=>setForm({...form,region:e.target.value})}/></div>
      <input placeholder="업종" value={form.business_type} onChange={e=>setForm({...form,business_type:e.target.value})}/>
      <textarea required placeholder="문의 내용" rows="6" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
      <button className="btn btn-primary wide">상담 신청하기</button>
      {done && <p className="success">문의가 저장되었습니다.</p>}
    </form>
  </div></main></>
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('admin@demo.com')
  const [pw, setPw] = useState('demo1234')
  const [err, setErr] = useState('')
  const submit = async e => {
    e.preventDefault()
    setErr('')
    if (!supabaseEnabled) {
      if (pw === 'demo1234') { localStorage.setItem('jini_admin_demo','1'); onLogin() }
      else setErr('데모 비밀번호는 demo1234 입니다.')
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) setErr(error.message); else onLogin()
  }
  return <div className="admin-login"><form onSubmit={submit}>
    <div className="brand admin-brand"><div className="brand-mark">S</div><div><strong>SMARTPOS ADMIN</strong><span>관리자센터</span></div></div>
    <h1>관리자 로그인</h1><p>제품·설치사례·소식·문의를 관리합니다.</p>
    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일"/>
    <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="비밀번호"/>
    <button className="btn btn-primary wide"><LogIn size={18}/> 로그인</button>
    {!supabaseEnabled && <small>현재 데모모드 · 비밀번호 demo1234</small>}
    {err && <p className="error">{err}</p>}
    <Link to="/">← 홈페이지로</Link>
  </form></div>
}

function AdminLayout({ children, onLogout }) {
  const items = [
    ['/admin', LayoutDashboard, '대시보드'], ['/admin/products', Package, '제품관리'],
    ['/admin/cases', Images, '설치사례'], ['/admin/posts', FileText, '소식/공지'],
    ['/admin/inquiries', Inbox, '문의관리'], ['/admin/settings', Settings, '기본정보']
  ]
  return <div className="admin-shell">
    <aside>
      <div className="admin-logo">SMARTPOS <span>ADMIN</span></div>
      {items.map(([path, Icon, name]) => <NavLink end={path === '/admin'} key={path} to={path}><Icon size={19}/>{name}</NavLink>)}
      <button onClick={onLogout}><LogOut size={19}/>로그아웃</button>
      <Link to="/" target="_blank"><ExternalLink size={19}/>사이트 보기</Link>
    </aside>
    <main className="admin-main">{children}</main>
  </div>
}

function Admin({ settings, setSettings }) {
  const [auth, setAuth] = useState(null)
  useEffect(() => {
    if (!supabaseEnabled) { setAuth(localStorage.getItem('jini_admin_demo') === '1'); return }
    supabase.auth.getSession().then(({data}) => setAuth(Boolean(data.session)))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setAuth(Boolean(session)))
    return () => data.subscription.unsubscribe()
  }, [])
  if (auth === null) return null
  if (!auth) return <AdminLogin onLogin={() => setAuth(true)}/>
  const logout = async () => {
    if (supabaseEnabled) await supabase.auth.signOut()
    localStorage.removeItem('jini_admin_demo')
    setAuth(false)
  }
  return <AdminLayout onLogout={logout}>
    <Routes>
      <Route index element={<AdminDashboard/>}/>
      <Route path="products" element={<AdminProducts/>}/>
      <Route path="cases" element={<AdminCases/>}/>
      <Route path="posts" element={<AdminPosts/>}/>
      <Route path="inquiries" element={<AdminInquiries/>}/>
      <Route path="settings" element={<AdminSettings settings={settings} setSettings={setSettings}/>}/>
    </Routes>
  </AdminLayout>
}

function AdminPage({ title, sub, children }) {
  return <div><div className="admin-head"><h1>{title}</h1><p>{sub}</p></div>{children}</div>
}

function EditorForm({ children, onSubmit }) {
  return <form className="editor-form" onSubmit={onSubmit}><div className="editor-title"><Plus size={18}/> 등록 / 수정</div>{children}</form>
}

function ImageInput({ file, setFile }) {
  return <label className="upload-box"><Upload/><div><b>{file ? file.name : '사진 업로드'}</b><span>실제 납품 시 Supabase Storage에 저장</span></div><input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)}/></label>
}

function AdminRow({ image, title, sub, onEdit, onDelete }) {
  return <div className="admin-row">
    {image ? <img src={image} alt=""/> : <div className="noimg">NO IMAGE</div>}
    <div className="grow"><b>{title}</b><p>{sub}</p></div>
    <button type="button" onClick={onEdit}>수정</button>
    <button type="button" className="danger" onClick={onDelete}><Trash2 size={16}/></button>
  </div>
}

function AdminDashboard() {
  const [stats, setStats] = useState({products:0,cases:0,posts:0,inquiries:0})
  useEffect(() => { Promise.all([listProducts(),listCases(),listPosts(),listInquiries()]).then(([a,b,c,d]) => setStats({products:a.length,cases:b.length,posts:c.length,inquiries:d.length})) }, [])
  const cards = [['제품',stats.products,Package],['설치사례',stats.cases,Images],['소식',stats.posts,FileText],['문의',stats.inquiries,Inbox]]
  return <AdminPage title="대시보드" sub="사이트 운영 현황을 한눈에 확인합니다.">
    <div className="stats-grid">{cards.map(([name,value,Icon]) => <div className="stat" key={name}><Icon/><span>{name}</span><b>{value}</b></div>)}</div>
    <div className="admin-note"><h3>복제 가능한 사업자 홈페이지 템플릿</h3><p>현재는 데모 저장 모드입니다. Supabase를 연결하면 관리자 로그인, DB, 문의와 사진이 서버에 저장됩니다.</p></div>
  </AdminPage>
}

function AdminProducts() {
  const empty = {name:'',category:'POS',summary:'',image_url:'',status:'published'}
  const [items,setItems]=useState([]), [form,setForm]=useState(empty), [file,setFile]=useState(null)
  const refresh=()=>listProducts().then(setItems)
  useEffect(refresh,[])
  const save=async e=>{e.preventDefault();let image_url=form.image_url;if(file)image_url=await uploadImage(file,'products');await saveProduct({...form,image_url});setForm(empty);setFile(null);refresh()}
  return <AdminPage title="제품관리" sub="제품과 솔루션을 등록·수정합니다.">
    <EditorForm onSubmit={save}><input required placeholder="제품명" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="카테고리" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/><textarea placeholder="제품 설명" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})}/><ImageInput file={file} setFile={setFile}/><button className="btn btn-primary"><Save size={17}/> 저장</button></EditorForm>
    <div className="admin-list">{items.map(x=><AdminRow key={x.id} image={x.image_url} title={x.name} sub={x.category + ' · ' + x.summary} onEdit={()=>setForm(x)} onDelete={async()=>{if(confirm('삭제할까요?')){await deleteProduct(x.id);refresh()}}}/>)}</div>
  </AdminPage>
}

function AdminCases() {
  const empty={title:'',region:'',industry:'',description:'',cover_url:'',installed_at:new Date().toISOString().slice(0,10),status:'published'}
  const [items,setItems]=useState([]), [form,setForm]=useState(empty), [file,setFile]=useState(null)
  const refresh=()=>listCases().then(setItems)
  useEffect(refresh,[])
  const save=async e=>{e.preventDefault();let cover_url=form.cover_url;if(file)cover_url=await uploadImage(file,'cases');await saveCase({...form,cover_url});setForm(empty);setFile(null);refresh()}
  return <AdminPage title="설치사례" sub="사진과 설치 내용을 올리면 홈페이지에 바로 반영됩니다.">
    <EditorForm onSubmit={save}><input required placeholder="설치사례 제목" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><div className="form-row"><input placeholder="지역" value={form.region} onChange={e=>setForm({...form,region:e.target.value})}/><input placeholder="업종" value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})}/></div><input type="date" value={form.installed_at||''} onChange={e=>setForm({...form,installed_at:e.target.value})}/><textarea required placeholder="설치 내용" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><ImageInput file={file} setFile={setFile}/><button className="btn btn-primary"><Save size={17}/> 저장</button></EditorForm>
    <div className="admin-list">{items.map(x=><AdminRow key={x.id} image={x.cover_url} title={x.title} sub={x.region + ' · ' + x.industry + ' · ' + (x.installed_at||'')} onEdit={()=>setForm(x)} onDelete={async()=>{if(confirm('삭제할까요?')){await deleteCase(x.id);refresh()}}}/>)}</div>
  </AdminPage>
}

function AdminPosts() {
  const empty={title:'',excerpt:'',status:'published'}
  const [items,setItems]=useState([]), [form,setForm]=useState(empty)
  const refresh=()=>listPosts().then(setItems)
  useEffect(refresh,[])
  const save=async e=>{e.preventDefault();await savePost(form);setForm(empty);refresh()}
  return <AdminPage title="소식/공지" sub="간단한 소식과 공지를 직접 등록합니다.">
    <EditorForm onSubmit={save}><input required placeholder="제목" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><textarea required placeholder="내용" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})}/><button className="btn btn-primary"><Save size={17}/> 저장</button></EditorForm>
    <div className="admin-list">{items.map(x=><AdminRow key={x.id} title={x.title} sub={x.excerpt} onEdit={()=>setForm(x)} onDelete={async()=>{if(confirm('삭제할까요?')){await deletePost(x.id);refresh()}}}/>)}</div>
  </AdminPage>
}

function AdminInquiries() {
  const [items,setItems]=useState([])
  const refresh=()=>listInquiries().then(setItems)
  useEffect(refresh,[])
  return <AdminPage title="문의관리" sub="홈페이지로 들어온 상담 문의를 확인합니다.">
    <div className="inquiry-table">
      <div className="tr head"><span>업체</span><span>연락처</span><span>지역/업종</span><span>문의내용</span><span>상태</span></div>
      {items.length===0 ? <div className="empty">아직 접수된 문의가 없습니다.</div> : items.map(x=><div className="tr" key={x.id}>
        <span><b>{x.company}</b><small>{x.name}</small></span><span>{x.phone}</span><span>{x.region}<small>{x.business_type}</small></span><span>{x.message}</span>
        <span><select value={x.status||'new'} onChange={async e=>{await updateInquiryStatus(x.id,e.target.value);refresh()}}><option value="new">신규</option><option value="consulting">상담중</option><option value="quoted">견적발송</option><option value="scheduled">설치예정</option><option value="done">설치완료</option></select></span>
      </div>)}
    </div>
  </AdminPage>
}

function AdminSettings({ settings, setSettings }) {
  const [form,setForm]=useState(settings)
  useEffect(()=>setForm(settings),[settings])
  const save=async e=>{e.preventDefault();const value=await saveSettings(form);setSettings(value);alert('저장되었습니다.')}
  return <AdminPage title="기본정보" sub="다른 업체로 복제할 때 이 정보만 바꾸면 됩니다.">
    <EditorForm onSubmit={save}>
      <div className="form-row"><input value={form.company_name||''} onChange={e=>setForm({...form,company_name:e.target.value})} placeholder="회사명"/><input value={form.tagline||''} onChange={e=>setForm({...form,tagline:e.target.value})} placeholder="슬로건"/></div>
      <div className="form-row"><input value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="대표전화"/><input value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})} placeholder="주소"/></div>
      <textarea value={form.hero_subtitle||''} onChange={e=>setForm({...form,hero_subtitle:e.target.value})} placeholder="메인 설명"/>
      <button className="btn btn-primary"><Save size={17}/> 저장</button>
    </EditorForm>
  </AdminPage>
}

export default function App() {
  const [settings, setSettings] = useState({
    company_name:'스마트포스', tagline:'현장을 더 스마트하게',
    phone:'1670-1234', address:'경기도 수원시',
    hero_subtitle:'POS · 식수관리 · 정산 · 설치 · 교육 · 사후지원까지 한 번에'
  })
  useEffect(() => { getSettings().then(setSettings) }, [])
  return <Routes>
    <Route path="/admin/*" element={<Admin settings={settings} setSettings={setSettings}/>}/>
    <Route path="*" element={<SiteShell settings={settings}><Routes>
      <Route path="/" element={<Home settings={settings}/>}/>
      <Route path="/products" element={<Products/>}/>
      <Route path="/cases" element={<Cases/>}/>
      <Route path="/cases/:id" element={<CaseDetail/>}/>
      <Route path="/news" element={<News/>}/>
      <Route path="/support" element={<Support/>}/>
      <Route path="/contact" element={<Contact settings={settings}/>}/>
    </Routes></SiteShell>}/>
  </Routes>
}
