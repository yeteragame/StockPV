import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, Bell, BookOpen, BrainCircuit, BriefcaseBusiness, ChartCandlestick,
  ChevronDown, CircleHelp, Coins, Compass, Crown, Globe2, LayoutDashboard,
  Menu, Newspaper, Search, Settings, ShieldCheck, Sparkles, TrendingUp,
  UserRound, Wallet, X, ArrowUpRight, ArrowDownRight, Plus, Play, Check,
  Clock3, Zap, LineChart, Building2, CalendarDays
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const nav = [
  ["Home", LayoutDashboard], ["Stocks", TrendingUp], ["Advanced Charts", ChartCandlestick],
  ["AI Intelligence", BrainCircuit], ["Portfolio", BriefcaseBusiness], ["IPO & Mutual Funds", Coins],
  ["Market News", Newspaper], ["Virtual Trading", Wallet], ["Academy", BookOpen], ["Profile", UserRound]
];
const sampleStocks = [
  {symbol:"RELIANCE",name:"Reliance Industries",price:1284.5,change:1.42},
  {symbol:"TCS",name:"Tata Consultancy Services",price:3128.2,change:-0.64},
  {symbol:"HDFCBANK",name:"HDFC Bank",price:972.8,change:0.88},
  {symbol:"INFY",name:"Infosys",price:1542.1,change:1.12},
  {symbol:"ICICIBANK",name:"ICICI Bank",price:1261.4,change:-0.31}
];
const chartData = [32,35,33,39,37,43,41,48,46,53,51,58,56,64,61,70,67,74,72,81].map((v,i)=>({t:`${9+i}:00`,value:v}));
const money = n => "₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2});
function Stat({label,value,change,icon:Icon}) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><Icon size={17}/></div><strong>{value}</strong><small className={change>=0?"positive":"negative"}>{change>=0?"+":""}{change}% today</small></div>
}
function App(){
  const [active,setActive]=useState("Home"), [mobileOpen,setMobileOpen]=useState(false);
  const [query,setQuery]=useState(""), [watchlist,setWatchlist]=useState(["RELIANCE","TCS","HDFCBANK"]);
  const [lang,setLang]=useState("EN"), [toast,setToast]=useState(""), [balance,setBalance]=useState(100000), [trades,setTrades]=useState([]);
  const [symbol,setSymbol]=useState("RELIANCE"), [qty,setQty]=useState(1), [tradeSide,setTradeSide]=useState("BUY");
  const [apiStatus,setApiStatus]=useState("Checking backend…");
  useEffect(()=>{fetch("/api/health").then(r=>r.json()).then(d=>setApiStatus(d.status==="ok"?"Backend connected":"Backend unavailable")).catch(()=>setApiStatus("Backend not connected"));},[]);
  const filtered=useMemo(()=>sampleStocks.filter(s=>(s.symbol+" "+s.name).toLowerCase().includes(query.toLowerCase())),[query]);
  const notify=(m)=>{setToast(m);setTimeout(()=>setToast(""),2600)};
  const addWatch=(s)=>{setWatchlist(w=>w.includes(s)?w:[...w,s]);notify(`${s} added to watchlist`);};
  const selected=sampleStocks.find(s=>s.symbol===symbol)||sampleStocks[0];
  const placeVirtual=()=>{
    const total=selected.price*Number(qty||0);
    if(!qty||Number(qty)<1) return notify("Enter a valid quantity");
    if(tradeSide==="BUY"&&total>balance) return notify("Insufficient virtual balance");
    setBalance(b=>tradeSide==="BUY"?b-total:b+total);
    setTrades(t=>[{id:Date.now(),symbol,side:tradeSide,qty:Number(qty),price:selected.price,total},...t]);
    notify(`Virtual ${tradeSide} order simulated`);
  };
  const sectionTitle=active;
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen?"open":""}`}>
      <div className="brand"><div className="brand-mark">S</div><div><b>STOCK<span>PV</span></b><small>MARKET INTELLIGENCE</small></div><button className="icon-btn close-nav" onClick={()=>setMobileOpen(false)}><X/></button></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(([name,Icon])=><button key={name} className={`nav-item ${active===name?"active":""}`} onClick={()=>{setActive(name);setMobileOpen(false)}}><Icon size={18}/><span>{name}</span>{name==="AI Intelligence"&&<i className="new-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="plan-mini"><Crown size={17}/><div><b>Unlock StockPV Pro</b><small>Explore premium research</small></div><ArrowUpRight size={15}/></div><div className="user-mini"><div className="avatar">U</div><div><b>Guest Explorer</b><small>Free experience</small></div><Settings size={17}/></div></div>
    </aside>
    {mobileOpen&&<div className="scrim" onClick={()=>setMobileOpen(false)}/>}
    <main className="main">
      <header className="topbar"><div className="top-left"><button className="icon-btn mobile-menu" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="crumb">Workspace <span>/</span> <b>{active}</b></div></div><div className="top-actions"><div className="market-status"><i/> Market overview</div><button className="icon-btn" onClick={()=>notify("You are all caught up")}><Bell size={18}/></button><button className="lang-btn" onClick={()=>setLang(lang==="EN"?"HI":"EN")}><Globe2 size={16}/>{lang}<ChevronDown size={14}/></button><div className="avatar">U</div></div></header>
      <div className="content">
        <div className="welcome-row"><div><div className="eyebrow"><span className="pulse"/> YOUR MARKET, IN FOCUS</div><h1>{sectionTitle}<span className="green-dot">.</span></h1><p className="subhead">{active==="Home"?"A clearer view of the markets. Research, track and learn.":`Explore ${active.toLowerCase()} with StockPV.`}</p></div><div className="date-pill"><CalendarDays size={15}/> Market session · Demo preview</div></div>
        {active==="Home"&&<Home stocks={sampleStocks} watchlist={watchlist} onAdd={addWatch} onOpen={setActive} />}
        {active==="Stocks"&&<Stocks stocks={filtered} query={query} setQuery={setQuery} watchlist={watchlist} onAdd={addWatch}/>}
        {active==="Advanced Charts"&&<Charts symbol={symbol} setSymbol={setSymbol}/>}
        {active==="AI Intelligence"&&<AIResearch notify={notify}/>}
        {active==="Portfolio"&&<Portfolio balance={balance} trades={trades}/>}
        {active==="IPO & Mutual Funds"&&<IPO notify={notify}/>}
        {active==="Market News"&&<News/>}
        {active==="Virtual Trading"&&<Trading symbol={symbol} setSymbol={setSymbol} qty={qty} setQty={setQty} side={tradeSide} setSide={setTradeSide} selected={selected} balance={balance} trades={trades} onTrade={placeVirtual}/>}
        {active==="Academy"&&<Academy notify={notify}/>}
        {active==="Profile"&&<Profile lang={lang} setLang={setLang} notify={notify}/>}
        <footer><span>© 2026 StockPV</span><span><i className="footer-dot"/> {apiStatus} · Demo market data</span><span>Built for informed market learning</span></footer>
      </div>
    </main>
    {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}
function Panel({title,action,children}){return <section className="panel"><div className="panel-head"><h3>{title}</h3>{action}</div>{children}</section>}
function Home({stocks,watchlist,onAdd,onOpen}){
 return <>
  <div className="stats-grid"><Stat label="NIFTY 50" value="24,112.35" change={0.72} icon={Activity}/><Stat label="SENSEX" value="79,802.14" change={0.58} icon={TrendingUp}/><Stat label="BANK NIFTY" value="51,204.80" change={-0.24} icon={Building2}/><Stat label="INDIA VIX" value="14.28" change={-1.15} icon={Zap}/></div>
  <div className="dashboard-grid"><Panel title="Market movement" action={<span className="tag">DEMO DATA</span>}><div className="chart-summary"><div><strong>+2.84%</strong><small>Illustrative session movement</small></div><span className="positive">↗ Trending</span></div><div className="big-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#32d69a" stopOpacity={.25}/><stop offset="100%" stopColor="#32d69a" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#1b3029" vertical={false}/><XAxis dataKey="t" hide/><YAxis hide domain={["dataMin-8","dataMax+8"]}/><Tooltip contentStyle={{background:"#0b1712",border:"1px solid #244638",borderRadius:10}}/><Area type="monotone" dataKey="value" stroke="#39d99d" strokeWidth={2.5} fill="url(#fill)"/></AreaChart></ResponsiveContainer></div><div className="chart-foot"><span>09:15</span><span>12:00</span><span>15:30</span></div></Panel>
   <Panel title="Your watchlist" action={<button className="text-btn" onClick={()=>onOpen("Stocks")}>View all <ArrowUpRight size={14}/></button>}><div className="stock-list">{stocks.filter(s=>watchlist.includes(s.symbol)).map(s=><StockRow key={s.symbol} s={s}/>)}</div></Panel></div>
  <div className="section-heading"><div><h2>Explore the market</h2><p>Tools to help you understand market activity.</p></div></div>
  <div className="quick-grid">{[["Stock discovery","Find and compare listed companies",TrendingUp,"Stocks"],["Advanced charts","Explore price action and indicators",ChartCandlestick,"Advanced Charts"],["AI research","Summaries and explainers",BrainCircuit,"AI Intelligence"],["Virtual trading","Practice with simulated funds",Wallet,"Virtual Trading"]].map(([t,d,I,s])=><button className="quick-card" key={t} onClick={()=>onOpen(s)}><div className="quick-icon"><I/></div><b>{t}</b><small>{d}</small><ArrowUpRight className="quick-arrow" size={16}/></button>)}</div>
  <Panel title="Market watch" action={<span className="tag">ILLUSTRATIVE</span>}><div className="table-wrap"><table><thead><tr><th>INSTRUMENT</th><th>LAST PRICE</th><th>CHANGE</th><th>WATCHLIST</th></tr></thead><tbody>{stocks.slice(0,4).map(s=><tr key={s.symbol}><td><b>{s.symbol}</b><small>{s.name}</small></td><td>{money(s.price)}</td><td className={s.change>=0?"positive":"negative"}>{s.change>0?"+":""}{s.change}%</td><td><button className="small-outline" onClick={()=>onAdd(s.symbol)}><Plus size={13}/> Add</button></td></tr>)}</tbody></table></div></Panel>
 </>
}
function StockRow({s}){return <div className="stock-row"><div><b>{s.symbol}</b><small>{s.name}</small></div><div className="align-right"><b>{money(s.price)}</b><small className={s.change>=0?"positive":"negative"}>{s.change>0?"+":""}{s.change}%</small></div></div>}
function Stocks({stocks,query,setQuery,watchlist,onAdd}){return <><div className="search-bar"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search company or symbol…"/></div><Panel title="Stock discovery" action={<span className="tag">SAMPLE UNIVERSE</span>}><div className="table-wrap"><table><thead><tr><th>COMPANY</th><th>PRICE</th><th>CHANGE</th><th>ACTION</th></tr></thead><tbody>{stocks.map(s=><tr key={s.symbol}><td><b>{s.symbol}</b><small>{s.name}</small></td><td>{money(s.price)}</td><td className={s.change>=0?"positive":"negative"}>{s.change>0?"+":""}{s.change}%</td><td><button className="small-outline" onClick={()=>onAdd(s.symbol)}>{watchlist.includes(s.symbol)?"Saved":"＋ Watch"}</button></td></tr>)}</tbody></table>{!stocks.length&&<div className="empty">No matching stocks in the sample list.</div>}</div></Panel></>}
function Charts({symbol,setSymbol}){return <Panel title="Advanced chart workspace" action={<span className="tag">DEMO SERIES</span>}><div className="chart-toolbar"><select value={symbol} onChange={e=>setSymbol(e.target.value)}>{sampleStocks.map(s=><option key={s.symbol}>{s.symbol}</option>)}</select><div className="timeframes">{["1D","1W","1M","3M","1Y"].map(x=><button key={x} className={x==="1D"?"selected":""}>{x}</button>)}</div></div><div className="large-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="fill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#32d69a" stopOpacity={.22}/><stop offset="100%" stopColor="#32d69a" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#1b3029" strokeDasharray="3 3"/><XAxis dataKey="t" stroke="#71877c"/><YAxis stroke="#71877c"/><Tooltip contentStyle={{background:"#0b1712",border:"1px solid #244638"}}/><Area type="monotone" dataKey="value" stroke="#39d99d" fill="url(#fill2)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div><div className="indicator-row">{["RSI","MACD","Moving Average","Bollinger Bands","VWAP"].map(x=><span className="chip" key={x}>{x} · preview</span>)}</div><p className="muted-note">Chart values are illustrative. Live chart feeds and technical indicator calculations require a configured licensed data provider.</p></Panel>}
function AIResearch({notify}){const [q,setQ]=useState("");const [messages,setMessages]=useState([{role:"assistant",text:"Welcome to StockPV Research. Ask about market concepts, company analysis frameworks, or financial terms. Live AI responses activate after an AI provider key is configured."}]);return <div className="ai-layout"><Panel title="StockPV AI Research"><div className="chat-messages">{messages.map((m,i)=><div className={`chat-bubble ${m.role}`} key={i}>{m.text}</div>)}</div><form className="chat-input" onSubmit={e=>{e.preventDefault();if(!q.trim())return;setMessages(m=>[...m,{role:"user",text:q},{role:"assistant",text:"AI provider is not configured yet. Add an approved provider key in Render Environment to enable generated research. This preview will not invent live market facts."}]);setQ("");}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask a market research question…"/><button className="primary-btn"><Sparkles size={16}/> Ask</button></form></Panel><div className="side-stack"><div className="feature-card"><BrainCircuit/><b>Research responsibly</b><p>AI insights are educational and are not personalized investment advice.</p></div><Panel title="Research topics">{["Fundamental analysis","Technical indicators","Risk and diversification","Understanding earnings"].map(x=><button className="topic" key={x} onClick={()=>notify(`${x} selected`)}>{x}<ArrowUpRight size={14}/></button>)}</Panel></div></div>}
function Portfolio({balance,trades}){return <><div className="stats-grid"><Stat label="Virtual cash balance" value={money(balance)} change={0} icon={Wallet}/><Stat label="Simulated trades" value={trades.length} change={0} icon={Activity}/><Stat label="Portfolio value" value={money(100000)} change={0} icon={BriefcaseBusiness}/><Stat label="Mode" value="Practice" change={0} icon={ShieldCheck}/></div><Panel title="Recent simulated activity">{trades.length?<TradeTable trades={trades}/>:<div className="empty"><Wallet size={28}/><b>No portfolio activity yet</b><span>Place a virtual trade to see it here.</span></div>}</Panel></>}
function TradeTable({trades}){return <div className="table-wrap"><table><thead><tr><th>STOCK</th><th>SIDE</th><th>QTY</th><th>PRICE</th><th>VALUE</th></tr></thead><tbody>{trades.map(t=><tr key={t.id}><td><b>{t.symbol}</b></td><td className={t.side==="BUY"?"positive":"negative"}>{t.side}</td><td>{t.qty}</td><td>{money(t.price)}</td><td>{money(t.total)}</td></tr>)}</tbody></table></div>}
function Trading({symbol,setSymbol,qty,setQty,side,setSide,selected,balance,trades,onTrade}){return <div className="trading-grid"><Panel title="Virtual order ticket" action={<span className="tag">SIMULATION ONLY</span>}><div className="balance-banner"><span>Available virtual funds</span><b>{money(balance)}</b></div><label className="field-label">Instrument</label><select className="full-select" value={symbol} onChange={e=>setSymbol(e.target.value)}>{sampleStocks.map(s=><option key={s.symbol}>{s.symbol}</option>)}</select><div className="side-toggle"><button className={side==="BUY"?"buy-active":""} onClick={()=>setSide("BUY")}>BUY</button><button className={side==="SELL"?"sell-active":""} onClick={()=>setSide("SELL")}>SELL</button></div><label className="field-label">Quantity</label><input className="qty-input" type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)}/><div className="order-total"><span>Indicative price</span><b>{money(selected.price)}</b></div><div className="order-total"><span>Estimated value</span><b>{money(selected.price*Number(qty||0))}</b></div><button className="primary-btn wide" onClick={onTrade}>Simulate {side} order <ArrowUpRight size={16}/></button><p className="muted-note">No real orders are sent. This practice simulator uses sample prices and an in-memory balance.</p></Panel><Panel title="Virtual trade history">{trades.length?<TradeTable trades={trades}/>:<div className="empty">Your simulated orders will appear here.</div>}</Panel></div>}
function IPO({notify}){return <div className="two-col"><Panel title="IPO tracker" action={<span className="tag">DATA NOT CONNECTED</span>}>{["Upcoming IPO calendar","Open IPO applications","Allotment information"].map((x,i)=><div className="list-tile" key={x}><div className="tile-icon"><CalendarDays/></div><div><b>{x}</b><small>Connect a verified IPO data source to populate this feed.</small></div><button className="small-outline" onClick={()=>notify("IPO data provider not configured")}>Details</button></div>)}</Panel><Panel title="Mutual fund discovery">{["Equity funds","Debt funds","Index funds","Hybrid funds"].map(x=><button className="topic" key={x} onClick={()=>notify("Fund data provider not configured")}>{x}<ArrowUpRight size={14}/></button>)}</Panel></div>}
function News(){return <Panel title="Market news" action={<span className="tag">FEED NOT CONNECTED</span>}>{["Markets open with mixed global cues","Corporate earnings calendar: what to watch","Understanding RBI policy announcements"].map((x,i)=><div className="news-item" key={x}><div className="news-icon"><Newspaper/></div><div><b>{x}</b><small>Editorial placeholder · Connect a licensed news provider for current articles.</small></div><Clock3 size={15}/></div>)}</Panel>}
function Academy({notify}){const courses=[["Stock market foundations","Beginner · 6 lessons"],["Reading candlestick charts","Beginner · 8 lessons"],["Fundamental analysis","Intermediate · 7 lessons"],["Risk management basics","Beginner · 5 lessons"]];return <div className="course-grid">{courses.map(([t,d],i)=><div className="course-card" key={t}><div className="course-art"><BookOpen size={28}/><span>0{i+1}</span></div><b>{t}</b><small>{d}</small><div className="progress-track"><i style={{width:"0%"}}/></div><button className="text-btn" onClick={()=>notify("Course content will be added in the learning module")}>Open course <ArrowUpRight size={14}/></button></div>)}</div>}
function Profile({lang,setLang,notify}){return <div className="two-col"><Panel title="Your account"><div className="profile-head"><div className="avatar big">U</div><div><b>Guest Explorer</b><small>Explore StockPV without signing in</small></div></div>{["Sign in with phone OTP","Continue with Google","Account security","Notification preferences"].map(x=><button className="topic" key={x} onClick={()=>notify("Authentication provider setup required")}>{x}<ArrowUpRight size={14}/></button>)}</Panel><Panel title="Preferences"><div className="pref-row"><span>Language</span><select value={lang} onChange={e=>setLang(e.target.value)}><option>EN</option><option>HI</option></select></div><div className="pref-row"><span>Theme</span><b>Dark · Emerald</b></div><div className="pref-row"><span>Plan</span><b>Free preview</b></div><button className="primary-btn wide" onClick={()=>notify("Plan checkout will activate after payment gateway setup")}>Explore AI Plus / Pro / Ultra</button></Panel></div>}
export default App;
