// MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com
/**
 * workbook.js - canonical localStorage capture + paste-back JS
 * Inlined into workbook.html.template at {{WORKBOOK_JS}}
 * Storage key parameterized by {{STORAGE_KEY}} at render time.
 */

(function () {
  var STORAGE_KEY = '{{STORAGE_KEY}}';
  var decisions = [];

  /* Load persisted state */
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) decisions = JSON.parse(stored);
  } catch (e) {}

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions)); } catch (e) {}
  }

  /* -------------------------------------------------------------------------
   * FULL FORM-STATE PERSISTENCE: nothing typed
   * may go unsent). Every radio/checkbox/textarea value is mirrored to
   * localStorage on input, restored on load, and the CURRENT paste-back
   * markdown is continuously persisted so capture tooling reading
   * localStorage always sees the live state — no button click required.
   * ------------------------------------------------------------------------- */
  var STATE_KEY = STORAGE_KEY + ':state';
  var PASTEBACK_KEY = STORAGE_KEY + ':pasteback';
  var LASTSENT_KEY = STORAGE_KEY + ':lastsent';

  function saveState() {
    try {
      var state = { radios: {}, checks: {}, texts: {} };
      document.querySelectorAll('input[type=radio]:checked').forEach(function (r) {
        if (r.name) state.radios[r.name] = r.value;
      });
      document.querySelectorAll('input[type=checkbox]').forEach(function (c) {
        if (c.name) state.checks[c.name + '::' + c.value] = c.checked;
      });
      document.querySelectorAll('textarea').forEach(function (ta) {
        if (ta.name) state.texts[ta.name] = ta.value;
      });
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      /* auto-persist the live paste-back so nothing is ever "unsent" to capture tooling */
      localStorage.setItem(PASTEBACK_KEY, window.generatePasteback ? generatePasteback() : '');
    } catch (e) {}
  }

  function restoreState() {
    var state;
    try { state = JSON.parse(localStorage.getItem(STATE_KEY) || 'null'); } catch (e) {}
    if (!state) return;
    document.querySelectorAll('input[type=radio]').forEach(function (r) {
      if (r.name && state.radios && state.radios[r.name] !== undefined) {
        r.checked = (state.radios[r.name] === r.value);
      }
    });
    document.querySelectorAll('input[type=checkbox]').forEach(function (c) {
      if (c.name && state.checks && state.checks[c.name + '::' + c.value] !== undefined) {
        c.checked = state.checks[c.name + '::' + c.value];
      }
    });
    document.querySelectorAll('textarea').forEach(function (ta) {
      if (ta.name && state.texts && state.texts[ta.name] !== undefined && !ta.value) {
        ta.value = state.texts[ta.name];
      }
    });
  }

  /* Normalize paste-back for sent/unsent comparison (drop the timestamp header) */
  function normalizeMd(md) {
    return String(md || '').split('\n').filter(function (l) { return l.indexOf('## ') !== 0; }).join('\n');
  }

  function markSent(md) {
    try { localStorage.setItem(LASTSENT_KEY, normalizeMd(md)); } catch (e) {}
    updateUnsentBanner();
  }

  function updateUnsentBanner() {
    var banner = document.getElementById('unsent-banner');
    if (!banner) return;
    var lastSent = '';
    try { lastSent = localStorage.getItem(LASTSENT_KEY) || ''; } catch (e) {}
    var current = normalizeMd(generatePasteback());
    var dirty = decisions.length > 0 || hasAnyInput();
    banner.style.display = (dirty && current !== lastSent) ? 'block' : 'none';
  }

  function hasAnyInput() {
    var any = false;
    document.querySelectorAll('input[type=radio]:checked, input[type=checkbox]:checked').forEach(function () { any = true; });
    document.querySelectorAll('textarea').forEach(function (ta) { if (ta.value.trim()) any = true; });
    return any;
  }

  function escH(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* Capture helper */
  window.captureDecision = function (questionId, action, value) {
    decisions.push({
      captured_at: new Date().toISOString(),
      question_id: questionId,
      action: action,
      value: value
    });
    save();
    renderLog();
    updateProgress();
  };

  /* Render log panel using DOM methods (no innerHTML with user content) */
  function renderLog() {
    var list = document.getElementById('decision-log-list');
    var count = document.getElementById('decision-count');
    if (!list) return;
    if (count) count.textContent = String(decisions.length);

    /* clear safely */
    while (list.firstChild) list.removeChild(list.firstChild);

    if (decisions.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'log-empty';
      empty.textContent = 'No decisions captured yet.';
      list.appendChild(empty);
      return;
    }

    var recent = decisions.slice(-12).reverse();
    recent.forEach(function (d) {
      var t = d.captured_at ? d.captured_at.slice(11, 19) : '';
      var val = typeof d.value === 'object' ? JSON.stringify(d.value) : String(d.value || '');
      if (val.length > 80) val = val.slice(0, 80) + '...';

      var li = document.createElement('li');
      li.className = 'log-entry';

      var tSpan = document.createElement('span');
      tSpan.className = 'log-entry-time';
      tSpan.textContent = t;

      var qSpan = document.createElement('span');
      qSpan.className = 'log-entry-q';
      qSpan.textContent = d.question_id + ' ';

      var aSpan = document.createElement('span');
      aSpan.className = 'log-entry-action';
      aSpan.textContent = d.action + ': ' + val;

      li.appendChild(tSpan);
      li.appendChild(qSpan);
      li.appendChild(aSpan);
      list.appendChild(li);
    });
  }

  /* Progress meter */
  window.updateProgress = function () {
    var countEl = document.querySelector('[data-question-count]');
    var total = countEl ? parseInt(countEl.getAttribute('data-question-count'), 10) : 0;
    if (!total) return;
    var answered = new Set(decisions.map(function (d) { return d.question_id; })).size;
    var pct = Math.round((answered / total) * 100);
    var fill = document.getElementById('progress-fill');
    var pctEl = document.getElementById('progress-pct');
    var progCount = document.getElementById('progress-count');
    if (fill) fill.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    if (progCount) progCount.textContent = answered + ' of ' + total;
    /* mark TOC links done */
    var answered_ids = new Set(decisions.map(function (d) { return d.question_id; }));
    answered_ids.forEach(function (qid) {
      var link = document.getElementById('toc-' + qid);
      if (link) link.classList.add('done');
    });
  };

  /* Generate paste-back markdown */
  window.generatePasteback = function () {
    var title = document.title || 'Workbook';
    var ts = new Date().toISOString().slice(0, 19).replace('T', ' ');

    /* -----------------------------------------------------------------------
     * SECTION 1: Current state — read live DOM, not just the log.
     * Covers defaults that were never clicked (no change event fired).
     * ----------------------------------------------------------------------- */

    /* Build a set of question IDs that had at least one explicit click/change */
    var clickedQuestions = new Set(decisions.map(function (d) { return d.question_id; }));

    /* Collect per-radio-group: name → { checked value, recommended value, section id } */
    var radioGroups = {};
    document.querySelectorAll('input[type=radio]').forEach(function (r) {
      if (!radioGroups[r.name]) {
        var sec = r.closest('section');
        radioGroups[r.name] = { qid: sec ? sec.id : r.name, checked: null, recommended: null };
      }
      if (r.checked) radioGroups[r.name].checked = r.value;
      if (r.getAttribute('data-recommended') === '1') radioGroups[r.name].recommended = r.value;
    });

    /* Collect per-checkbox: name+value → { checked, qid } */
    var checkboxItems = [];
    document.querySelectorAll('input[type=checkbox]').forEach(function (c) {
      var sec = c.closest('section');
      checkboxItems.push({ name: c.name, value: c.value, checked: c.checked, qid: sec ? sec.id : c.name });
    });

    var summaryLines = ['### Current answers', ''];

    /* Radio groups */
    Object.keys(radioGroups).forEach(function (name) {
      var g = radioGroups[name];
      if (g.checked === null) {
        /* No option is checked — fall back to recommended if available */
        if (g.recommended !== null) {
          summaryLines.push('- **' + g.qid + '** (`' + name + '`): `' + g.recommended + '` (default — agreed by no-click)');
        } else {
          summaryLines.push('- **' + g.qid + '** (`' + name + '`): *(not answered)*');
        }
      } else {
        var wasClicked = clickedQuestions.has(g.qid);
        var marker = wasClicked ? '(clicked)' : '(default — agreed by no-click)';
        summaryLines.push('- **' + g.qid + '** (`' + name + '`): `' + g.checked + '` ' + marker);
      }
    });

    /* Checkboxes grouped by question section */
    var cbByQ = {};
    checkboxItems.forEach(function (c) {
      if (!cbByQ[c.qid]) cbByQ[c.qid] = [];
      cbByQ[c.qid].push(c);
    });
    Object.keys(cbByQ).forEach(function (qid) {
      var checked = cbByQ[qid].filter(function (c) { return c.checked; });
      var wasClicked = clickedQuestions.has(qid);
      if (checked.length === 0) {
        summaryLines.push('- **' + qid + '** (checkbox): *(none selected)*');
      } else {
        var vals = checked.map(function (c) { return '`' + c.value + '`'; }).join(', ');
        var marker = wasClicked ? '(clicked)' : '(default — agreed by no-click)';
        summaryLines.push('- **' + qid + '** (checkbox): ' + vals + ' ' + marker);
      }
    });

    /* Textarea _choice fields (open-response questions) */
    document.querySelectorAll('textarea[name$="_choice"]').forEach(function (ta) {
      if (ta.value.trim()) {
        var sec = ta.closest('section');
        var qid = sec ? sec.id : ta.name;
        summaryLines.push('- **' + qid + '** (open): ' + ta.value.trim().slice(0, 120));
      }
    });

    /* -----------------------------------------------------------------------
     * SECTION 2: Timestamp event log (original table, unchanged)
     * ----------------------------------------------------------------------- */
    var tableLines = [
      '',
      '### Decision log (click events only)',
      '',
      '| Time | Question | Action | Value |',
      '|---|---|---|---|'
    ];
    if (decisions.length === 0) {
      tableLines.push('| — | — | — | *(no clicks recorded — see current answers above)* |');
    } else {
      decisions.forEach(function (d) {
        var t = d.captured_at ? d.captured_at.slice(11, 19) : '';
        var val = typeof d.value === 'object' ? JSON.stringify(d.value) : String(d.value || '');
        tableLines.push('| ' + t + ' | ' + d.question_id + ' | ' + d.action + ' | `' + val.replace(/\|/g, '\\|') + '` |');
      });
    }

    var lines = [
      '## ' + title + ' — Decisions ' + ts,
      ''
    ].concat(summaryLines).concat(tableLines);

    /* collect ask-back textareas */
    var askbacks = document.querySelectorAll('[name$="_askback"]');
    var hasAskback = false;
    askbacks.forEach(function (ta) { if (ta.value.trim()) hasAskback = true; });
    if (hasAskback) {
      lines.push('', '### Ask-back questions', '');
      askbacks.forEach(function (ta) {
        if (ta.value.trim()) {
          lines.push('**' + ta.name.replace('_askback', '') + ':** ' + ta.value.trim());
        }
      });
    }

    /* collect notes textareas */
    var notesEls = document.querySelectorAll('[name$="_notes"]');
    var hasNotes = false;
    notesEls.forEach(function (ta) { if (ta.value.trim()) hasNotes = true; });
    if (hasNotes) {
      lines.push('', '### Notes', '');
      notesEls.forEach(function (ta) {
        if (ta.value.trim()) {
          lines.push('**' + ta.name.replace('_notes', '') + ':** ' + ta.value.trim());
        }
      });
    }
    return lines.join('\n');
  };

  /* Clear log */
  window.clearLog = function () {
    decisions = [];
    save();
    renderLog();
    updateProgress();
    var out = document.getElementById('pasteback-out');
    if (out) { out.style.display = 'none'; out.textContent = ''; }
  };

  /* Wire buttons and inputs on DOMContentLoaded */
  document.addEventListener('DOMContentLoaded', function () {
    restoreState();
    renderLog();
    updateProgress();

    /* Unsent-changes banner (created here so older templates inherit it) */
    var banner = document.createElement('div');
    banner.id = 'unsent-banner';
    banner.setAttribute('role', 'status');
    banner.style.cssText = 'display:none;position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:9999;background:#F59E0B;color:#1C1917;font-weight:600;font-size:13px;padding:10px 18px;border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,.45);cursor:pointer;';
    banner.textContent = 'UNSENT input on this page — click here to copy the current paste-back';
    banner.addEventListener('click', function () {
      var copyBtn = document.getElementById('copy-pasteback-btn');
      if (copyBtn) { copyBtn.click(); copyBtn.scrollIntoView({ block: 'center' }); }
    });
    document.body.appendChild(banner);

    /* Live paste-back: keep the visible output current on any change */
    function refreshPastebackPanel() {
      var out = document.getElementById('pasteback-out');
      if (out && out.style.display === 'block') out.textContent = generatePasteback();
    }
    var stateTimer = null;
    window.stateChanged = function () {
      if (stateTimer) clearTimeout(stateTimer);
      stateTimer = setTimeout(function () {
        saveState();
        refreshPastebackPanel();
        updateUnsentBanner();
      }, 400);
    };

    var genBtn = document.getElementById('gen-pasteback-btn');
    if (genBtn) {
      genBtn.addEventListener('click', function () {
        var md = generatePasteback();
        var out = document.getElementById('pasteback-out');
        if (out) { out.textContent = md; out.style.display = 'block'; }
      });
    }

    var copyBtn = document.getElementById('copy-pasteback-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var md = generatePasteback();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(md).then(function () {
            copyBtn.textContent = 'Copied!';
            setTimeout(function () { copyBtn.textContent = 'Copy to clipboard'; }, 1800);
          });
        } else {
          var ta = document.createElement('textarea');
          ta.value = md;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copyBtn.textContent = 'Copied!';
          setTimeout(function () { copyBtn.textContent = 'Copy to clipboard'; }, 1800);
        }
        markSent(md);
      });
    }

    var clearBtn = document.getElementById('clear-log-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () { clearLog(); });
    }

    /* --- Portal submit: emit postMessage for closed-loop routing ---------------
     * Fires ONLY when embedded in a parent frame (the G.U.S. Portal srcdoc iframe).
     * In a standalone browser tab window.parent === window, so nothing is posted
     * and the existing localStorage + copy-paste flow is completely unaffected.
     * --------------------------------------------------------------------------- */
    var submitBtn = document.getElementById('wb-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var md = generatePasteback();

        /* Structured answers map: questionId -> value(s) */
        var answers = {};
        document.querySelectorAll('input[type=radio]:checked').forEach(function (r) {
          var sec = r.closest('section');
          answers[sec ? sec.id : r.name] = r.value;
        });
        var cbByQ = {};
        document.querySelectorAll('input[type=checkbox]').forEach(function (c) {
          var sec = c.closest('section');
          var qid = sec ? sec.id : c.name;
          if (!cbByQ[qid]) cbByQ[qid] = [];
          if (c.checked) cbByQ[qid].push(c.value);
        });
        Object.keys(cbByQ).forEach(function (qid) { answers[qid] = cbByQ[qid]; });
        document.querySelectorAll('textarea[name$="_choice"]').forEach(function (ta) {
          if (ta.value.trim()) {
            var sec = ta.closest('section');
            answers[sec ? sec.id : ta.name] = ta.value.trim();
          }
        });

        /* Metadata stamped by render.py on <body> (optional; graceful defaults) */
        var body = document.body;
        var workbookId = (body && body.getAttribute('data-workbook-id')) || STORAGE_KEY;
        var origin = (body && body.getAttribute('data-origin')) || '';
        var classification = (body && body.getAttribute('data-classification')) || 'INTERNAL';

        if (window.parent && window.parent !== window) {
          /* Embedded in the portal — route the decision to the host */
          window.parent.postMessage({
            type: 'wb-submit',
            workbookId: workbookId,
            storageKey: STORAGE_KEY,
            origin: origin,
            classification: classification,
            answers: answers,
            markdown: md
          }, '*');
          markSent(md);
          var origText = submitBtn.textContent;
          submitBtn.textContent = 'Submitted to portal';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.6';
          setTimeout(function () {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
          }, 2000);
        } else {
          /* Standalone browser — no parent; fall back to showing the paste-back */
          var out = document.getElementById('pasteback-out');
          if (out) { out.textContent = md; out.style.display = 'block'; }
        }
      });
    }

    /* Intercept all form submits */
    document.querySelectorAll('form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        if (btn) {
          var orig = btn.textContent;
          btn.textContent = 'saved';
          btn.disabled = true;
          btn.style.opacity = '0.6';
          setTimeout(function () {
            btn.textContent = orig;
            btn.disabled = false;
            btn.style.opacity = '';
          }, 1500);
        }
      });
    });

    /* Defensive type="button" on bare action buttons */
    document.querySelectorAll('.action-row button, .card-actions button').forEach(function (btn) {
      if (!btn.hasAttribute('type')) btn.setAttribute('type', 'button');
    });

    /* Auto-capture radio changes */
    document.querySelectorAll('input[type=radio]').forEach(function (r) {
      r.addEventListener('change', function () {
        var sec = r.closest('section');
        var qid = sec ? sec.id : (r.name || 'unknown');
        captureDecision(qid, 'radio:' + r.name, r.value);
        stateChanged();
        document.querySelectorAll('input[name="' + r.name + '"]').forEach(function (peer) {
          var item = peer.closest('.option-item, .option');
          if (item) item.classList.toggle('checked', peer.checked);
        });
      });
      if (r.checked) {
        var item = r.closest('.option-item, .option');
        if (item) item.classList.add('checked');
      }
    });

    /* Auto-capture checkbox changes */
    document.querySelectorAll('input[type=checkbox]').forEach(function (c) {
      c.addEventListener('change', function () {
        var sec = c.closest('section');
        var qid = sec ? sec.id : (c.name || 'unknown');
        captureDecision(qid, 'checkbox:' + c.name, { value: c.value, checked: c.checked });
        stateChanged();
        var item = c.closest('.checkbox-item, .option');
        if (item) item.classList.toggle('checked', c.checked);
      });
      if (c.checked) {
        var item = c.closest('.checkbox-item, .option');
        if (item) item.classList.add('checked');
      }
    });

    /* Auto-capture textareas: persist on EVERY keystroke (debounced), log on blur.
     * Blur-only capture was how typed text ended up "unsent" — never again. */
    document.querySelectorAll('textarea').forEach(function (ta) {
      ta.addEventListener('input', function () { stateChanged(); });
      ta.addEventListener('blur', function () {
        if (!ta.value.trim()) return;
        var sec = ta.closest('section');
        var qid = sec ? sec.id : (ta.name || 'unknown');
        var action = ta.name && ta.name.endsWith('_askback') ? 'ask-back' : 'notes';
        captureDecision(qid, action + ':' + ta.name, ta.value.trim());
      });
    });

    /* Initial banner + state snapshot (covers restored state after reload) */
    saveState();
    updateUnsentBanner();

    /* Sticky TOC active link via IntersectionObserver */
    var sections = document.querySelectorAll('section.question');
    if (sections.length && window.IntersectionObserver) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            document.querySelectorAll('.toc a, .toc-link').forEach(function (a) {
              a.classList.remove('active');
            });
            var link = document.querySelector(
              '.toc a[href="#' + entry.target.id + '"], .toc-link[href="#' + entry.target.id + '"]'
            );
            if (link) link.classList.add('active');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      sections.forEach(function (s) { observer.observe(s); });
    }
  });
})();
