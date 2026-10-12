window.HELP_IMPROVE_VIDEOJS = false;

/* ------------------------------------------------------------------ data -- */

// Main results: LLMSeg with Gemini-3.7-Flash (T = 8) vs SAM 3 on identical items.
// Each metric list is parallel across the three methods; null = not reported.
var RESULTS = [
  { bench: 'ReasonSeg (val / test)', metric: 'cIoU',
    noref: [64.6, 58.2], ours: [71.5, 65.8], sam3: [9.9, 11.3] },
  { bench: 'RefCOCO (val / testA / testB)', metric: 'cIoU',
    noref: [65.5, 65.7, 72.9], ours: [71.2, 73.8, 76.0], sam3: [42.0, 42.8, 44.2] },
  { bench: 'RefCOCO+ (val / testA / testB)', metric: 'cIoU',
    noref: [59.7, 61.4, 61.1], ours: [67.0, 69.9, 64.9], sam3: [33.6, 37.0, 32.9] },
  { bench: 'RefCOCOg (val / test)', metric: 'cIoU',
    noref: [64.8, 69.3], ours: [70.9, 74.5], sam3: [40.0, 39.7] },
  { bench: 'LVIS', metric: 'cgF1 / box AP / mask AP',
    noref: [50.4, 57.1, 36.9], ours: [53.9, 64.2, 47.2], sam3: [50.1, 69.1, 62.2] },
  { bench: 'COCO', metric: 'cgF1 / box AP / mask AP',
    noref: [50.4, 59.6, 38.0], ours: [56.1, 66.6, 50.5], sam3: [52.4, 68.0, 59.2] },
  { bench: 'SA-Co/Gold', metric: 'cgF1 / pmF1',
    noref: null, ours: [36.4, 55.4], sam3: [45.4, 55.2] },
  { bench: 'ADE20K', metric: 'gIoU',
    noref: [56.6], ours: [59.2], sam3: [57.9] },
  { bench: 'Cityscapes', metric: 'mIoU',
    noref: [48.8], ours: [53.3], sam3: [63.7] },
  { bench: 'ODinW13', metric: 'AP0',
    noref: [52.0], ours: [57.2], sam3: [51.5] },
  { bench: 'RF-100VL', metric: 'AP0',
    noref: [30.4], ours: [31.4], sam3: [14.2] }
];

// Qualitative comparison panes. Image chips (IoU) are baked into the files.
var QUAL = 'static/assets/qual/';
var SEM = 'static/assets/semantic/';
var FIVE = [
  ['input', 'Input'], ['gt', 'Ground truth'], ['sam3', 'SAM 3'],
  ['agent', 'SAM-3 Agent'], ['ours', 'LLMSeg']
];
function qual(slug, bench, query) {
  return { dir: QUAL, slug: slug, bench: bench, query: query, cols: FIVE };
}
var COMPARISONS = {
  'tab-comp-reasoning': [
    qual('reasonseg_breadbag', 'ReasonSeg',
      'To keep bread fresh and protected, it is often placed in a protective covering. What item in the picture is commonly used for this purpose?'),
    qual('reasonseg_dry', 'ReasonSeg', 'the area where people can stand without getting wet'),
    qual('reasonseg_graduation', 'ReasonSeg',
      'In a graduation ceremony, it is a tradition for the graduates to wear a specific type of clothing to signify their achievement. What item of clothing can be seen in the picture that is commonly worn by graduates?'),
    qual('reasonseg_fanspeed', 'ReasonSeg', 'something that can control the fan speed'),
    qual('reasonseg_trainer', 'ReasonSeg', "the person who is most likely to be the girl's trainer")
  ],
  'tab-comp-referring': [
    qual('refcocog_keyboard', 'RefCOCOg', 'the gray keyboard with the touch pad'),
    qual('refcocog_bowlright', 'RefCOCOg', 'bowl on right'),
    qual('refcoco_gurl', 'RefCOCO', 'gurl'),
    qual('refcocoplus_broccoli', 'RefCOCO+', 'longest stem of broccoli'),
    qual('refcocoplus_toast', 'RefCOCO+', 'toasted darker larger half')
  ],
  'tab-comp-openvocab': [
    qual('saco_fixedladder', 'SA-Co/Gold', 'fixed ladder'),
    qual('ade20k_grandstand', 'ADE20K', 'grandstand')
  ],
  'tab-comp-semantic': ['a', 'b', 'c', 'd', 'e'].map(function (c) {
    return {
      dir: SEM, slug: 'city_' + c, bench: 'Cityscapes',
      query: 'road, sidewalk, building, wall, fence, pole, … (19 classes, one query)',
      cols: [['input', 'Input'], ['gt', 'Ground truth'],
             ['seg', 'LLMSeg (stage 2)'], ['rec', 'LLMSeg (refined)']]
    };
  })
};

/* --------------------------------------------------------------- helpers -- */

function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function fmt(v) { return v.toFixed(1); }

// Best value per metric index across the three methods.
function bestPerMetric(row) {
  var n = row.ours.length;
  var best = [];
  for (var i = 0; i < n; i++) {
    var vals = [row.noref, row.ours, row.sam3]
      .map(function (a) { return a ? a[i] : -Infinity; });
    best.push(Math.max.apply(null, vals));
  }
  return best;
}

function renderResultsTable() {
  var tbody = document.getElementById('results-body');
  if (!tbody) return;
  RESULTS.forEach(function (row) {
    var best = bestPerMetric(row);
    var tr = el('tr');
    tr.appendChild(el('td', null, row.bench));
    tr.appendChild(el('td', null, row.metric));
    [['noref', ''], ['ours', 'highlight-col'], ['sam3', '']].forEach(function (m) {
      var td = el('td', m[1]);
      var vals = row[m[0]];
      if (!vals) {
        td.innerHTML = '&mdash;';
      } else {
        vals.forEach(function (v, i) {
          if (i > 0) td.appendChild(document.createTextNode(' / '));
          var s = el('span', v === best[i] ? 'best-score' : null, fmt(v));
          td.appendChild(s);
        });
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function renderCIoUChart() {
  var host = document.getElementById('cIoU-chart');
  if (!host) return;
  var splits = [];
  RESULTS.slice(0, 4).forEach(function (row) {
    var names = row.bench.replace(/^[^(]*\(/, '').replace(')', '').split(' / ');
    var base = row.bench.replace(/ \(.*$/, '');
    names.forEach(function (n, i) {
      splits.push({
        label: base + ' ' + n,
        noref: row.noref[i], ours: row.ours[i], sam3: row.sam3[i]
      });
    });
  });
  splits.forEach(function (s) {
    var r = el('div', 'bar-row');
    r.appendChild(el('div', 'bar-label', s.label));
    var bars = el('div', 'bar-group');
    [['noref', 'swatch-noref'], ['ours', 'swatch-ours'], ['sam3', 'swatch-sam3']].forEach(function (k) {
      var line = el('div', 'bar-line');
      var bar = el('div', 'bar ' + k[1]);
      bar.style.width = '0%';
      bar.setAttribute('data-w', s[k[0]]);
      bar.appendChild(el('span', 'bar-val', fmt(s[k[0]])));
      line.appendChild(bar);
      bars.appendChild(line);
    });
    r.appendChild(bars);
    host.appendChild(r);
  });
  // Animate the bars once the chart is in view.
  var animate = function () {
    host.querySelectorAll('.bar').forEach(function (b) {
      b.style.width = b.getAttribute('data-w') + '%';
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

function renderComparisons() {
  Object.keys(COMPARISONS).forEach(function (paneId) {
    var pane = document.getElementById(paneId);
    if (!pane) return;
    COMPARISONS[paneId].forEach(function (item) {
      var card = el('div', 'cmp-item');
      var head = el('div', 'cmp-head');
      head.appendChild(el('span', 'cmp-bench', item.bench));
      head.appendChild(el('span', 'cmp-query', '“' + item.query + '”'));
      card.appendChild(head);
      var grid = el('div', 'cmp-grid cmp-cols-' + item.cols.length);
      item.cols.forEach(function (c) {
        var fig = el('figure', 'cmp-fig' + (c[0] === 'ours' || c[0] === 'rec' ? ' cmp-fig-ours' : ''));
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
  });
}

/* ------------------------------------------------------------------ init -- */

renderResultsTable();
renderCIoUChart();
renderComparisons();

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

  // Animated counters with Intersection Observer
  var countersAnimated = false;
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  function animateCounters() {
    $('.stat-number').each(function () {
      var $el = $(this);
      var target = parseFloat($el.data('target'));
      var suffix = $el.data('suffix') || '';
      var prefix = $el.attr('data-prefix') || '';
      var decimals = parseInt($el.data('decimals')) || 0;
      var duration = 1500;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - (1 - progress) * (1 - progress);
        $el.text(prefix + (eased * target).toFixed(decimals) + suffix);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    });
  }

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
