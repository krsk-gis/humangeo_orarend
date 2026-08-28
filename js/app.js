(function () {
  "use strict";

  var DAY_ORDER = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];

  var searchInput = document.getElementById("teacher-search");
  var clearBtn = document.getElementById("clear-search");
  var resultsList = document.getElementById("teacher-results");
  var scheduleSection = document.getElementById("schedule-section");
  var scheduleContent = document.getElementById("schedule-content");
  var scheduleNameEl = document.getElementById("schedule-teacher-name");
  var backBtn = document.getElementById("back-btn");
  var emptyState = document.getElementById("empty-state");

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function renderResults(query) {
    resultsList.innerHTML = "";
    var q = normalize(query.trim());
    if (!q) {
      resultsList.hidden = true;
      searchInput.setAttribute("aria-expanded", "false");
      return;
    }

    var matches = TEACHERS.filter(function (t) {
      return normalize(t.name).indexOf(q) !== -1;
    });

    if (matches.length === 0) {
      var li = document.createElement("li");
      li.textContent = "Nincs találat.";
      li.style.padding = "13px 16px";
      li.style.color = "#6b7280";
      resultsList.appendChild(li);
      resultsList.hidden = false;
      searchInput.setAttribute("aria-expanded", "true");
      return;
    }

    matches.forEach(function (t) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      var nameSpan = document.createElement("span");
      nameSpan.textContent = t.name;
      var countSpan = document.createElement("span");
      countSpan.className = "lesson-count";
      countSpan.textContent = t.lessons.length + " óra";
      btn.appendChild(nameSpan);
      btn.appendChild(countSpan);
      btn.addEventListener("click", function () {
        selectTeacher(t);
      });
      li.appendChild(btn);
      resultsList.appendChild(li);
    });

    resultsList.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  }

  function selectTeacher(teacher) {
    scheduleNameEl.textContent = teacher.name;
    scheduleContent.innerHTML = "";

    if (teacher.lessons.length === 0) {
      var p = document.createElement("p");
      p.className = "no-lessons";
      p.textContent = "Ehhez az oktatóhoz jelenleg nincs rögzített óra.";
      scheduleContent.appendChild(p);
    } else {
      var byDay = {};
      teacher.lessons.forEach(function (lesson) {
        if (!byDay[lesson.day]) byDay[lesson.day] = [];
        byDay[lesson.day].push(lesson);
      });

      DAY_ORDER.forEach(function (day) {
        if (!byDay[day]) return;
        var group = document.createElement("div");
        group.className = "day-group";

        var h3 = document.createElement("h3");
        h3.textContent = day;
        group.appendChild(h3);

        byDay[day].forEach(function (lesson) {
          var card = document.createElement("div");
          card.className = "lesson-card";

          var timeEl = document.createElement("div");
          timeEl.className = "lesson-time";
          timeEl.textContent = lesson.time;

          var detailsEl = document.createElement("div");
          detailsEl.className = "lesson-details";

          var courseEl = document.createElement("div");
          courseEl.className = "lesson-course";
          courseEl.textContent = lesson.course;
          detailsEl.appendChild(courseEl);

          if (lesson.room) {
            var roomEl = document.createElement("div");
            roomEl.className = "lesson-room";
            roomEl.textContent = lesson.room;
            detailsEl.appendChild(roomEl);
          }

          card.appendChild(timeEl);
          card.appendChild(detailsEl);
          group.appendChild(card);
        });

        scheduleContent.appendChild(group);
      });
    }

    searchInput.value = teacher.name;
    resultsList.hidden = true;
    resultsList.innerHTML = "";
    clearBtn.hidden = false;
    scheduleSection.hidden = false;
    emptyState.hidden = true;
  }

  function reset() {
    searchInput.value = "";
    resultsList.hidden = true;
    resultsList.innerHTML = "";
    clearBtn.hidden = true;
    scheduleSection.hidden = true;
    emptyState.hidden = false;
    searchInput.focus();
  }

  searchInput.addEventListener("input", function () {
    clearBtn.hidden = searchInput.value.length === 0;
    scheduleSection.hidden = true;
    emptyState.hidden = searchInput.value.trim().length > 0;
    renderResults(searchInput.value);
  });

  searchInput.addEventListener("focus", function () {
    if (searchInput.value.trim() && scheduleSection.hidden === false) {
      // reopen suggestions when refocusing after a selection
      renderResults(searchInput.value);
    }
  });

  document.addEventListener("click", function (e) {
    if (!resultsList.contains(e.target) && e.target !== searchInput) {
      resultsList.hidden = true;
    }
  });

  clearBtn.addEventListener("click", reset);
  backBtn.addEventListener("click", reset);
})();
