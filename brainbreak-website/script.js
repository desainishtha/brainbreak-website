let tasks = [];
let breakActivities = [];

let timerInterval;
let timeLeft = 25 * 60;

function showSection(sectionId) {
  const sections = document.querySelectorAll(".page-section");

  sections.forEach(function(section) {
    section.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active");
}

function addTask() {
  const name = document.getElementById("taskName").value;
  const className = document.getElementById("taskClass").value;
  const minutes = document.getElementById("taskMinutes").value;
  const priority = document.getElementById("taskPriority").value;

  if (name.trim() === "") {
    alert("Please enter a task name.");
    return;
  }

  const task = {
    name: name,
    className: className,
    minutes: minutes,
    priority: priority
  };

  tasks.push(task);
  displayTasks();

  document.getElementById("taskName").value = "";
  document.getElementById("taskClass").value = "";
  document.getElementById("taskMinutes").value = "";
}

function displayTasks() {
  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "<h3>Your Tasks</h3>";

  tasks.forEach(function(task, index) {
    taskList.innerHTML += `
      <div class="task-item">
        <strong>${index + 1}. ${task.name}</strong><br>
        Class: ${task.className || "Not entered"}<br>
        Time: ${task.minutes || "Not entered"} minutes<br>
        Priority: ${task.priority}
      </div>
    `;
  });
}

function addBreakActivity() {
  const activity = document.getElementById("breakActivity").value;

  if (activity.trim() === "") {
    alert("Please enter a break activity.");
    return;
  }

  breakActivities.push(activity);
  displayBreakActivities();

  document.getElementById("breakActivity").value = "";
}

function displayBreakActivities() {
  const breakList = document.getElementById("breakList");

  breakList.innerHTML = "<h3>Your Break Activities</h3>";

  breakActivities.forEach(function(activity, index) {
    breakList.innerHTML += `
      <div class="break-item">
        ${index + 1}. ${activity}
      </div>
    `;
  });
}

function generatePlan() {
  const studyPlan = document.getElementById("studyPlan");

  if (tasks.length === 0) {
    studyPlan.innerHTML = "<h3>Recommended Study Order</h3><p>Please add tasks first.</p>";
    return;
  }

  const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3
  };

  const sortedTasks = [...tasks].sort(function(a, b) {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  studyPlan.innerHTML = "<h3>Recommended Study Order</h3>";

  sortedTasks.forEach(function(task, index) {
    studyPlan.innerHTML += `
      <div class="plan-item">
        <strong>${index + 1}. ${task.name}</strong><br>
        Priority: ${task.priority}<br>
        Estimated Time: ${task.minutes || "Not entered"} minutes
      </div>
    `;
  });
}

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(function() {
    timeLeft = timeLeft - 1;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time for a BrainBreak!");
      suggestBreak();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = 25 * 60;
  updateTimerDisplay();

  document.getElementById("breakSuggestion").innerHTML = `
    <h3>Break Suggestion</h3>
    <p>Your suggested break will appear here.</p>
  `;
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  let secondsText = seconds;

  if (seconds < 10) {
    secondsText = "0" + seconds;
  }

  document.getElementById("timerDisplay").textContent = minutes + ":" + secondsText;
}

function suggestBreak() {
  const breakSuggestion = document.getElementById("breakSuggestion");

  if (breakActivities.length === 0) {
    breakSuggestion.innerHTML = `
      <h3>Suggested Break</h3>
      <p>Stand up, stretch, drink water, and rest your eyes for 5 minutes.</p>
    `;
    return;
  }

  const randomIndex = Math.floor(Math.random() * breakActivities.length);
  const activity = breakActivities[randomIndex];

  breakSuggestion.innerHTML = `
    <h3>Suggested Break</h3>
    <p>${activity}</p>
  `;
}