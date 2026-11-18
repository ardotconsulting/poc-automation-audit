(function() {
  "use strict";

  var tasks = [];

  function scoreColor(score) {
    if (score >= 60) return "score-high";
    if (score >= 20) return "score-mid";
    return "score-low";
  }

  function render() {
    var tbody = document.getElementById("task-body");
    var emptyMsg = document.getElementById("empty-msg");
    var summarySection = document.getElementById("summary-section");

    // Sort by priority score descending
    tasks.sort(function(a, b) { return b.score - a.score; });

    tbody.innerHTML = "";
    emptyMsg.style.display = tasks.length ? "none" : "block";
    summarySection.style.display = tasks.length ? "block" : "none";

    var totalWeekly = 0;
    var totalSaved = 0;

    tasks.forEach(function(t, i) {
      var tr = document.createElement("tr");
      var cls = scoreColor(t.score);
      var weeklyHours = (t.freqWeek && t.timeHours) ? (t.freqWeek * t.timeHours) : null;
      var savedHours = (weeklyHours && t.pctAuto) ? (weeklyHours * t.pctAuto / 100) : null;

      if (weeklyHours) totalWeekly += weeklyHours;
      if (savedHours) totalSaved += savedHours;

      tr.innerHTML =
        '<td>' + (i + 1) + '</td>' +
        '<td>' + escapeHtml(t.name) + '</td>' +
        '<td>' + t.freq + '</td>' +
        '<td>' + t.time + '</td>' +
        '<td>' + t.auto + '</td>' +
        '<td><span class="score-badge ' + cls + '">' + t.score + '</span></td>' +
        '<td>' + (weeklyHours !== null ? weeklyHours.toFixed(1) : '—') + '</td>' +
        '<td>' + (savedHours !== null ? savedHours.toFixed(2) : '—') + '</td>' +
        '<td><button class="btn-del" data-idx="' + i + '" title="Remove">&times;</button></td>';
      tbody.appendChild(tr);
    });

    document.getElementById("total-weekly").textContent = totalWeekly.toFixed(1);
    document.getElementById("total-saved").textContent = totalSaved.toFixed(2);
    document.getElementById("total-year").textContent = (totalSaved * 52).toFixed(0);
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function addTask(name, freq, time, auto, freqWeek, timeHours, pctAuto) {
    var score = freq * time * auto;
    tasks.push({
      name: name, freq: freq, time: time, auto: auto, score: score,
      freqWeek: freqWeek || null, timeHours: timeHours || null, pctAuto: pctAuto || null
    });
    render();
  }

  document.getElementById("task-form").addEventListener("submit", function(e) {
    e.preventDefault();
    var name = document.getElementById("task-name").value.trim();
    var freq = parseInt(document.getElementById("freq").value, 10);
    var time = parseInt(document.getElementById("time").value, 10);
    var auto = parseInt(document.getElementById("auto").value, 10);
    var freqWeek = parseFloat(document.getElementById("freq-week").value) || null;
    var timeHours = parseFloat(document.getElementById("time-hours").value) || null;
    var pctAutoEl = document.getElementById("pct-auto");
    var pctAuto = pctAutoEl.value ? parseFloat(pctAutoEl.value) : null;

    if (!name || !freq || !time || !auto) return;
    addTask(name, freq, time, auto, freqWeek, timeHours, pctAuto);
    this.reset();
  });

  document.getElementById("task-body").addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-del")) {
      var idx = parseInt(e.target.getAttribute("data-idx"), 10);
      tasks.splice(idx, 1);
      render();
    }
  });

  document.getElementById("load-example").addEventListener("click", function() {
    var examples = [
      { name: "Copy email form data into CRM + send welcome", freq: 5, time: 3, auto: 5, fw: 25, th: 0.3, pa: 95 },
      { name: "Reconcile daily sales with payment processor", freq: 4, time: 3, auto: 4, fw: 5, th: 0.4, pa: 70 },
      { name: "Generate weekly inventory report", freq: 3, time: 4, auto: 5, fw: 1, th: 1.5, pa: 95 },
      { name: "Follow up on unpaid invoices", freq: 2, time: 2, auto: 4, fw: 2, th: 0.5, pa: 50 },
      { name: "Update product listings across channels", freq: 3, time: 5, auto: 3, fw: 3, th: 2, pa: 60 }
    ];
    examples.forEach(function(e) {
      addTask(e.name, e.freq, e.time, e.auto, e.fw, e.th, e.pa);
    });
  });

  render();
})();