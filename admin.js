/* ============================================================
   IRAQ SHIELD — لوحة الأدمن / Admin dashboard
   يُحمَّل بعد auth.js. يظهر زر «الأدمن» فقط لحسابات role=admin.
   Loaded after auth.js. The "Admin" button shows only for role=admin accounts.
   ============================================================ */
(function () {
  "use strict";

  function lang() { try { return localStorage.getItem("iqs-lang") || "ar"; } catch (e) { return "ar"; } }
  var T = {
    ar: {
      nav: "الأدمن", title: "لوحة الإدارة",
      total: "إجمالي المستخدمين", admins: "المشرفون", week: "تسجيلات هذا الأسبوع", provinces: "محافظات ممثّلة",
      by_org: "حسب الجهة", by_prov: "حسب المحافظة",
      users: "المستخدمون", th_name: "الاسم", th_email: "البريد", th_org: "الجهة", th_prov: "المحافظة",
      th_role: "الصلاحية", th_joined: "انضم", th_act: "إجراء",
      make_admin: "ترقية لأدمن", make_user: "إلغاء الأدمن", del: "حذف",
      confirm_del: "حذف هذا المستخدم نهائيًا؟", none: "لا مستخدمون بعد.",
      refresh: "تحديث", export: "تصدير CSV", loading: "جارٍ التحميل…",
      you: "أنت", r_admin: "أدمن", r_user: "مستخدم",
      denied: "هذه اللوحة للمشرفين فقط.", close: "إغلاق"
    },
    en: {
      nav: "Admin", title: "Admin dashboard",
      total: "Total users", admins: "Admins", week: "Signups this week", provinces: "Provinces represented",
      by_org: "By organisation", by_prov: "By province",
      users: "Users", th_name: "Name", th_email: "Email", th_org: "Organisation", th_prov: "Province",
      th_role: "Role", th_joined: "Joined", th_act: "Action",
      make_admin: "Make admin", make_user: "Revoke admin", del: "Delete",
      confirm_del: "Permanently delete this user?", none: "No users yet.",
      refresh: "Refresh", export: "Export CSV", loading: "Loading…",
      you: "you", r_admin: "admin", r_user: "user",
      denied: "This dashboard is for admins only.", close: "Close"
    }
  };
  function t(k) { var L = lang(); return (T[L] && T[L][k] !== undefined) ? T[L][k] : k; }

  var css = document.createElement("style");
  css.textContent = [
    "body.admin-on main,body.admin-on .incidents,body.admin-on .acad{display:none!important}",
    ".adm{display:none;background:var(--panel,#0B1424);border:1px solid var(--line,#18263F);min-height:0;overflow:auto;flex-direction:column;padding:16px 18px;box-sizing:border-box}",
    ".adm *{box-sizing:border-box}",
    "body.admin-on .adm{display:flex}",
    "body.admin-on .app{grid-template-rows:56px 1fr}",
    ".adm h2{font-size:16px;color:var(--text,#D5DEEF);font-weight:600;margin:0 0 14px}",
    ".adm-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:16px;width:100%}",
    ".adm-stat{background:var(--panel2,#0F1B30);border-radius:8px;padding:14px}",
    ".adm-stat small{display:block;color:var(--dim,#6E7F9C);font-size:12px;margin-bottom:6px}",
    ".adm-stat b{font-size:24px;color:var(--cyan,#22D3EE);font-family:var(--mono,monospace)}",
    ".adm-charts{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin-bottom:16px;width:100%}",
    "@media(max-width:800px){.adm-charts{grid-template-columns:1fr}}",
    ".adm-chart{background:var(--panel2,#0F1B30);border-radius:8px;padding:14px}",
    ".adm-chart h3{font-size:13px;color:var(--dim,#6E7F9C);font-weight:500;margin:0 0 12px}",
    ".bar-row{display:grid;grid-template-columns:110px 1fr 34px;align-items:center;gap:8px;margin-bottom:8px;font-size:12.5px;color:var(--text,#D5DEEF)}",
    ".bar-track{height:8px;background:var(--faint,#33445F);border-radius:4px;overflow:hidden;position:relative}",
    ".bar-fill{position:absolute;inset:0 auto 0 0;background:var(--cyan,#22D3EE);border-radius:4px}",
    ".bar-n{color:var(--dim,#6E7F9C);font-family:var(--mono,monospace);text-align:end}",
    ".adm-toolbar{display:flex;gap:8px;align-items:center;margin-bottom:10px}",
    ".adm-toolbar h3{flex:1;font-size:14px;color:var(--text,#D5DEEF);margin:0;font-weight:500}",
    ".adm-btn{background:var(--panel2,#0F1B30);color:var(--text,#D5DEEF);border:1px solid var(--line,#18263F);padding:6px 12px;border-radius:6px;font-size:12.5px;cursor:pointer;font-family:inherit}",
    ".adm-btn:hover{border-color:var(--cyan,#22D3EE)}",
    ".adm-table-wrap{overflow:auto;border:1px solid var(--line,#18263F);border-radius:8px}",
    ".adm-table{width:100%;border-collapse:collapse;font-size:12.5px}",
    ".adm-table th{position:sticky;top:0;background:var(--panel2,#0F1B30);color:var(--dim,#6E7F9C);text-align:start;padding:9px 12px;border-bottom:1px solid var(--line,#18263F);font-weight:500;white-space:nowrap}",
    ".adm-table td{padding:8px 12px;border-bottom:1px solid var(--line,#18263F);color:var(--text,#D5DEEF);white-space:nowrap}",
    ".adm-table tr:hover td{background:rgba(34,211,238,.05)}",
    ".rp{font-size:11px;padding:2px 8px;border-radius:6px;border:1px solid}",
    ".rp.admin{color:var(--amber,#FBBF24);border-color:var(--amber,#FBBF24)}",
    ".rp.user{color:var(--dim,#6E7F9C);border-color:var(--line,#18263F)}",
    ".adm-act{display:flex;gap:6px}",
    ".adm-act button{background:none;border:1px solid var(--line,#18263F);color:var(--dim,#6E7F9C);border-radius:5px;padding:3px 8px;font-size:11.5px;cursor:pointer;font-family:inherit}",
    ".adm-act button:hover{border-color:var(--cyan,#22D3EE);color:var(--cyan,#22D3EE)}",
    ".adm-act button.del:hover{border-color:var(--red,#F43F5E);color:var(--red,#F43F5E)}",
    ".adm-empty{padding:30px;text-align:center;color:var(--dim,#6E7F9C);font-size:13px}"
  ].join("\n");

  var sb = null, me = null, mounted = false;

  function orgLabel(v) { return v || (lang() === "ar" ? "غير محدد" : "Unspecified"); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function el(id) { return document.getElementById(id); }

  function mountButton() {
    if (el("iqsAdminBtn")) return;
    var wrap = document.querySelector(".hdr-meta > div:last-child");
    if (!wrap) return;
    document.head.appendChild(css);
    var sec = document.createElement("section");
    sec.className = "adm"; sec.id = "admView";
    document.querySelector(".app").insertBefore(sec, document.querySelector(".incidents"));
    var b = document.createElement("button");
    b.id = "iqsAdminBtn"; b.className = "tgl"; b.textContent = t("nav");
    b.style.display = "none";
    b.onclick = function () { showAdmin(); };
    var themeBtn = el("btnTheme");
    wrap.insertBefore(b, themeBtn || null);
    mounted = true;
  }

  function showAdmin() {
    document.body.classList.add("admin-on");
    setActive("iqsAdminBtn");
    load();
  }
  function setActive(id) {
    ["navSoc", "navAcad", "iqsAdminBtn"].forEach(function (x) {
      var b = el(x); if (b) b.classList.toggle("active", x === id);
    });
  }
  /* leaving admin: hook the existing dashboard/academy buttons */
  function wireExit() {
    var s = el("navSoc"), a = el("navAcad");
    if (s) s.addEventListener("click", function () { document.body.classList.remove("admin-on"); });
    if (a) a.addEventListener("click", function () { document.body.classList.remove("admin-on"); });
  }

  function bars(counts, host) {
    var entries = Object.keys(counts).map(function (k) { return [k, counts[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8);
    var max = Math.max.apply(null, entries.map(function (e) { return e[1]; }).concat([1]));
    host.innerHTML = entries.map(function (e) {
      return '<div class="bar-row"><span>' + esc(e[0]) + '</span><div class="bar-track"><div class="bar-fill" style="width:' + Math.round(e[1] / max * 100) + '%"></div></div><span class="bar-n">' + e[1] + '</span></div>';
    }).join("") || '<div class="adm-empty">—</div>';
  }

  function render(rows) {
    var L = lang();
    var total = rows.length;
    var admins = rows.filter(function (r) { return r.role === "admin"; }).length;
    var weekAgo = Date.now() - 7 * 864e5;
    var week = rows.filter(function (r) { return r.created_at && new Date(r.created_at).getTime() > weekAgo; }).length;
    var provSet = {}, orgCount = {}, provCount = {};
    rows.forEach(function (r) {
      if (r.province) provSet[r.province] = 1;
      var o = orgLabel(r.org_type); orgCount[o] = (orgCount[o] || 0) + 1;
      var p = r.province || (L === "ar" ? "غير محددة" : "Unset"); provCount[p] = (provCount[p] || 0) + 1;
    });

    var host = el("admView");
    host.innerHTML =
      '<h2>' + t("title") + '</h2>' +
      '<div class="adm-stats">' +
        stat(t("total"), total) + stat(t("admins"), admins) + stat(t("week"), week) + stat(t("provinces"), Object.keys(provSet).length) +
      '</div>' +
      '<div class="adm-charts">' +
        '<div class="adm-chart"><h3>' + t("by_org") + '</h3><div id="admOrg"></div></div>' +
        '<div class="adm-chart"><h3>' + t("by_prov") + '</h3><div id="admProv"></div></div>' +
      '</div>' +
      '<div class="adm-toolbar"><h3>' + t("users") + '</h3>' +
        '<button class="adm-btn" id="admRefresh">' + t("refresh") + '</button>' +
        '<button class="adm-btn" id="admExport">' + t("export") + '</button></div>' +
      '<div class="adm-table-wrap"><table class="adm-table"><thead><tr>' +
        '<th>' + t("th_name") + '</th><th>' + t("th_org") + '</th><th>' + t("th_prov") + '</th>' +
        '<th>' + t("th_role") + '</th><th>' + t("th_joined") + '</th><th>' + t("th_act") + '</th>' +
      '</tr></thead><tbody id="admRows"></tbody></table></div>';

    bars(orgCount, el("admOrg"));
    bars(provCount, el("admProv"));

    var tb = el("admRows");
    if (!rows.length) { tb.innerHTML = '<tr><td colspan="6"><div class="adm-empty">' + t("none") + '</div></td></tr>'; }
    else {
      tb.innerHTML = rows.map(function (r) {
        var mine = me && r.id === me.id;
        var joined = r.created_at ? new Date(r.created_at).toLocaleDateString(L === "ar" ? "ar" : "en-GB") : "—";
        var roleTxt = r.role === "admin" ? t("r_admin") : t("r_user");
        var act = mine ? '<span style="color:var(--dim,#6E7F9C);font-size:11px">' + t("you") + '</span>' :
          '<div class="adm-act">' +
            '<button data-role="' + r.id + '" data-to="' + (r.role === "admin" ? "user" : "admin") + '">' + (r.role === "admin" ? t("make_user") : t("make_admin")) + '</button>' +
            '<button class="del" data-del="' + r.id + '">' + t("del") + '</button>' +
          '</div>';
        return '<tr><td>' + esc(r.full_name || "—") + '</td><td>' + esc(orgLabel(r.org_type)) + '</td>' +
          '<td>' + esc(r.province || "—") + '</td>' +
          '<td><span class="rp ' + (r.role === "admin" ? "admin" : "user") + '">' + roleTxt + '</span></td>' +
          '<td>' + joined + '</td><td>' + act + '</td></tr>';
      }).join("");
    }

    el("admRefresh").onclick = load;
    el("admExport").onclick = function () { exportCsv(rows); };
    tb.querySelectorAll("[data-role]").forEach(function (b) {
      b.onclick = function () { setRole(b.dataset.role, b.dataset.to); };
    });
    tb.querySelectorAll("[data-del]").forEach(function (b) {
      b.onclick = function () { if (confirm(t("confirm_del"))) delUser(b.dataset.del); };
    });
  }
  function stat(label, n) {
    return '<div class="adm-stat"><small>' + label + '</small><b>' + n + '</b></div>';
  }

  function load() {
    if (!sb) return;
    var host = el("admView");
    if (host && !host.querySelector(".adm-table")) host.innerHTML = '<div class="adm-empty">' + t("loading") + '</div>';
    sb.from("profiles").select("*").order("created_at", { ascending: false }).then(function (r) {
      if (r.error) { host.innerHTML = '<div class="adm-empty">' + esc(r.error.message) + '</div>'; return; }
      render(r.data || []);
    });
  }
  function setRole(id, to) {
    sb.from("profiles").update({ role: to }).eq("id", id).then(function (r) { if (!r.error) load(); else alert(r.error.message); });
  }
  function delUser(id) {
    sb.from("profiles").delete().eq("id", id).then(function (r) { if (!r.error) load(); else alert(r.error.message); });
  }
  function exportCsv(rows) {
    var head = ["name", "org", "province", "role", "joined"];
    var lines = [head.join(",")].concat(rows.map(function (r) {
      return [r.full_name, r.org_type, r.province, r.role, r.created_at].map(function (v) {
        return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
      }).join(",");
    }));
    var blob = new Blob([lines.join("\n")], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "iraq-shield-users.csv"; a.click();
  }

  /* re-render on language change while admin view open */
  window.addEventListener("iqs-lang-change", function () {
    var b = el("iqsAdminBtn"); if (b) b.textContent = t("nav");
    if (document.body.classList.contains("admin-on")) load();
  });

  /* poll for auth readiness, then reveal button for admins */
  function boot() {
    mountButton();
    wireExit();
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (window.IQS_AUTH && window.IQS_AUTH.client && window.IQS_AUTH.client()) {
        sb = window.IQS_AUTH.client();
        checkAdmin();
      }
      if (tries > 40) clearInterval(iv);
    }, 500);
  }
  function checkAdmin() {
    var u = window.IQS_AUTH.user && window.IQS_AUTH.user();
    me = u || null;
    if (!u) { hideBtn(); return; }
    sb.from("profiles").select("role").eq("id", u.id).maybeSingle().then(function (r) {
      var isAdmin = r.data && r.data.role === "admin";
      var b = el("iqsAdminBtn");
      if (b) b.style.display = isAdmin ? "" : "none";
      if (!isAdmin && document.body.classList.contains("admin-on")) {
        document.body.classList.remove("admin-on");
      }
    });
  }
  function hideBtn() { var b = el("iqsAdminBtn"); if (b) b.style.display = "none"; }

  /* re-check admin whenever auth state changes (login/logout) */
  var lastUser = null;
  setInterval(function () {
    if (!window.IQS_AUTH || !window.IQS_AUTH.user) return;
    var u = window.IQS_AUTH.user();
    var uid = u ? u.id : null;
    if (uid !== lastUser) { lastUser = uid; if (sb) checkAdmin(); }
  }, 1500);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
