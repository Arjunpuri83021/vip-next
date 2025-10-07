"use client";
import { useEffect, useState } from "react";
import Protected from "../Protected";
import AdminNavbar from "../components/AdminNavbar";
import "../AdminStyles.css";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatViews=(v)=>!v||v<1e3? (v||0) : v>=1e6? (v/1e6).toFixed(1).replace('.0','')+'M' : (v/1e3).toFixed(1).replace('.0','')+'k';

export default function AdminPostsPage(){
  const [suggestedTags,setSuggestedTags]=useState([]);
  const [suggestedStars,setSuggestedStars]=useState([]);
  const [imageUrl,setImgUrl]=useState('');
  const [altKeywords,setAltKeywords]=useState('');
  const [nameInput,setNameInput]=useState('');
  const [name,setname]=useState([]);
  const [tagInput,setTagInput]=useState('');
  const [tags,setTags]=useState([]);
  const [link,setLink]=useState('');
  const [iframeUrl,setIframeUrl]=useState('');
  const [titel,settitel]=useState('');
  const [minutes,setMinutes]=useState('');
  const [Category,setCategory]=useState('english');
  const [showSuggestions,setShowSuggestions]=useState(false);
  const [showStarSuggestions,setShowStarSuggestions]=useState(false);
  const [postdata,setData]=useState([]);
  const [postId,setPostId]=useState('');
  const [isUpdateMode,setIsUpdateMode]=useState(false);
  const [showModal,setShowModal]=useState(false);
  const [currentPage,setCurrentPage]=useState(1);
  const [totalPages,setTotalPages]=useState(0);
  const [searchQuery,setSearchQuery]=useState("");
  const itemsPerPage=16;

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const formData={ imageUrl, altKeywords, name, tags, link, iframeUrl, titel, minutes, Category };
    if(isUpdateMode){ setData(prev=>prev.map(it=> it._id===postId?{...it,...formData}:it)); }
    else { setData(prev=>[{ _id: String(Date.now()), ...formData },...prev]); setCurrentPage(1);} 
    closeModal(); resetForm();
    const url=isUpdateMode? `${apiUrl}/updatepost/${postId}`: `${apiUrl}/postdata`;
    const method=isUpdateMode? 'PUT':'POST';
    try{ const res=await fetch(url,{method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(formData)});
      if(!res.ok) return; const data=await res.json(); if(!isUpdateMode){ fetchSuggestedTags(); fetchSuggestedStars(); }
    }catch(err){ console.warn('Background sync error:', err.message); }
  };

  const closeModal=()=>{ setShowModal(false); resetForm(); };

  const fetchPostData=async(page=1,search=searchQuery)=>{
    try{ const res=await fetch(`${apiUrl}/getpostdata?page=${page}&limit=${itemsPerPage}&search=${search}`);
      if(!res.ok) throw new Error('Network response was not ok');
      const data=await res.json(); setData([...data.records]); setTotalPages(data.totalPages); return data;
    }catch(e){ console.error('Error fetching data:', e); throw e; }
  };

  const fetchSuggestedTags=async()=>{
    try{ const r=await fetch(`${apiUrl}/getpostdata?page=1&limit=1000`); const d=await r.json(); const all=d.records||[]; const set=new Set(); const map=new Map();
      all.forEach(p=>{ if(Array.isArray(p.tags)){ p.tags.forEach(t=>{ if(t&&t.trim()){ const tr=t.trim(); const n=tr.toLowerCase(); if(!set.has(n)){ set.add(n); map.set(n,tr);} }})}});
      setSuggestedTags(Array.from(set).map(n=>map.get(n)).sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase())));
    }catch(e){ setSuggestedTags([]);} };

  const fetchSuggestedStars=async()=>{
    try{ const r=await fetch(`${apiUrl}/getpostdata?page=1&limit=1000`); const d=await r.json(); const all=d.records||[]; const set=new Set(); const map=new Map();
      all.forEach(p=>{ if(Array.isArray(p.name)){ p.name.forEach(s=>{ if(s&&s.trim()){ const tr=s.trim(); const n=tr.toLowerCase(); if(!set.has(n)){ set.add(n); map.set(n,tr);} }})}});
      setSuggestedStars(Array.from(set).map(n=>map.get(n)).sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase())));
    }catch(e){ setSuggestedStars([]);} };

  useEffect(()=>{ fetchPostData(currentPage, searchQuery); },[currentPage, searchQuery]);
  useEffect(()=>{ 
    // initialize current page from URL if present
    try{
      const urlParams = new URLSearchParams(window.location.search);
      const p = parseInt(urlParams.get('page'));
      if(p && p>0){ setCurrentPage(p); }
    }catch(_){}
    fetchPostData(); fetchSuggestedTags(); fetchSuggestedStars(); 
  },[]);

  const handleDelete=async(id)=>{ if(!confirm('Are you sure you want to delete this post?')) return; try{ const res=await fetch(`${apiUrl}/deletepost/${id}`,{method:'DELETE'}); if(!res.ok) throw new Error('Network response was not ok'); setData(prev=>prev.filter(i=>i._id!==id)); await fetchPostData(currentPage,searchQuery);}catch(e){ alert('Error deleting post: '+e.message); fetchPostData(currentPage,searchQuery);} };

  const openUpdateModal=(item)=>{ setIsUpdateMode(true); setPostId(item._id); setImgUrl(item.imageUrl||''); setAltKeywords(item.altKeywords||''); setname(item.name||[]); setTags(item.tags||[]); setLink(item.link||''); setIframeUrl(item.iframeUrl||''); settitel(item.titel||''); setMinutes(item.minutes||''); setCategory(item.Category||'english'); setShowModal(true); };
  const openAddModal=()=>{ resetForm(); setShowModal(true); };
  const handlePageChange=(e,page)=>{ 
    setCurrentPage(page);
    try{
      const url = new URL(window.location);
      url.searchParams.set('page', page);
      window.history.pushState({}, '', url);
    }catch(_){}
  };
  const handleSearchChange=(e)=>{ setSearchQuery(e.target.value); setCurrentPage(1); };
  const resetForm=()=>{ setImgUrl(''); setAltKeywords(''); setname([]); setTags([]); setLink(''); setIframeUrl(''); settitel(''); setMinutes(''); setCategory('english'); setPostId(''); setIsUpdateMode(false); setNameInput(''); setTagInput(''); setShowSuggestions(false); setShowStarSuggestions(false); };
  const removeName=(i)=> setname(name.filter((_,idx)=> idx!==i));
  const removeTag=(i)=> setTags(tags.filter((_,idx)=> idx!==i));
  const filteredTags=suggestedTags.filter(t=> t.toLowerCase().includes(tagInput.toLowerCase()));
  const filteredStars=suggestedStars.filter(s=> s.toLowerCase().includes(nameInput.toLowerCase()));
  const addTagFromSuggestion=(t)=>{ if(!tags.includes(t)){ setTags([...tags,t]); setTagInput(''); setShowSuggestions(false);} };
  const addStarFromSuggestion=(s)=>{ if(!name.includes(s)){ setname([...name,s]); setNameInput(''); setShowStarSuggestions(false);} };

  // Windowed pagination like other admin lists
  const getVisiblePages=()=>{
    const delta = 2;
    const range=[]; const rangeWithDots=[];
    for(let i=Math.max(2, currentPage-delta); i<=Math.min(totalPages-1, currentPage+delta); i++){ range.push(i); }
    if(totalPages<=1) return [1];
    if(currentPage - delta > 2){ rangeWithDots.push(1,'...'); } else { rangeWithDots.push(1); }
    rangeWithDots.push(...range);
    if(currentPage + delta < totalPages - 1){ rangeWithDots.push('...', totalPages); } else { rangeWithDots.push(totalPages); }
    return rangeWithDots;
  };

  return (
    <Protected>
      <div className="admin-dashboard">
        <AdminNavbar />
        <div className="admin-content"><div className="container">
          <div className="admin-table-container">
            <div className="admin-table-header"><h2>Manage Posts</h2><button className="admin-add-btn" onClick={openAddModal}><i className="bi bi-plus-circle me-2"></i>Add New Post</button></div>
            <div className="admin-search-bar"><input type="text" value={searchQuery} onChange={handleSearchChange} className="form-control" placeholder="Search by Title or Video No"/></div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
              {postdata.map((item)=>(<div className="col" key={item._id}><div className="card h-100 admin-post-card"><div className="admin-post-image-container"><img src={item.imageUrl} className="card-img-top" alt={item.altKeywords||item.titel}/><div className="admin-post-overlay"><div className="admin-action-btns"><button onClick={()=>openUpdateModal(item)} className="admin-edit-btn" title="Edit Post"><i className="bi bi-pencil-square"></i></button><button onClick={()=>handleDelete(item._id)} className="admin-delete-btn" title="Delete Post"><i className="bi bi-trash3"></i></button></div></div></div><div className="card-body"><h6 className="card-title text-truncate">{item.titel}</h6><div className="admin-post-meta"><span className="admin-post-duration"><i className="bi bi-clock"></i> {item.minutes} min</span><span className="admin-post-views"><i className="bi bi-eye"></i> {formatViews(item.views)}</span></div><div className="admin-post-category"><span className="badge bg-primary">{item.Category}</span></div></div></div></div>))}
            </div>
            {totalPages>1 && (
              <div className="mt-4 d-flex justify-content-center">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage===1?'disabled':''}`}>
                      <button className="page-link" onClick={(e)=>handlePageChange(e, currentPage-1)} disabled={currentPage===1}>Previous</button>
                    </li>
                    {getVisiblePages().map((p,idx)=> (
                      <li key={idx} className={`page-item ${p==='...'?'disabled':''} ${p===currentPage?'active':''}`}>
                        {p==='...'? (
                          <span className="page-link">...</span>
                        ):(
                          <button className="page-link" onClick={(e)=>handlePageChange(e, p)}>{p}</button>
                        )}
                      </li>
                    ))}
                    <li className={`page-item ${currentPage===totalPages?'disabled':''}`}>
                      <button className="page-link" onClick={(e)=>handlePageChange(e, currentPage+1)} disabled={currentPage===totalPages}>Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div></div>

        {showModal && (<div className="admin-modal"><div className="admin-modal-content"><div className="admin-modal-header"><h3>{isUpdateMode? 'Update Post':'Add New Post'}</h3><button className="admin-modal-close" onClick={closeModal}><i className="bi bi-x-lg"></i></button></div>
          <form onSubmit={handleSubmit}><div className="admin-modal-body">
            <div className="admin-form-group"><label htmlFor="image">Image URL</label><input value={imageUrl} onChange={(e)=>setImgUrl(e.target.value)} className="form-control" type="text" id="image" required/></div>
            <div className="admin-form-group"><label>Image Alt Keywords</label><input value={altKeywords} onChange={(e)=>setAltKeywords(e.target.value)} className="form-control" type="text" placeholder="SEO keywords for image"/></div>
            <div className="admin-form-group"><label htmlFor="name">Star Names</label><div className="admin-tags-container">{name.map((n,idx)=>(<div className="admin-tag" key={idx}>{n}<button type="button" onClick={()=>removeName(idx)} className="admin-tag-remove"><i className="bi bi-x"></i></button></div>))}</div>
              <div className="admin-input-with-btn position-relative"><input value={nameInput} onChange={(e)=>{setNameInput(e.target.value); setShowStarSuggestions(e.target.value.length>0);}} className="form-control" type="text" placeholder="Enter star name"/>
                <button type="button" onClick={()=>{ if(nameInput.trim()!==""&&!name.includes(nameInput.trim())){ setname([...name,nameInput.trim()]); setNameInput(''); setShowStarSuggestions(false);} }}>Add</button>
                {showStarSuggestions && filteredStars.length>0 && (<div className="admin-suggestions">{filteredStars.slice(0,10).map((star,idx)=>(<div key={idx} className="admin-suggestion-item" onClick={()=>addStarFromSuggestion(star)}>{star}</div>))}</div>)}
              </div>
            </div>
            <div className="admin-form-group"><label htmlFor="tags">Tags</label><div className="admin-tags-container">{tags.map((t,idx)=>(<div className="admin-tag" key={idx}>{t}<button type="button" onClick={()=>removeTag(idx)} className="admin-tag-remove"><i className="bi bi-x"></i></button></div>))}</div>
              <div className="admin-input-with-btn position-relative"><input type="text" value={tagInput} onChange={(e)=>{ setTagInput(e.target.value); setShowSuggestions(e.target.value.length>0);}} placeholder="Enter tag" className="form-control"/>
                <button type="button" onClick={()=>{ if(tagInput.trim()!=='' && !tags.includes(tagInput.trim())){ setTags([...tags, tagInput.trim()]); setTagInput(''); setShowSuggestions(false);} }}>Add</button>
                {showSuggestions && filteredTags.length>0 && (<div className="admin-suggestions">{filteredTags.slice(0,10).map((t,idx)=>(<div key={idx} className="admin-suggestion-item" onClick={()=>addTagFromSuggestion(t)}>{t}</div>))}</div>)}
              </div>
            </div>
            <div className="admin-form-group"><label htmlFor="title">Title</label><input value={titel} onChange={(e)=>settitel(e.target.value)} className="form-control" type="text" id="title" required/></div>
            <div className="row"><div className="col-md-6"><div className="admin-form-group"><label htmlFor="minutes">Duration (minutes)</label><input value={minutes} onChange={(e)=>setMinutes(e.target.value)} className="form-control" type="number" id="minutes"/></div></div>
            <div className="col-md-6"><div className="admin-form-group"><label htmlFor="category">Category</label><select className="form-control" value={Category} onChange={(e)=>setCategory(e.target.value)}><option value="english">English</option><option value="indian">Indian</option><option value="hijabi">Hijabi</option><option value="viral">Viral</option></select></div></div></div>
            <div className="admin-form-group"><label htmlFor="link">External Link</label><input value={link} onChange={(e)=>setLink(e.target.value)} className="form-control" type="url" id="link"/></div>
            <div className="admin-form-group"><label htmlFor="iframeUrl">Video URL (Optional - for embedded player)</label><textarea value={iframeUrl} onChange={(e)=>setIframeUrl(e.target.value)} className="form-control" id="iframeUrl" rows="3" placeholder="Enter video URL: Direct MP4 URL or iframe embed URL"/><small className="text-muted">Supports: Direct MP4/video URLs, iframe embed URLs, or complete iframe HTML tags</small></div>
          </div>
          <div className="admin-modal-footer"><button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button><button type="submit" className="btn btn-primary">{isUpdateMode? 'Update Post':'Add Post'}</button></div>
          </form></div></div>)}
      </div>
    </Protected>
  );
}
