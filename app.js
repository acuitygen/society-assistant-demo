(() => {
  "use strict"
  const D = window.DEMO
  const $ = (s, r = document) => r.querySelector(s)
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])
  let role = "member"
  const roleName = { member: "Member", manager: "Society Manager", secretary: "Secretary" }
  const committee = () => role !== "member"

  const pages = [
    ["home", "Home", "all"], ["chat", "WhatsApp assistant", "all"], ["complaints", "Complaints", "all"],
    ["notices", "Notices", "all"], ["documents", "Documents", "all"], ["vendors", "Vendors", "all"],
    ["noc", "NOC requests", "all"], ["amc", "AMC renewals", "committee"], ["search", "Email history search", "secretary"],
    ["emergency", "Emergency contacts", "all"],
  ]
  const allowed = (p) => p[2] === "all" || (p[2] === "committee" && committee()) || (p[2] === "secretary" && role === "secretary")

  function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 2600) }
  const pill = (s) => `<span class="pill s-${s}">${esc(D.stageLabel[s])}</span>`
  const mine = (c) => c.flat === D.member.flat
  const visibleComplaints = () => committee() ? D.complaints : D.complaints.filter(mine)
  const daysChip = (d) => d <= 7 ? `<span class="chip d7">${d} days left</span>` : d <= 30 ? `<span class="chip d30">${d} days left</span>` : d <= 60 ? `<span class="chip d60">${d} days left</span>` : `<span class="chip dok">In force</span>`
  const now = () => { const d = new Date(); return d.getDate() + " Oct, " + d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) }

  function renderNav(cur) {
    $("#nav").innerHTML = pages.filter(allowed).map(([id, label, scope]) =>
      (scope === "committee" && id === "amc" ? `<div class="sec">Committee</div>` : "") +
      `<a href="#/${id}" ${cur === id ? 'aria-current="page"' : ""}>${esc(label)}</a>`).join("")
    $("#who").innerHTML = role === "member"
      ? `<b>${esc(D.member.name)}</b><br>Flat ${esc(D.member.flat)}<br><span class="badge">Member</span>`
      : `<b>${role === "manager" ? "Prakash Kulkarni" : "Nandini Joshi"}</b><br>Office, ${esc(D.society)}<br><span class="badge">${roleName[role]}</span>`
  }

  // Which action the current role can take on a complaint
  function action(c) {
    if (c.stage === "pending" && role === "member" && mine(c)) return ["closed", "Work is done, close it"]
    if (c.stage === "open" && role === "manager") return ["pending", "Assign and start work"]
    if (c.stage === "closed" && role === "manager") return ["verified", "Verify"]
    if (c.stage === "verified" && role === "secretary") return ["approved", "Approve"]
    return null
  }
  function advance(id) {
    const c = D.complaints.find((x) => x.id === id); const a = c && action(c); if (!a) return
    c.stage = a[0]; c.log.push([a[0], now()]); toast(`${c.id}: ${D.stageLabel[a[0]]}. The member is told on WhatsApp (simulated).`); route()
  }
  const pipeline = (c) => `<ol class="pipe" aria-label="Progress">${D.stages.map((s) => { const hit = c.log.find((l) => l[0] === s); return `<li class="${s} ${hit ? "done" : ""}"><b>${esc(D.stageLabel[s])}</b>${hit ? esc(hit[1]) : "Not yet"}</li>` }).join("")}</ol>`

  const V = {}
  V.home = () => {
    const my = visibleComplaints().filter((c) => c.stage !== "approved")
    const due = D.amc.filter((a) => a.days <= 60)
    return `<div class="kicker">Good evening</div><h1>${committee() ? "Committee overview" : "Welcome, " + esc(D.member.name.split(" ")[0])}</h1>
    <p class="lead">Society money figures come from MyGate's monthly report emails and are read-only here. Billing and gate entry stay on MyGate.</p>
    <div class="grid g3">
      <div class="card kpi"><div class="kicker">Money in the society's account</div><div class="num">₹38.6 lakh</div><small>As of 30 Sep 2026 · sample</small></div>
      <div class="card kpi"><div class="kicker">Spent in September</div><div class="num">₹4.2 lakh</div><small>Lift, housekeeping, security, water</small></div>
      <div class="card kpi"><div class="kicker">Saved for repairs</div><div class="num">₹21.9 lakh</div><small>Up ₹1.1 lakh this year</small></div>
    </div>
    <div class="grid g2" style="margin-top:18px">
      <section class="card"><h2>${committee() ? "Needs your action" : "My open complaints"}</h2>
        <ul class="list">${(committee() ? D.complaints.filter(action) : my).slice(0, 4).map((c) => `<li class="item"><span><a href="#/ticket/${c.id}"><b>${c.id}</b> · ${esc(c.title)}</a><p>Flat ${esc(c.flat)} · ${esc(c.cat)}</p></span>${pill(c.stage)}</li>`).join("") || `<li class="empty">Nothing waiting. All clear.</li>`}</ul></section>
      <section class="card"><h2>${committee() ? "AMC renewals due" : "Latest notices"}</h2>
        <ul class="list">${committee() ? due.map((a) => `<li class="item"><span><b>${esc(a.service)}</b><p>${esc(a.vendor)} · ends ${esc(a.expiry)}</p></span>${daysChip(a.days)}</li>`).join("") : D.notices.slice(0, 3).map((n) => `<li><b>${esc(n.title)}</b><p style="margin:2px 0;color:var(--muted)">${esc(n.date)}</p></li>`).join("")}</ul></section>
    </div>
    <div class="row" style="margin-top:18px"><a class="btn" href="#/chat">Raise a complaint on WhatsApp</a><a class="btn gold" href="#/noc">Request an NOC</a><a class="btn ghost" href="#/documents">Get a document</a></div>`
  }

  V.complaints = () => {
    const list = visibleComplaints()
    return `<div class="kicker">Five steps, every step recorded</div><h1>Complaints</h1>
    <p class="lead">Open → work in progress → closed by the member who raised it → verified by the manager → approved by the secretary. The office cannot close a complaint on a member's behalf.</p>
    <div class="board" role="list">${D.stages.map((s) => { const cs = list.filter((c) => c.stage === s); return `<section class="col" role="listitem" aria-label="${esc(D.stageLabel[s])}"><h3>${pill(s)}<span>${cs.length}</span></h3>${cs.map((c) => { const a = action(c); return `<article class="card"><a href="#/ticket/${c.id}"><b>${c.id}</b></a><p style="margin:4px 0">${esc(c.title)}</p><p style="margin:0;color:var(--muted);font-size:.88rem">Flat ${esc(c.flat)} · ${esc(c.cat)}${c.attach ? " · " + (c.attach === "pdf" ? "📄 PDF" : "📷 Photo") : ""}</p>${a ? `<button class="btn" style="margin-top:10px;width:100%" data-adv="${c.id}">${esc(a[1])}</button>` : ""}</article>` }).join("") || `<p class="empty" style="padding:12px">None</p>`}</section>` }).join("")}</div>
    ${role === "member" ? `<p class="note" style="margin-top:14px">As a member you only see complaints from your flat. Switch "Preview as" to Society Manager or Secretary to see the whole society.</p>` : ""}`
  }

  V.ticket = (id) => {
    const c = D.complaints.find((x) => x.id === id)
    if (!c || (!committee() && !mine(c))) return `<h1>Complaint not found</h1><p class="lead">It may belong to another flat.</p><a class="btn" href="#/complaints">Back to complaints</a>`
    const a = action(c)
    return `<a href="#/complaints">← All complaints</a><div class="kicker" style="margin-top:12px">${c.id} · ${esc(c.cat)}</div><h1>${esc(c.title)}</h1>
    <div class="row">${pill(c.stage)}<span>Raised by ${esc(c.by)}, flat ${esc(c.flat)}</span><span>Vendor: ${esc(c.vendor)}</span></div>
    <div class="card" style="margin-top:18px"><h2>Progress</h2>${pipeline(c)}
    ${a ? `<button class="btn" data-adv="${c.id}" style="margin-top:12px">${esc(a[1])}</button>` : `<p class="note" style="margin-top:12px">${c.stage === "approved" ? "Finished and signed off." : `The next step belongs to ${c.stage === "pending" ? "the member who raised it" : c.stage === "open" || c.stage === "closed" ? "the society manager" : "the secretary"}. Switch "Preview as" to try it.`}</p>`}</div>
    <div class="card" style="margin-top:18px"><h2>Attachments</h2>${c.attach ? `<div class="row"><span class="chip dok">${c.attach === "pdf" ? "📄 quotation.pdf" : "📷 photo-1.jpg"}</span><span style="color:var(--muted)">Sent on WhatsApp with the complaint (placeholder)</span></div>` : `<p class="empty">No attachments.</p>`}</div>`
  }

  V.notices = () => `<div class="kicker">Sent to every flat on WhatsApp</div><h1>Notices</h1>
    ${committee() ? `<form class="card" id="bc" style="margin-bottom:18px"><h2>New broadcast</h2><label for="bct">Title</label><input id="bct" required style="width:100%;margin:6px 0 10px" value="Lift B maintenance on Thursday"><label for="bcb">Message</label><textarea id="bcb" rows="3" required style="width:100%;margin-top:6px">Lift B will be off from 11 am to 1 pm for its monthly check.</textarea><div class="row" style="margin-top:10px"><button class="btn">Send to all 248 flats (simulated)</button></div></form>` : ""}
    <ul class="list">${D.notices.map((n) => `<li class="card"><div class="kicker">${esc(n.date)}</div><h2>${esc(n.title)}</h2><p>${esc(n.body)}</p>${committee() ? `<p style="color:var(--muted);margin:0">Sent ${n.sent} · delivered ${n.delivered} · read ${n.read}</p>` : ""}</li>`).join("")}</ul>`

  let docCat = "All"
  V.documents = () => {
    const cats = ["All", ...new Set(D.documents.map((d) => d.cat))]
    const docs = D.documents.filter((d) => docCat === "All" || d.cat === docCat)
    return `<div class="kicker">Library</div><h1>Documents</h1><p class="lead">Tap "Send to my WhatsApp" and the assistant sends the PDF to your chat.</p>
    <div class="row" role="group" aria-label="Filter by category" style="margin-bottom:14px">${cats.map((c) => `<button class="btn ${c === docCat ? "" : "ghost"}" data-cat="${esc(c)}" aria-pressed="${c === docCat}">${esc(c)}</button>`).join("")}</div>
    <ul class="list">${docs.map((d) => `<li class="card item"><span><b>${esc(d.title)}</b><p>${esc(d.cat)} · PDF · ${esc(d.size)}</p></span><button class="btn gold" data-toast="Sent “${esc(d.title)}” to your WhatsApp (simulated).">Send to my WhatsApp</button></li>`).join("") || `<li class="empty card">No documents in this category yet.</li>`}</ul>`
  }

  V.vendors = () => `<div class="kicker">Checked by the committee</div><h1>Vendor directory</h1><p class="lead">Ratings come from members after a job. A green tick means the society holds a police verification on file.</p>
    <div class="grid g3">${D.vendors.map((v) => `<article class="card"><div class="kicker">${esc(v.type)}</div><h3>${esc(v.name)}</h3><p class="stars" aria-label="Rated ${v.rating} out of 5">★ ${v.rating.toFixed(1)}</p><p class="${v.verified ? "ok" : "no"}">${v.verified ? "✓ Police verified" : "Verification pending"}</p>${committee() ? `<p style="color:var(--muted)">${v.jobs} society jobs this year</p>` : ""}<a class="btn ghost" href="tel:${v.phone.replace(/\s/g, "")}">Call ${esc(v.phone)}</a></article>`).join("")}</div>`

  V.noc = () => {
    const list = role === "secretary" ? D.nocs : D.nocs.filter((n) => n.flat === D.member.flat || committee())
    return `<div class="kicker">No-objection certificates</div><h1>NOC requests</h1>
    ${role === "member" ? `<form class="card" id="nocf" style="margin-bottom:18px"><h2>Request an NOC</h2><label for="noct">Type</label><select id="noct" style="width:100%;margin:6px 0 12px"><option>Bank NOC (home loan)</option><option>Move-in NOC (tenant)</option><option>Move-out NOC</option><option>Passport address NOC</option></select><button class="btn">Send request</button></form>` : ""}
    <div class="card"><table><thead><tr><th>Request</th><th>Flat</th><th>Type</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>${list.map((n) => `<tr><td>${n.id}</td><td>${esc(n.flat)} · ${esc(n.by)}</td><td>${esc(n.type)}</td><td>${esc(n.date)}</td><td>${esc(n.stage)}</td><td>${role === "secretary" && n.stage === "With secretary" ? `<button class="btn" data-noc="${n.id}">Approve</button>` : ""}</td></tr>`).join("")}</tbody></table></div>`
  }

  V.amc = () => `<div class="kicker">Contracts register</div><h1>AMC renewals</h1><p class="lead">The assistant reminds the committee on WhatsApp 60, 30 and 7 days before a contract ends.</p>
    <div class="card"><table><thead><tr><th>Service</th><th>Vendor</th><th>Value</th><th>Ends</th><th>Alert</th></tr></thead><tbody>${D.amc.map((a) => `<tr><td><b>${esc(a.service)}</b></td><td>${esc(a.vendor)}</td><td>${esc(a.value)}</td><td>${esc(a.expiry)}</td><td>${daysChip(a.days)}</td></tr>`).join("")}</tbody></table></div>`

  let lastQ = ""
  V.search = () => {
    const hit = D.emails[lastQ]
    return `<div class="kicker">Secretary only</div><h1>Email history search</h1><p class="lead">Ask about the society's past emails in plain words. In this demo the answers are scripted. Try one of the examples.</p>
    <form class="search" id="sf"><label class="skip" for="sq">Question</label><input id="sq" value="${esc(lastQ)}" placeholder="e.g. lift repairs since 2024"><button class="btn">Search</button></form>
    <div class="row" style="margin:12px 0">${Object.keys(D.emails).map((q) => `<button class="btn ghost" data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>
    ${lastQ ? hit ? `<section class="card"><h2>Summary</h2><p>${esc(hit.summary)}</p><h3>Sources</h3><ul>${hit.sources.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><p class="note">In the real product this summary would be written by a cloud AI service. That's disclosed here every time. This demo uses no AI.</p></section>` : `<p class="card empty">No scripted answer for that. Try one of the examples above.</p>` : ""}`
  }

  V.emergency = () => `<h1>Emergency contacts</h1><p class="lead">Tap a number to call.</p><ul class="card emerg list">${D.emergency.map(([n, p]) => `<li><span>${esc(n)}</span><a href="tel:${p.replace(/\s/g, "")}">${esc(p)}</a></li>`).join("")}</ul>`

  // ---------- WhatsApp simulation ----------
  const chat = { msgs: [{ who: "bot", text: `Namaste ${D.member.name.split(" ")[0]} 🙏 I'm the ${D.society} assistant. What can I help with?`, t: "7:58 pm" }], busy: false }
  const scripts = {
    "Raise a complaint": ["The bathroom tap in A-402 keeps dripping", `Sorry about that. I've logged it as a plumbing complaint.\n\nTicket: SH-1045\nFlat: A-402\nStatus: Open\n\nYou can send a photo here. I'll message you when a plumber is assigned.`],
    "Check status": ["What's the status of my complaints?", `You have 2 complaints in progress:\n\n• SH-1042 Kitchen sink leak: work in progress (Patil Plumbing Works)\n• SH-1038 Corridor light: closed by you, waiting for the manager to verify\n\nReply with a ticket number for its full history.`],
    "Request an NOC": ["I need a bank NOC for my home loan", `Sure. I've sent a Bank NOC request for A-402 to the secretary.\n\nRequest: NOC-224\nUsually ready in 3 working days. I'll send the signed PDF here.`],
    "Ask a question": ["When is the water tank cleaning?", `Sunday 25 October, 10 am to 2 pm. Water will be off during that time, so please store some the night before.\n\nSource: notice dated 18 Oct 2026.`],
  }
  function botReply(text) {
    const t = text.toLowerCase()
    for (const [k, v] of Object.entries(scripts)) if (v[0].toLowerCase() === t) return v[1]
    if (/leak|broken|not working|complain|tap|light|lift/.test(t)) return scripts["Raise a complaint"][1]
    if (/status|ticket|update/.test(t)) return scripts["Check status"][1]
    if (/noc/.test(t)) return scripts["Request an NOC"][1]
    if (/water|tank|agm|meeting|notice/.test(t)) return scripts["Ask a question"][1]
    if (/plumber|electrician|vendor|maid/.test(t)) return "Here are the top verified plumbers:\n\n• Patil Plumbing Works ★4.6 ✓ verified\n  +91 90000 00101"
    return "This is a demo, so I only know a few scripted answers. Try one of the buttons below."
  }
  function say(text) {
    if (chat.busy || !text.trim()) return
    chat.msgs.push({ who: "me", text, t: now().split(", ")[1] }); chat.busy = true; drawChat()
    setTimeout(() => { chat.msgs.push({ who: "bot", text: botReply(text), t: now().split(", ")[1] }); chat.busy = false; drawChat() }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 900)
  }
  function drawChat() {
    const box = $("#msgs"); if (!box) return
    box.innerHTML = chat.msgs.map((m) => `<div class="msg ${m.who}"><span class="skip">${m.who === "me" ? "You" : "Assistant"}:</span>${esc(m.text)}<time>${esc(m.t)}</time></div>`).join("") + (chat.busy ? `<div class="typing">typing…</div>` : "")
    box.scrollTop = box.scrollHeight
  }
  V.chat = () => `<div class="kicker">Simulated · nothing is sent</div><h1>WhatsApp assistant</h1>
    <div class="chatwrap"><div class="phone"><div class="screen"><div class="wa-head"><span class="mono" aria-hidden="true">SH</span><span><b>${esc(D.society)} Assistant</b><small>Business account · demo</small></span></div>
      <div class="msgs" id="msgs" role="log" aria-live="polite" aria-label="Chat"></div>
      <div class="quick">${Object.keys(scripts).map((k) => `<button data-say="${esc(k)}">${esc(k)}</button>`).join("")}</div>
      <form id="cf" style="display:flex;gap:6px;padding:8px;background:#f6f1e8"><label class="skip" for="ci">Message</label><input id="ci" style="flex:1" placeholder="Type a message"><button class="btn" aria-label="Send">➤</button></form></div></div>
    <div><div class="card"><h2>What to try</h2><ol><li><b>Raise a complaint</b> in plain words. It becomes a ticket on the Complaints board.</li><li><b>Check status</b> of your open tickets.</li><li><b>Request an NOC</b>. It goes to the secretary.</li><li><b>Ask a question</b> answered from society notices.</li></ol><p class="note">Replies are scripted for the demo. The real assistant would use the WhatsApp Business API and route messages with AI.</p></div></div></div>`

  function route() {
    const [, page = "home", arg] = location.hash.split("/")
    let p = pages.find((x) => x[0] === page)
    if (page !== "ticket" && (!p || !allowed(p))) { p = pages[0] }
    const id = page === "ticket" ? "complaints" : p[0]
    renderNav(id)
    $("#main").innerHTML = page === "ticket" ? V.ticket(arg) : V[p[0]]()
    document.title = (page === "ticket" ? arg : p[1]) + " · Society Assistant demo"
    if (id === "chat") drawChat()
    $(".side").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false")
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-adv],[data-cat],[data-toast],[data-say],[data-q],[data-noc]"); if (!t) return
    if (t.dataset.adv) advance(t.dataset.adv)
    else if (t.dataset.cat) { docCat = t.dataset.cat; route() }
    else if (t.dataset.toast) toast(t.dataset.toast)
    else if (t.dataset.say) say(scripts[t.dataset.say][0])
    else if (t.dataset.q) { lastQ = t.dataset.q; route() }
    else if (t.dataset.noc) { D.nocs.find((n) => n.id === t.dataset.noc).stage = "Approved"; toast("NOC approved. The signed PDF goes to the member on WhatsApp (simulated)."); route() }
  })
  document.addEventListener("submit", (e) => {
    e.preventDefault()
    if (e.target.id === "cf") { const i = $("#ci"); say(i.value); i.value = "" }
    if (e.target.id === "sf") { lastQ = $("#sq").value.trim().toLowerCase(); route() }
    if (e.target.id === "bc") { D.notices.unshift({ date: "21 Oct 2026", title: $("#bct").value, body: $("#bcb").value, sent: 248, delivered: 0, read: 0 }); toast("Broadcast queued for 248 flats (simulated)."); route() }
    if (e.target.id === "nocf") { D.nocs.unshift({ id: "NOC-" + (224 + D.nocs.length), flat: D.member.flat, by: D.member.name, type: $("#noct").value, stage: "With secretary", date: "21 Oct 2026" }); toast("Request sent to the secretary (simulated)."); route() }
  })
  $("#role").addEventListener("change", (e) => { role = e.target.value; route(); toast("Previewing as " + roleName[role]) })
  $("#menu").addEventListener("click", () => { const s = $(".side"); s.classList.toggle("open"); $("#menu").setAttribute("aria-expanded", s.classList.contains("open")) })
  addEventListener("hashchange", () => { route(); $("#main").focus() })
  route()
})()
