/* ============================================================
   IRAQ SHIELD — نظام الحسابات / Accounts system (Supabase)
   يُحمَّل بعد supabase-config.js. لا يحتاج تعديلًا.
   Loaded after supabase-config.js. No edits needed here.
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.IQS_SUPABASE || {};
  var CONFIGURED = CFG.url && CFG.anonKey &&
    CFG.url.indexOf("YOUR-PROJECT") === -1 &&
    CFG.anonKey.indexOf("XXXX") === -1;

  /* ---------- bilingual strings ---------- */
  function lang() { try { return localStorage.getItem("iqs-lang") || "ar"; } catch (e) { return "ar"; } }
  var T = {
    ar: {
      signin: "تسجيل الدخول", signin_sub: "ادخل إلى مركز العمليات",
      signup: "إنشاء حساب", signup_sub: "انضم إلى منصة درع العراق",
      account: "حسابي", email: "البريد الإلكتروني", pass: "كلمة المرور",
      name: "الاسم الكامل", org: "الجهة", remember: "تذكّرني", forgot: "نسيت كلمة المرور؟",
      enter: "دخول", create: "إنشاء الحساب", or: "أو",
      g_google: "المتابعة عبر Google", g_github: "المتابعة عبر GitHub",
      have: "لديك حساب؟ سجّل الدخول", no: "لا حساب؟ أنشئ واحدًا",
      signout: "تسجيل الخروج", save: "حفظ التغييرات", saved: "تم الحفظ",
      prefs: "إعدادات التنبيه", a_breach: "إشعار عند اختراق ناجح",
      a_weekly: "تقرير أسبوعي بالبريد", a_local: "تنبيه لمحافظتي فقط",
      province: "المحافظة", member: "عضو منذ", verify: "تحقّق من بريدك لإكمال التسجيل.",
      badpass: "كلمة المرور 8 أحرف على الأقل.", bademail: "أدخل بريدًا صحيحًا.",
      needname: "أدخل اسمك.", loading: "جارٍ…", close: "إغلاق",
      login_btn: "دخول", not_setup: "لم يُضبط الاتصال بـ Supabase بعد — راجِع ملف supabase-config.js.",
      orgs: ["جهة حكومية", "مصرف", "شركة اتصالات", "قطاع خاص", "باحث أمني"],
      provinces: ["بغداد", "البصرة", "الموصل", "أربيل", "كركوك", "النجف", "السليمانية", "الناصرية", "الرمادي", "كربلاء", "دهوك", "الكوت", "العمارة", "أخرى"]
    },
    en: {
      signin: "Sign in", signin_sub: "Enter the operations centre",
      signup: "Create account", signup_sub: "Join the Iraq Shield platform",
      account: "Account", email: "Email", pass: "Password",
      name: "Full name", org: "Organisation", remember: "Remember me", forgot: "Forgot password?",
      enter: "Sign in", create: "Create account", or: "or",
      g_google: "Continue with Google", g_github: "Continue with GitHub",
      have: "Have an account? Sign in", no: "No account? Create one",
      signout: "Sign out", save: "Save changes", saved: "Saved",
      prefs: "Alert settings", a_breach: "Notify on successful breach",
      a_weekly: "Weekly email report", a_local: "Alert for my province only",
      province: "Province", member: "Member since", verify: "Check your email to finish signing up.",
      badpass: "Password must be at least 8 characters.", bademail: "Enter a valid email.",
      needname: "Enter your name.", loading: "Loading…", close: "Close",
      login_btn: "Sign in", not_setup: "Supabase isn't configured yet — see supabase-config.js.",
      orgs: ["Government", "Bank", "Telecom", "Private sector", "Security researcher"],
      provinces: ["Baghdad", "Basra", "Mosul", "Erbil", "Kirkuk", "Najaf", "Sulaymaniyah", "Nasiriyah", "Ramadi", "Karbala", "Duhok", "Kut", "Amarah", "Other"]
    }
  };
  function t(k) { var L = lang(); return (T[L] && T[L][k] !== undefined) ? T[L][k] : k; }

  /* ---------- styles ---------- */
  var css = document.createElement("style");
  css.textContent = [
    ".iqs-auth-btn{padding:5px 10px;font-size:12px;min-width:38px}",
    ".iqs-ov{position:fixed;inset:0;background:rgba(6,11,20,.82);display:none;align-items:center;justify-content:center;z-index:200}",
    ".iqs-ov.on{display:flex}",
    ".iqs-card{width:340px;max-width:94vw;background:var(--panel,#0B1424);border:1px solid var(--line,#18263F);border-top:2px solid var(--cyan,#22D3EE);border-radius:12px;padding:1.25rem;max-height:92vh;overflow:auto}",
    ".iqs-card h3{font-size:16px;color:var(--text,#D5DEEF);margin:0 0 4px;font-weight:600}",
    ".iqs-card .sub{color:var(--dim,#6E7F9C);font-size:13px;margin:0 0 16px}",
    ".iqs-card label{display:block;color:var(--dim,#6E7F9C);font-size:12px;margin:0 0 5px}",
    ".iqs-card input,.iqs-card select{width:100%;background:var(--panel2,#0F1B30);border:1px solid var(--line,#18263F);color:var(--text,#D5DEEF);border-radius:6px;padding:9px 10px;margin:0 0 12px;font-family:inherit;font-size:14px}",
    ".iqs-card input.ltr{direction:ltr;text-align:left}",
    ".iqs-primary{background:rgba(34,211,238,.12);border:1px solid var(--cyan,#22D3EE);color:var(--cyan,#22D3EE);text-align:center;padding:10px;border-radius:8px;font-size:14px;cursor:pointer;width:100%}",
    ".iqs-primary:hover{background:rgba(34,211,238,.2)}",
    ".iqs-oauth{border:1px solid var(--line,#18263F);color:var(--text,#D5DEEF);text-align:center;padding:9px;border-radius:8px;font-size:13px;cursor:pointer;margin:0 0 8px;background:transparent;width:100%;display:flex;align-items:center;justify-content:center;gap:8px}",
    ".iqs-oauth:hover{border-color:var(--cyan,#22D3EE)}",
    ".iqs-div{display:flex;align-items:center;gap:10px;margin:16px 0}",
    ".iqs-div span{color:var(--faint,#33445F);font-size:11px}.iqs-div i{flex:1;height:1px;background:var(--line,#18263F);display:block}",
    ".iqs-link{color:var(--cyan,#22D3EE);font-size:12.5px;cursor:pointer;background:none;border:0;padding:0;font-family:inherit;text-align:center;width:100%;margin-top:12px}",
    ".iqs-err{color:var(--red,#F43F5E);font-size:12.5px;margin:0 0 12px;min-height:16px}",
    ".iqs-ok{color:var(--green,#34D399);font-size:12.5px;margin:0 0 12px}",
    ".iqs-x{float:inline-end;background:none;border:0;color:var(--dim,#6E7F9C);font-size:18px;cursor:pointer;line-height:1}",
    ".iqs-av{width:44px;height:44px;border-radius:50%;background:rgba(34,211,238,.12);color:var(--cyan,#22D3EE);display:flex;align-items:center;justify-content:center;font-size:15px;flex:none}",
    ".iqs-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--line,#18263F);font-size:13px;color:var(--dim,#6E7F9C)}",
    ".iqs-row:last-child{border:0}",
    ".iqs-sw{position:relative;width:38px;height:20px;flex:none;cursor:pointer}",
    ".iqs-sw input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}",
    ".iqs-sw .tk{position:absolute;inset:0;background:var(--faint,#33445F);border-radius:10px;transition:.2s}",
    ".iqs-sw .tk:before{content:'';position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;top:3px;inset-inline-start:3px;transition:.2s}",
    ".iqs-sw input:checked+.tk{background:var(--green,#34D399)}",
    ".iqs-sw input:checked+.tk:before{inset-inline-start:21px}"
  ].join("\n");

  /* ---------- state ---------- */
  var sb = null, user = null, profile = null;

  function svg() {
    return '<svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true" style="vertical-align:-5px"><path d="M32 8 L52 16 V34 C52 46 42 54 32 58 C22 54 12 46 12 34 V16 Z" fill="none" stroke="#22D3EE" stroke-width="4"/><path d="M22 32 L30 40 L44 24" fill="none" stroke="#22D3EE" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");}
  function el(id){return document.getElementById(id);}
  function isEmail(v){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);}

  /* ---------- overlay shell ---------- */
  function ensureOverlay() {
    if (el("iqsOv")) return;
    document.head.appendChild(css);
    var ov = document.createElement("div");
    ov.id = "iqsOv"; ov.className = "iqs-ov";
    ov.innerHTML = '<div class="iqs-card" id="iqsCard" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }
  function open(view) { ensureOverlay(); el("iqsOv").classList.add("on"); render(view || (user ? "account" : "signin")); }
  function close() { var o = el("iqsOv"); if (o) o.classList.remove("on"); }

  /* ---------- views ---------- */
  function oauthRow() {
    return '<div class="iqs-div"><i></i><span>' + t("or") + '</span><i></i></div>' +
      '<button class="iqs-oauth" data-oauth="google">' + t("g_google") + '</button>' +
      '<button class="iqs-oauth" data-oauth="github">' + t("g_github") + '</button>';
  }

  function render(view) {
    var c = el("iqsCard");
    if (!CONFIGURED) {
      c.innerHTML = '<button class="iqs-x" data-close>&times;</button><h3>' + svg() + ' IRAQ SHIELD</h3>' +
        '<p class="sub" style="margin-top:10px">' + t("not_setup") + '</p>';
      wire();
      return;
    }
    if (view === "signin") {
      c.innerHTML =
        '<button class="iqs-x" data-close>&times;</button>' +
        '<h3>' + t("signin") + '</h3><p class="sub">' + t("signin_sub") + '</p>' +
        '<div class="iqs-err" id="iqsErr"></div>' +
        '<label>' + t("email") + '</label><input id="iqsEmail" class="ltr" type="email" placeholder="name@iraq-shield.com">' +
        '<label>' + t("pass") + '</label><input id="iqsPass" class="ltr" type="password" placeholder="••••••••">' +
        '<button class="iqs-primary" data-act="signin">' + t("enter") + '</button>' +
        oauthRow() +
        '<button class="iqs-link" data-view="signup">' + t("no") + '</button>';
    } else if (view === "signup") {
      var L = lang();
      c.innerHTML =
        '<button class="iqs-x" data-close>&times;</button>' +
        '<h3>' + t("signup") + '</h3><p class="sub">' + t("signup_sub") + '</p>' +
        '<div class="iqs-err" id="iqsErr"></div>' +
        '<label>' + t("name") + '</label><input id="iqsName" type="text" placeholder="' + (L === "ar" ? "محمد إسماعيل" : "Mohammed Ismael") + '">' +
        '<label>' + t("org") + '</label><select id="iqsOrg">' + T[L].orgs.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join("") + '</select>' +
        '<label>' + t("email") + '</label><input id="iqsEmail" class="ltr" type="email" placeholder="name@iraq-shield.com">' +
        '<label>' + t("pass") + '</label><input id="iqsPass" class="ltr" type="password" placeholder="' + (L === "ar" ? "8 أحرف على الأقل" : "at least 8 characters") + '">' +
        '<button class="iqs-primary" data-act="signup">' + t("create") + '</button>' +
        oauthRow() +
        '<button class="iqs-link" data-view="signin">' + t("have") + '</button>';
    } else if (view === "account") {
      var L2 = lang();
      var nm = (profile && profile.full_name) || (user && user.email) || "";
      var initials = nm.trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase() || "·";
      var org = (profile && profile.org_type) || "";
      var since = user && user.created_at ? new Date(user.created_at).getFullYear() : "";
      var prov = (profile && profile.province) || "";
      c.innerHTML =
        '<button class="iqs-x" data-close>&times;</button>' +
        '<h3>' + t("account") + '</h3>' +
        '<div style="display:flex;align-items:center;gap:12px;margin:14px 0">' +
          '<div class="iqs-av">' + esc(initials) + '</div>' +
          '<div style="flex:1;min-width:0"><div style="color:var(--text,#D5DEEF);font-size:15px">' + esc(nm) + '</div>' +
          '<div style="color:var(--dim,#6E7F9C);font-size:12.5px">' + esc(org) + (since ? ' · ' + t("member") + ' ' + since : '') + '</div></div></div>' +
        '<div class="iqs-ok" id="iqsOk" style="display:none">' + t("saved") + '</div>' +
        '<label>' + t("province") + '</label><select id="iqsProv">' +
          T[L2].provinces.map(function (p) { return '<option' + (p === prov ? ' selected' : '') + '>' + esc(p) + '</option>'; }).join("") + '</select>' +
        '<div style="margin:6px 0 4px;color:var(--text,#D5DEEF);font-size:14px">' + t("prefs") + '</div>' +
        swRow("iqsBreach", t("a_breach"), profile && profile.alert_breach) +
        swRow("iqsWeekly", t("a_weekly"), profile && profile.alert_weekly) +
        swRow("iqsLocal", t("a_local"), profile && profile.alert_local) +
        '<button class="iqs-primary" data-act="save" style="margin-top:14px">' + t("save") + '</button>' +
        '<button class="iqs-link" data-act="signout" style="color:var(--dim,#6E7F9C);margin-top:14px">' + t("signout") + '</button>';
    }
    wire();
  }
  function swRow(id, label, on) {
    return '<div class="iqs-row"><span>' + esc(label) + '</span>' +
      '<label class="iqs-sw"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><span class="tk"></span></label></div>';
  }

  function wire() {
    var c = el("iqsCard");
    c.querySelectorAll("[data-close]").forEach(function (b) { b.onclick = close; });
    c.querySelectorAll("[data-view]").forEach(function (b) { b.onclick = function () { render(b.dataset.view); }; });
    c.querySelectorAll("[data-oauth]").forEach(function (b) { b.onclick = function () { oauth(b.dataset.oauth); }; });
    c.querySelectorAll("[data-act]").forEach(function (b) {
      b.onclick = function () {
        var a = b.dataset.act;
        if (a === "signin") doSignIn();
        else if (a === "signup") doSignUp();
        else if (a === "save") doSave();
        else if (a === "signout") doSignOut();
      };
    });
  }
  function setErr(m) { var e = el("iqsErr"); if (e) e.textContent = m || ""; }

  /* ---------- actions ---------- */
  function doSignIn() {
    var email = el("iqsEmail").value.trim(), pass = el("iqsPass").value;
    if (!isEmail(email)) return setErr(t("bademail"));
    if (pass.length < 8) return setErr(t("badpass"));
    setErr(t("loading"));
    sb.auth.signInWithPassword({ email: email, password: pass }).then(function (r) {
      if (r.error) return setErr(r.error.message);
      /* onAuthStateChange handles the rest */
    });
  }
  function doSignUp() {
    var name = el("iqsName").value.trim(), org = el("iqsOrg").value,
        email = el("iqsEmail").value.trim(), pass = el("iqsPass").value;
    if (!name) return setErr(t("needname"));
    if (!isEmail(email)) return setErr(t("bademail"));
    if (pass.length < 8) return setErr(t("badpass"));
    setErr(t("loading"));
    sb.auth.signUp({
      email: email, password: pass,
      options: { data: { full_name: name, org_type: org }, emailRedirectTo: location.href.split("#")[0] }
    }).then(function (r) {
      if (r.error) return setErr(r.error.message);
      if (r.data && r.data.session) return; /* auto-signed-in */
      var e = el("iqsErr"); if (e) { e.style.color = "var(--green,#34D399)"; e.textContent = t("verify"); }
    });
  }
  function oauth(provider) {
    setErr(t("loading"));
    sb.auth.signInWithOAuth({ provider: provider, options: { redirectTo: location.href.split("#")[0] } })
      .then(function (r) { if (r.error) setErr(r.error.message); });
  }
  function doSignOut() { sb.auth.signOut().then(close); }
  function doSave() {
    if (!user) return;
    var row = {
      id: user.id,
      province: el("iqsProv").value,
      alert_breach: el("iqsBreach").checked,
      alert_weekly: el("iqsWeekly").checked,
      alert_local: el("iqsLocal").checked,
      lang: lang(),
      theme: (document.documentElement.dataset.theme || "dark"),
      updated_at: new Date().toISOString()
    };
    sb.from("profiles").upsert(row).then(function (r) {
      if (r.error) return setErr(r.error.message);
      Object.assign(profile || (profile = {}), row);
      var ok = el("iqsOk"); if (ok) { ok.style.display = "block"; setTimeout(function () { ok.style.display = "none"; }, 1800); }
    });
  }

  /* ---------- header button ---------- */
  function mountButton() {
    var host = document.querySelector(".hdr-meta > div:last-child") || document.querySelector(".hdr-meta");
    if (!host) return;
    var b = document.createElement("button");
    b.id = "iqsAuthBtn"; b.className = "tgl iqs-auth-btn";
    b.onclick = function () { open(user ? "account" : "signin"); };
    var wrap = document.querySelector(".hdr-meta > div:last-child");
    if (wrap && wrap.querySelector("#btnTheme")) wrap.appendChild(b); else host.appendChild(b);
    refreshButton();
  }
  function refreshButton() {
    var b = el("iqsAuthBtn"); if (!b) return;
    if (user) {
      var nm = (profile && profile.full_name) || user.email || "";
      var ini = nm.trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase() || "·";
      b.textContent = ini; b.title = nm;
    } else {
      b.textContent = t("login_btn"); b.title = "";
    }
  }
  window.addEventListener("iqs-lang-change", function () {
    refreshButton();
    var o = el("iqsOv"); if (o && o.classList.contains("on")) render(user ? "account" : "signin");
  });

  /* ---------- load profile ---------- */
  function loadProfile() {
    if (!user) { profile = null; return Promise.resolve(); }
    return sb.from("profiles").select("*").eq("id", user.id).maybeSingle().then(function (r) {
      profile = r.data || { id: user.id };
      refreshButton();
    });
  }

  /* ---------- boot ---------- */
  function loadLib() {
    return new Promise(function (resolve, reject) {
      if (window.supabase && window.supabase.createClient) return resolve();
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  function boot() {
    mountButton();
    if (!CONFIGURED) return;
    loadLib().then(function () {
      sb = window.supabase.createClient(CFG.url, CFG.anonKey);
      window.IQS_AUTH = { open: open, close: close, client: function () { return sb; }, user: function () { return user; } };
      sb.auth.getUser().then(function (r) {
        user = (r.data && r.data.user) || null;
        loadProfile();
      });
      sb.auth.onAuthStateChange(function (_evt, session) {
        user = (session && session.user) || null;
        loadProfile().then(function () {
          refreshButton();
          var o = el("iqsOv");
          if (o && o.classList.contains("on")) render(user ? "account" : "signin");
        });
      });
    }).catch(function () { /* library failed to load; button still opens config notice */ });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
