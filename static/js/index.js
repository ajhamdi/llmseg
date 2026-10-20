window.HELP_IMPROVE_VIDEOJS = false;

/* ------------------------------------------------------------------ data -- */

// Main results: LLMSeg with Gemini-3.7-Flash (T = 8) vs SAM 3 on identical items.
// `cols` names each score: the split (referring/reasoning rows, all cIoU) or the metric.
// Each method list is parallel to `cols`; null = not reported.
// `agent` (SAM 3 Agent, Gemini-3.7-Flash) is given for the referring/reasoning rows only.
// Extra zero-shot baselines, published full-split numbers (not matched to the other methods' items):
// `gsam` (Grounded SAM) and `rsvp` (RSVP, GPT-4o) on ReasonSeg; `gdino` (gDino-T)
// on the open-vocabulary/detection rows. Fine-tuned or LVIS-trained methods are not compared.
// `tag` keys a task colour in index.css (.res-tag-*).
var RESULTS = [
  { bench: 'ReasonSeg', task: 'Reasoning segmentation', tag: 'reason', metric: 'cIoU', cols: ['val', 'test'],
    noref: [64.6, 58.2], ours: [71.5, 65.8], sam3: [9.9, 11.3], agent: [62.0, 63.2],
    rsvp: [63.1, 60.0], gsam: [14.5, 16.4] },
  { bench: 'RefCOCO', task: 'Referring segmentation', tag: 'refer', metric: 'cIoU', cols: ['val', 'testA', 'testB'],
    noref: [65.5, 65.7, 72.9], ours: [71.2, 73.8, 76.0], sam3: [42.0, 42.8, 44.2], agent: [73.2, 76.7, 75.5] },
  { bench: 'RefCOCO+', task: 'Referring segmentation', tag: 'refer', metric: 'cIoU', cols: ['val', 'testA', 'testB'],
    noref: [59.7, 61.4, 61.1], ours: [67.0, 69.9, 64.9], sam3: [33.6, 37.0, 32.9], agent: [68.4, 72.0, 68.5] },
  { bench: 'RefCOCOg', task: 'Referring segmentation', tag: 'refer', metric: 'cIoU', cols: ['val', 'test'],
    noref: [64.8, 69.3], ours: [70.9, 74.5], sam3: [40.0, 39.7], agent: [76.5, 76.9] },
  { bench: 'LVIS', task: 'Open-vocabulary instance segmentation', tag: 'inst', cols: ['cgF1'],
    noref: [50.4], ours: [53.9], sam3: [50.1],
    gdino: [14.7] },
  { bench: 'COCO', task: 'Open-vocabulary instance segmentation', tag: 'inst', cols: ['cgF1'],
    noref: [50.4], ours: [56.1], sam3: [52.4],
    gdino: null },
  { bench: 'ADE20K', task: 'Semantic segmentation', tag: 'sem', cols: ['gIoU'],
    noref: [56.6], ours: [59.2], sam3: [57.9],
    gdino: null },
  { bench: 'Cityscapes', task: 'Semantic segmentation', tag: 'sem', cols: ['mIoU'],
    noref: [48.8], ours: [53.3], sam3: [63.7],
    gdino: null },
  { bench: 'ODinW13', task: 'Zero-shot object detection', tag: 'det', cols: ['AP0'],
    noref: [52.0], ours: [57.2], sam3: [51.5],
    gdino: [49.7] },
  { bench: 'RF-100VL', task: 'Zero-shot object detection', tag: 'det', cols: ['AP0'],
    noref: [30.4], ours: [31.4], sam3: [14.2],
    gdino: [15.7] }
];
var TASK_SHORT = {
  reason: 'Reasoning', refer: 'Referring', inst: 'Instance seg.', concept: 'Concept seg.',
  sem: 'Semantic seg.', det: 'Zero-shot det.'
};
var RES_METHODS = [
  ['gsam', 'Grounded SAM'], ['rsvp', 'RSVP (GPT-4o)'],
  ['gdino', 'gDino-T'],
  ['sam3', 'SAM 3'], ['agent', 'SAM 3 Agent'],
  ['noref', 'LLMSeg (w/o refine)'], ['ours', 'LLMSeg']
];
// Extra baselines are left out of a card entirely when they report nothing there.
var RES_EXTRA = ['gsam', 'rsvp', 'gdino'];

// Backend study: stage-2 gIoU on ReasonSeg val (200 items), 95% item-bootstrap interval.
// fam keys a colour in index.css (.bk-fam-*). Sorted by gIoU, as in the paper.
var BACKENDS = [
  { name: 'GPT-6 Astra', fam: 'openai', v: 74.2, lo: 70.4, hi: 77.9 },
  { name: 'Gemini 3.7 Flash', fam: 'google', v: 65.7, lo: 62.1, hi: 69.5 },
  { name: 'Gemini 3.8 Flash', fam: 'google', v: 63.4, lo: 59.4, hi: 67.3 },
  { name: 'Gemini 3.5 Flash', fam: 'google', v: 62.9, lo: 59.1, hi: 66.6 },
  { name: 'GPT-5.6 Sol', fam: 'openai', v: 61.2, lo: 57.3, hi: 64.9 },
  { name: 'Gemini 3 Flash', fam: 'google', v: 58.9, lo: 55.1, hi: 62.7 },
  { name: 'Gemma 4 31B', fam: 'google', v: 57.6, lo: 53.8, hi: 61.3 },
  { name: 'Gemma 4 26B', fam: 'google', v: 56.9, lo: 53.3, hi: 60.3 },
  { name: 'GPT-5.6 Terra', fam: 'openai', v: 56.2, lo: 52.0, hi: 60.0 },
  { name: 'GPT-5.6 Luna', fam: 'openai', v: 54.4, lo: 50.5, hi: 58.7 },
  { name: 'Gemini 3.1 Flash-Lite', fam: 'google', v: 51.3, lo: 47.8, hi: 54.8 },
  { name: 'Qwen3.5 397B', fam: 'qwen', v: 50.2, lo: 46.6, hi: 53.7 },
  { name: 'Qwen3.8 27B', fam: 'qwen', v: 49.6, lo: 45.5, hi: 53.5 },
  { name: 'Claude Opus 5', fam: 'anthropic', v: 49.0, lo: 44.9, hi: 53.2 },
  { name: 'GLM 5.3 Flash', fam: 'zai', v: 48.8, lo: 45.1, hi: 52.7 },
  { name: 'Muse Spark 1.2', fam: 'meta', v: 41.2, lo: 37.2, hi: 45.2 },
  { name: 'GPT-5.4', fam: 'openai', v: 35.4, lo: 31.8, hi: 38.8 },
  { name: 'Gemini 2.5 Flash-Lite', fam: 'google', v: 29.9, lo: 26.4, hi: 33.4 },
  { name: 'Qwen3 VL 235B', fam: 'qwen', v: 25.2, lo: 21.1, hi: 29.5 },
  { name: 'Muse Glimmer 30B', fam: 'meta', v: 21.3, lo: 17.7, hi: 24.9 },
  { name: 'GLM 4.6V', fam: 'zai', v: 13.4, lo: 10.2, hi: 16.8 }
];
var BACKEND_FAMILIES = [
  ['openai', 'OpenAI'], ['google', 'Google'], ['qwen', 'Qwen'],
  ['anthropic', 'Anthropic'], ['zai', 'Z.ai'], ['meta', 'Meta']
];
var BACKEND_REFS = [
  { label: 'SAM 3', v: 13.1, side: 'right' },
  { label: 'SAM 3 Agent', v: 72.4, side: 'left' }
];
var BACKEND_AXIS_MAX = 80;

// Qualitative comparison panes. Image chips (IoU) are baked into the files.
var QUAL = 'static/assets/qual/';
var FIVE = [
  ['input', 'Input'], ['gt', 'Ground truth'], ['sam3', 'SAM 3'],
  ['agent', 'SAM-3 Agent'], ['ours', 'LLMSeg']
];
function qual(slug, bench, query) {
  return { dir: QUAL, slug: slug, bench: bench, query: query, cols: FIVE };
}
var COMPARISONS = [
  qual('reasonseg_breadbag', 'ReasonSeg',
    'To keep bread fresh and protected, it is often placed in a protective covering. What item in the picture is commonly used for this purpose?'),
  qual('reasonseg_dry', 'ReasonSeg', 'the area where people can stand without getting wet'),
  qual('reasonseg_graduation', 'ReasonSeg',
    'In a graduation ceremony, it is a tradition for the graduates to wear a specific type of clothing to signify their achievement. What item of clothing can be seen in the picture that is commonly worn by graduates?'),
  qual('reasonseg_fanspeed', 'ReasonSeg', 'something that can control the fan speed'),
  qual('reasonseg_trainer', 'ReasonSeg', "the person who is most likely to be the girl's trainer"),
  qual('refcocog_keyboard', 'RefCOCOg', 'the gray keyboard with the touch pad'),
  qual('refcocog_bowlright', 'RefCOCOg', 'bowl on right'),
  qual('refcoco_gurl', 'RefCOCO', 'gurl'),
  qual('refcocoplus_broccoli', 'RefCOCO+', 'longest stem of broccoli'),
  qual('refcocoplus_toast', 'RefCOCO+', 'toasted darker larger half'),
  qual('saco_fixedladder', 'SA-Co/Gold', 'fixed ladder'),
  qual('ade20k_grandstand', 'ADE20K', 'grandstand')
];

// Rare-domain pane (RF-100VL). The SAM-3 Agent baseline was not run here, so four columns.
var DOMAINS = 'static/assets/domains/';
var FOUR = [
  ['input', 'Input'], ['gt', 'Ground truth'], ['sam3', 'SAM 3'], ['ours', 'LLMSeg']
];
function dom(slug, bench, query) {
  return { dir: DOMAINS, slug: slug, bench: bench, query: query, cols: FOUR };
}
var DOMAIN_COMPARISONS = [
  dom('invoice', 'Documents: invoice-processing', 'table'),
  dom('diagram', 'Documents: activity-diagrams', 'action'),
  dom('dumptruck', 'Aerial: construction equipment', 'dump truck'),
  dom('mri', 'Medical: brain-tumors-MRI', 'pituitary'),
  dom('xray', 'Medical: nih-xray', 'Pneumonia'),
  dom('tooth', 'Medical: dentalai', 'Impacted Tooth')
];

/* --------------------------------------------------------------- helpers -- */

function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function fmt(v) { return v.toFixed(1); }

// Best value per score index across the given methods.
function bestPerMetric(row, keys) {
  return row.cols.map(function (_, i) {
    return Math.max.apply(null, keys.map(function (k) {
      return row[k] && row[k][i] !== null ? row[k][i] : -Infinity;
    }));
  });
}

// Small multiples: one card per benchmark, one bar group per split or metric.
// Card width is proportional to its number of groups (CSS grid span).
function renderResultCards(hostId, rows, keys, axisMax, spanMul, singleSpan) {
  var host = document.getElementById(hostId);
  if (!host) return;
  var allMethods = RES_METHODS.filter(function (m) { return keys.indexOf(m[0]) >= 0; });

  rows.forEach(function (row) {
    var n = row.cols.length;
    var methods = allMethods.filter(function (m) {
      return RES_EXTRA.indexOf(m[0]) < 0 || (row[m[0]] && row[m[0]].some(function (v) { return v !== null; }));
    });
    var best = bestPerMetric(row, keys);
    var card = el('div', 'res-card');
    card.style.setProperty('--span', n === 1 && singleSpan ? singleSpan : n * (spanMul || 1));
    card.style.setProperty('--span-sm', Math.min(n, 2));

    var head = el('div', 'res-card-head');
    head.appendChild(el('span', 'res-card-title', row.bench));
    var tag = el('span', 'res-tag res-tag-' + row.tag, TASK_SHORT[row.tag]);
    tag.title = row.task;
    head.appendChild(tag);
    card.appendChild(head);

    var plot = el('div', 'res-plot');
    [20, 40, 60, 80].filter(function (g) { return g < axisMax; }).forEach(function (g) {
      var line = el('div', 'res-gridline');
      line.style.bottom = (g / axisMax * 100) + '%';
      plot.appendChild(line);
    });
    var groups = el('div', 'res-groups');
    var xlabels = el('div', 'res-xlabels');

    row.cols.forEach(function (col, i) {
      var label = row.metric ? row.bench + ' ' + col + ' (' + row.metric + ')' : row.bench + ' ' + col;
      var grp = el('div', 'res-group');
      methods.forEach(function (m) {
        var v = row[m[0]] ? row[m[0]][i] : null;
        if (v === undefined) v = null;
        var slot = el('div', 'res-slot');
        if (v !== null) {
          var bar = el('div', 'res-bar swatch-' + m[0]);
          bar.style.height = '0%';
          bar.setAttribute('data-h', v / axisMax * 100);
          bar.title = m[1] + ', ' + label + ': ' + fmt(v);
          bar.appendChild(el('span', 'res-val' + (v === best[i] ? ' is-best' : ''), fmt(v)));
          slot.appendChild(bar);
          grp.appendChild(slot);
        }
      });
      groups.appendChild(grp);

      xlabels.appendChild(el('div', 'res-xlabel', col));
    });

    plot.appendChild(groups);
    card.appendChild(plot);
    card.appendChild(xlabels);
    host.appendChild(card);
  });

  // Grow the bars once the figure is in view.
  var animate = function () {
    host.querySelectorAll('.res-bar').forEach(function (b) {
      b.style.height = b.getAttribute('data-h') + '%';
    });
  };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { animate(); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(host);
  } else {
    animate();
  }
}

function renderBackendChart() {
  var host = document.getElementById('backend-chart');
  if (!host) return;
  var pct = function (v) { return (v / BACKEND_AXIS_MAX * 100) + '%'; };

  var legend = document.getElementById('backend-legend');
  if (legend) {
    BACKEND_FAMILIES.forEach(function (f) {
      var item = el('span');
      item.appendChild(el('i', 'swatch bk-fam-' + f[0]));
      item.appendChild(document.createTextNode(f[1]));
      legend.appendChild(item);
    });
  }

  // Gridlines and reference lines share one overlay aligned with the row tracks.
  var overlay = el('div', 'bk-overlay');
  for (var t = 0; t <= BACKEND_AXIS_MAX; t += 10) {
    var g = el('div', 'bk-grid');
    g.style.left = pct(t);
    overlay.appendChild(g);
  }
  BACKEND_REFS.forEach(function (r) {
    var line = el('div', 'bk-ref');
    line.style.left = pct(r.v);
    var tag = el('span', 'bk-ref-tag bk-ref-' + r.side, r.label + ' (' + fmt(r.v) + ')');
    line.appendChild(tag);
    overlay.appendChild(line);
  });
  host.appendChild(overlay);

  BACKENDS.forEach(function (b) {
    var row = el('div', 'bk-row');
    row.title = b.name + ': ' + fmt(b.v) + ' gIoU, 95% CI [' + fmt(b.lo) + ', ' + fmt(b.hi) + ']';
    var logo = el('div', 'bk-logo');
    var li = document.createElement('img');
    li.src = 'static/assets/logos/' + b.fam + '.png';
    li.alt = '';
    logo.appendChild(li);
    row.appendChild(logo);
    row.appendChild(el('div', 'bk-label', b.name));
    var track = el('div', 'bk-track');
    var bar = el('div', 'bk-bar bk-fam-' + b.fam);
    bar.style.width = '0%';
    bar.setAttribute('data-w', (b.v / BACKEND_AXIS_MAX * 100));
    track.appendChild(bar);
    var ci = el('div', 'bk-ci');
    ci.style.left = pct(b.lo);
    ci.style.width = ((b.hi - b.lo) / BACKEND_AXIS_MAX * 100) + '%';
    track.appendChild(ci);
    var val = el('span', 'bk-val', fmt(b.v));
    val.style.left = pct(b.hi);
    track.appendChild(val);
    row.appendChild(track);
    host.appendChild(row);
  });

  var axis = el('div', 'bk-axis');
  var ticks = el('div', 'bk-axis-ticks');
  for (var a = 0; a <= BACKEND_AXIS_MAX; a += 10) {
    var tk = el('span', null, String(a));
    tk.style.left = pct(a);
    ticks.appendChild(tk);
  }
  axis.appendChild(el('div', 'bk-logo'));
  axis.appendChild(el('div', 'bk-label'));
  axis.appendChild(ticks);
  host.appendChild(axis);
  host.appendChild(el('div', 'bk-axis-title', 'stage-2 gIoU (\u00d7100), ReasonSeg val'));

  var animate = function () {
    host.querySelectorAll('.bk-bar').forEach(function (b) {
      b.style.width = b.getAttribute('data-w') + '%';
    });
  };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { animate(); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(host);
  } else {
    animate();
  }
}

function renderComparisons(paneId, items) {
  var pane = document.getElementById(paneId);
  if (!pane) return;
  items.forEach(function (item) {
    var card = el('div', 'cmp-item');
    var head = el('div', 'cmp-head');
    head.appendChild(el('span', 'cmp-bench', item.bench));
    head.appendChild(el('span', 'cmp-query', '\u201c' + item.query + '\u201d'));
    card.appendChild(head);
    var grid = el('div', 'cmp-grid cmp-cols-' + item.cols.length);
    item.cols.forEach(function (c) {
      var fig = el('figure', 'cmp-fig' + (c[0] === 'ours' ? ' cmp-fig-ours' : ''));
      var img = document.createElement('img');
      img.src = item.dir + item.slug + '_' + c[0] + '.jpg';
      img.alt = c[1] + ': ' + item.query;
      img.loading = 'lazy';
      fig.appendChild(img);
      fig.appendChild(el('figcaption', null, c[1]));
      grid.appendChild(fig);
    });
    card.appendChild(grid);
    pane.appendChild(card);
  });
}

/* ------------------------------------------------------------------ init -- */

renderResultCards('ref-figure', RESULTS.filter(function (r) { return r.agent; }),
  ['gsam', 'rsvp', 'sam3', 'agent', 'noref', 'ours'], 80);
renderResultCards('ov-figure', RESULTS.filter(function (r) { return !r.agent; }),
  ['gdino', 'sam3', 'noref', 'ours'], 80, 1, 1);
renderBackendChart();
renderComparisons('comparisons-list', COMPARISONS);
renderComparisons('domains-list', DOMAIN_COMPARISONS);

$(document).ready(function () {
  // Tab switching (scoped per tab group)
  $('.tabs li').on('click', function () {
    var tabId = $(this).data('tab');
    var $tabGroup = $(this).closest('.tabs');
    var $tabContent = $tabGroup.next('.tab-content');
    $tabGroup.find('li').removeClass('is-active');
    $(this).addClass('is-active');
    $tabContent.find('.tab-pane').hide();
    $('#' + tabId).show();
  });

  // Image comparison sliders (input vs result)
  document.querySelectorAll('.img-compare').forEach(function (box) {
    var over = box.querySelector('.ic-over');
    var handle = box.querySelector('.ic-handle');

    function setPct(pct) {
      pct = Math.max(2, Math.min(98, pct));
      over.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }
    function fromEvent(e) {
      var rect = box.getBoundingClientRect();
      setPct(((e.clientX - rect.left) / rect.width) * 100);
    }
    setPct(50);

    var dragging = false;
    box.addEventListener('pointerdown', function (e) {
      dragging = true;
      box.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    box.addEventListener('pointermove', function (e) {
      // Hover moves the divider on mouse; touch and pen need a drag.
      if (dragging || e.pointerType === 'mouse') fromEvent(e);
    });
    box.addEventListener('pointerup', function () { dragging = false; });
    box.addEventListener('pointercancel', function () { dragging = false; });
  });

  // Copy BibTeX
  var copyBtn = document.getElementById('copy-bibtex');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = document.getElementById('bibtex-text').textContent;
      var label = copyBtn.querySelector('span:last-child');
      function done(msg) {
        label.textContent = msg;
        setTimeout(function () { label.textContent = 'Copy'; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done('Copied'); },
          function () { done('Press Ctrl+C'); });
      } else {
        done('Press Ctrl+C');
      }
    });
  }
});
