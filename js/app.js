(() => {
  "use strict";

  const STORAGE_KEYS = {
    onboarded: "am_onboarded",
    records: "am_records"
  };

  const MONTHS_ID = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const WA_NUMBER = "6285701576427"; // ganti sesuai nomor komunitas ArvianMotor

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.records);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRecords(records) {
    localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatDateParts(iso) {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return { day: "--", mon: "" };
    return { day: String(d.getDate()).padStart(2, "0"), mon: MONTHS_ID[d.getMonth()] };
  }

  function formatDateLong(iso) {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
  }

  function showToast(msg) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  // ---------- Router ----------
  const views = $$(".view");
  const navItems = $$(".nav-item");

  function parseHash() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [path, query] = hash.split("?");
    const params = new URLSearchParams(query || "");
    return { path: path || "splash", params };
  }

  function setActiveNav(path) {
    navItems.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.route === path);
    });
  }

  function render() {
    const { path, params } = parseHash();
    const onboarded = localStorage.getItem(STORAGE_KEYS.onboarded) === "1";

    let target = path;
    if (!onboarded && path !== "splash") target = "splash";
    if (onboarded && path === "splash") target = "home";

    views.forEach((v) => v.classList.toggle("is-active", v.id === `view-${target}`));
    document.querySelector(".bottom-nav")?.classList.toggle("is-hidden", target === "splash");
    setActiveNav(target);

    if (target === "home") renderHome();
    if (target === "records") {
      renderRecords();
      if (params.get("add") === "1") openRecordModal();
    }
    if (target === "fi-codes") renderFiCodes();

    window.scrollTo(0, 0);
  }

  function goTo(path) {
    location.hash = `#/${path}`;
  }

  window.addEventListener("hashchange", render);

  // ---------- Splash ----------
  $("#btn-get-start").addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEYS.onboarded, "1");
    goTo("home");
  });

  // ---------- Home ----------
  function renderHome() {
    const records = loadRecords();
    $("#stat-total-records").textContent = records.length;

    const lastOil = records
      .filter((r) => r.type === "oli-mesin")
      .sort((a, b) => (b.date > a.date ? 1 : -1))[0];

    $("#stat-last-service").textContent = records.length
      ? formatDateLong(records.sort((a, b) => (b.date > a.date ? 1 : -1))[0].date)
      : "-";

    const banner = $("#home-reminder");
    if (lastOil && typeof lastOil.km === "number") {
      const latestKm = Math.max(...records.filter(r => typeof r.km === "number").map(r => r.km), lastOil.km);
      const dueIn = lastOil.km + 2000 - latestKm;
      if (dueIn <= 300) {
        banner.style.display = "flex";
        $("#home-reminder-text").textContent = dueIn <= 0
          ? `Sudah lewat ${Math.abs(dueIn)} km dari jadwal ganti oli terakhir.`
          : `Perkiraan ${dueIn} km lagi menuju jadwal ganti oli.`;
      } else {
        banner.style.display = "none";
      }
    } else {
      banner.style.display = "none";
    }
  }

  $$("[data-nav]").forEach((el) => el.addEventListener("click", () => goTo(el.dataset.nav)));

  // ---------- Records ----------
  const recordModal = $("#record-modal");
  const recordForm = $("#record-form");

  function typeLabel(id) {
    const t = SERVICE_TYPES.find((s) => s.id === id);
    return t ? t.label : "Servis";
  }

  function renderRecords() {
    const list = $("#records-list");
    const empty = $("#records-empty");
    const records = loadRecords().sort((a, b) => (b.date > a.date ? 1 : -1));

    list.innerHTML = "";
    empty.style.display = records.length ? "none" : "flex";

    records.forEach((r) => {
      const { day, mon } = formatDateParts(r.date);
      const item = document.createElement("div");
      item.className = "record-item";
      item.innerHTML = `
        <div class="record-date"><div class="day">${day}</div><div class="mon">${mon}</div></div>
        <div class="record-main">
          <p class="record-type">${typeLabel(r.type)}</p>
          <p class="record-meta">${r.km ? r.km.toLocaleString("id-ID") + " km" : "Km tidak dicatat"}</p>
          ${r.note ? `<p class="record-note">${escapeHtml(r.note)}</p>` : ""}
        </div>
        <button class="record-delete" data-id="${r.id}" aria-label="Hapus catatan">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"/></svg>
        </button>`;
      list.appendChild(item);
    });

    $$(".record-delete", list).forEach((btn) => {
      btn.addEventListener("click", () => {
        const remaining = loadRecords().filter((r) => r.id !== btn.dataset.id);
        saveRecords(remaining);
        renderRecords();
        renderHome();
        showToast("Catatan dihapus");
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function openRecordModal() {
    recordForm.reset();
    $("#field-date").value = new Date().toISOString().slice(0, 10);
    recordModal.classList.add("is-open");
  }

  function closeRecordModal() {
    recordModal.classList.remove("is-open");
    if (parseHash().params.get("add") === "1") history.replaceState(null, "", "#/records");
  }

  $("#btn-add-record").addEventListener("click", openRecordModal);
  $("#modal-close").addEventListener("click", closeRecordModal);
  $("#modal-cancel").addEventListener("click", closeRecordModal);
  recordModal.addEventListener("click", (e) => { if (e.target === recordModal) closeRecordModal(); });

  // populate service type select
  const typeSelect = $("#field-type");
  SERVICE_TYPES.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.label;
    typeSelect.appendChild(opt);
  });

  recordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const records = loadRecords();
    records.push({
      id: uid(),
      date: $("#field-date").value,
      type: $("#field-type").value,
      km: $("#field-km").value ? Number($("#field-km").value) : null,
      note: $("#field-note").value.trim()
    });
    saveRecords(records);
    closeRecordModal();
    renderRecords();
    renderHome();
    showToast("Catatan servis tersimpan");
  });

  // ---------- FI Codes ----------
  function renderFiCodes(filter = "") {
    const list = $("#fi-list");
    const q = filter.trim().toLowerCase();
    const data = FI_CODES.filter((c) =>
      !q || String(c.code).includes(q) || c.component.toLowerCase().includes(q) || c.long.toLowerCase().includes(q)
    );

    list.innerHTML = "";
    if (!data.length) {
      list.innerHTML = `<p style="text-align:center;color:var(--muted);font-size:13px;margin-top:24px;">Kode tidak ditemukan.</p>`;
      return;
    }

    data.forEach((c) => {
      const item = document.createElement("div");
      item.className = "fi-item";
      item.innerHTML = `
        <button class="fi-item-head">
          <span class="fi-code-badge">${c.code}</span>
          <p class="fi-comp">${c.component} <span style="color:var(--muted); font-weight:400;">— ${c.long}</span></p>
          <svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="fi-item-body"><div class="fi-item-body-inner">
          <div class="row"><p class="label">Indikasi</p><p class="val">${c.indication}</p></div>
          <div class="row"><p class="label">Efek ke motor</p><p class="val">${c.effect}</p></div>
          <div class="row"><p class="label">Saran tindakan</p><p class="val">${c.action}</p></div>
        </div></div>`;
      item.querySelector(".fi-item-head").addEventListener("click", () => {
        const wasOpen = item.classList.contains("is-open");
        $$(".fi-item.is-open", list).forEach((el) => el.classList.remove("is-open"));
        if (!wasOpen) item.classList.add("is-open");
      });
      list.appendChild(item);
    });
  }

  $("#fi-search").addEventListener("input", (e) => renderFiCodes(e.target.value));

  // ---------- Community ----------
  $("#btn-join-whatsapp").addEventListener("click", () => {
    const text = encodeURIComponent("Halo ArvianMotor, saya mau join komunitas WhatsApp.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
  });

  // ---------- Install prompt (Add to Home Screen) ----------
  let deferredPrompt = null;
  const installBanner = $("#install-banner");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (localStorage.getItem(STORAGE_KEYS.onboarded) === "1") {
      installBanner.classList.add("is-visible");
    }
  });

  $("#install-confirm").addEventListener("click", async () => {
    installBanner.classList.remove("is-visible");
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });

  $("#install-dismiss").addEventListener("click", () => {
    installBanner.classList.remove("is-visible");
  });

  window.addEventListener("appinstalled", () => {
    installBanner.classList.remove("is-visible");
    showToast("ArvianMotor terpasang di perangkat");
  });

  // ---------- Offline indicator ----------
  function updateOnlineStatus() {
    document.body.classList.toggle("is-offline", !navigator.onLine);
  }
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();

  // ---------- Service worker ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    });
  }

  // ---------- Init ----------
  render();
})();
