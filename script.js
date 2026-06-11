let tasks = [];
let breakActivities = [];

let timerInterval;
let timeLeft = 25 * 60;

let currentFocusTask = null;
let currentBreakMinutes = 5;

/* -----------------------------
   Navigation
----------------------------- */

function showSection(sectionId) {
  const sections = document.querySelectorAll(".page-section");

  sections.forEach(function(section) {
    section.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active");
}

/* -----------------------------
   Tasks
----------------------------- */

function addTask() {
  const name = document.getElementById("taskName").value;
  const className = document.getElementById("taskClass").value;
  const minutes = document.getElementById("taskMinutes").value;
  const priority = document.getElementById("taskPriority").value;

  const assignmentTypeElement = document.getElementById("assignmentType");
  const assignmentType = assignmentTypeElement ? assignmentTypeElement.value : "mixed";

  if (name.trim() === "") {
    alert("Please enter a task name.");
    return;
  }

  const task = {
    name: name,
    className: className,
    minutes: minutes,
    priority: priority,
    assignmentType: assignmentType,
    completed: false
  };

  tasks.push(task);
  displayTasks();

  document.getElementById("taskName").value = "";
  document.getElementById("taskClass").value = "";
  document.getElementById("taskMinutes").value = "";
}

function displayTasks() {
  const taskList = document.getElementById("taskList");

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <h3>Your Tasks</h3>
      <p>No tasks added yet.</p>
    `;
    return;
  }

  taskList.innerHTML = "<h3>Your Tasks</h3>";

  tasks.forEach(function(task, index) {
    const completedText = task.completed ? "Completed" : "Not completed";

    taskList.innerHTML += `
      <div class="task-item">
        <strong>${index + 1}. ${escapeHTML(task.name)}</strong><br>
        Class: ${escapeHTML(task.className || "Not entered")}<br>
        Time: ${task.minutes || "Not entered"} minutes<br>
        Priority: ${task.priority}<br>
        Assignment Type: ${getAssignmentTypeLabel(task.assignmentType)}<br>
        Status: ${completedText}<br><br>
        <button onclick="toggleTaskComplete(${index})">
          ${task.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
  });
}

function toggleTaskComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  displayTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  currentFocusTask = null;
  displayTasks();
}

function getAssignmentTypeLabel(type) {
  if (type === "online") {
    return "Online / screen-based";
  }

  if (type === "paper") {
    return "Paper / offline";
  }

  if (type === "mixed") {
    return "Mixed";
  }

  return "Not selected";
}

/* -----------------------------
   Break Activities
----------------------------- */

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

  if (breakActivities.length === 0) {
    breakList.innerHTML = `
      <h3>Your Break Activities</h3>
      <p>No break activities added yet.</p>
    `;
    return;
  }

  breakList.innerHTML = "<h3>Your Break Activities</h3>";

  breakActivities.forEach(function(activity, index) {
    breakList.innerHTML += `
      <div class="break-item">
        ${index + 1}. ${escapeHTML(activity)}
        <br><br>
        <button onclick="deleteBreakActivity(${index})">Delete</button>
      </div>
    `;
  });
}

function deleteBreakActivity(index) {
  breakActivities.splice(index, 1);
  displayBreakActivities();
}

/* -----------------------------
   Study Plan
----------------------------- */

function generatePlan() {
  const studyPlan = document.getElementById("studyPlan");

  if (tasks.length === 0) {
    studyPlan.innerHTML = "<h3>Recommended Study Order</h3><p>Please add tasks first.</p>";
    return;
  }

  const sortedTasks = getSortedIncompleteTasks();

  if (sortedTasks.length === 0) {
    studyPlan.innerHTML = `
      <h3>Recommended Study Order</h3>
      <p>All tasks are completed. Great job!</p>
    `;
    return;
  }

  studyPlan.innerHTML = "<h3>Recommended Study Order</h3>";

  sortedTasks.forEach(function(task, index) {
    studyPlan.innerHTML += `
      <div class="plan-item">
        <strong>${index + 1}. ${escapeHTML(task.name)}</strong><br>
        Priority: ${task.priority}<br>
        Estimated Time: ${task.minutes || "Not entered"} minutes<br>
        Assignment Type: ${getAssignmentTypeLabel(task.assignmentType)}
      </div>
    `;
  });
}

function getSortedIncompleteTasks() {
  const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3
  };

  return tasks
    .filter(function(task) {
      return !task.completed;
    })
    .sort(function(a, b) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

/* -----------------------------
   Focus Timer
----------------------------- */

function prepareFocusSession() {
  const focusTaskBox = document.getElementById("currentFocusTask");
  const breakSuggestion = document.getElementById("breakSuggestion");

  const sortedTasks = getSortedIncompleteTasks();

  if (sortedTasks.length === 0) {
    focusTaskBox.innerHTML = "<p>Please add at least one incomplete task first.</p>";
    return;
  }

  currentFocusTask = sortedTasks[0];

  const estimatedMinutes = Number(currentFocusTask.minutes) || 25;

  let focusMinutes = 25;
  let breakMinutes = 5;

  if (currentFocusTask.priority === "High") {
    if (estimatedMinutes >= 50) {
      focusMinutes = 30;
      breakMinutes = 10;
    } else {
      focusMinutes = 25;
      breakMinutes = 7;
    }
  }

  if (currentFocusTask.priority === "Medium") {
    if (estimatedMinutes >= 40) {
      focusMinutes = 25;
      breakMinutes = 6;
    } else {
      focusMinutes = 20;
      breakMinutes = 5;
    }
  }

  if (currentFocusTask.priority === "Low") {
    if (estimatedMinutes <= 15) {
      focusMinutes = 15;
      breakMinutes = 3;
    } else {
      focusMinutes = 20;
      breakMinutes = 4;
    }
  }

  timeLeft = focusMinutes * 60;
  currentBreakMinutes = breakMinutes;

  updateTimerDisplay();

  focusTaskBox.innerHTML = `
    <strong>${escapeHTML(currentFocusTask.name)}</strong><br>
    Class: ${escapeHTML(currentFocusTask.className || "Not entered")}<br>
    Priority: ${currentFocusTask.priority}<br>
    Assignment Type: ${getAssignmentTypeLabel(currentFocusTask.assignmentType)}<br>
    Estimated task time: ${currentFocusTask.minutes || "Not entered"} minutes<br>
    Focus session: ${focusMinutes} minutes<br>
    Recommended break: <span class="break-length-badge">${breakMinutes} minutes</span>
  `;

  breakSuggestion.innerHTML = `
    <h3>Break Suggestion</h3>
    <p>After this focus session, BrainBreak recommends a ${breakMinutes}-minute break.</p>
  `;
}

function startTimer() {
  if (!currentFocusTask && tasks.length > 0) {
    prepareFocusSession();
  }

  if (!currentFocusTask) {
    alert("Please add at least one task before starting the timer.");
    return;
  }

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

  if (currentFocusTask) {
    prepareFocusSession();
  } else {
    timeLeft = 25 * 60;
    updateTimerDisplay();
  }

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

  const breakIdea = getBreakBasedOnAssignmentType();

  breakSuggestion.innerHTML = `
    <h3>Time for a BrainBreak</h3>
    <p><strong>Current task:</strong> ${currentFocusTask ? escapeHTML(currentFocusTask.name) : "Focus session"}</p>
    <p><strong>Assignment type:</strong> ${currentFocusTask ? getAssignmentTypeLabel(currentFocusTask.assignmentType) : "Not selected"}</p>
    <p><strong>Recommended break length:</strong> ${currentBreakMinutes} minutes</p>
    <p><strong>Suggested break:</strong> ${breakIdea}</p>
    <span class="break-length-badge">${currentBreakMinutes}-minute break</span>
  `;
}

function getBreakBasedOnAssignmentType() {
  if (!currentFocusTask) {
    return "Stand up, stretch, drink water, and rest your eyes.";
  }

  const assignmentType = currentFocusTask.assignmentType;

  const offlineBreaks = [
    "Stand up and stretch.",
    "Drink water and rest your eyes.",
    "Walk around the room.",
    "Step outside for fresh air.",
    "Do 10 slow shoulder rolls.",
    "Take a short walk.",
    "Play basketball outside for a few minutes.",
    "Look at something far away to relax your eyes."
  ];

  const onlineBreaks = [
    "Watch one short relaxing video with a timer.",
    "Listen to one song.",
    "Send one quick message to a friend.",
    "Play one quick brain game for 3 minutes."
  ];

  const mixedBreaks = [
    "Drink water and stretch first, then decide if you still need a short online break.",
    "Take a 3-minute offline break before checking your phone.",
    "Walk around for 2 minutes, then listen to one song if you still need a mood reset."
  ];

  if (assignmentType === "online") {
    return chooseRandomItem(offlineBreaks) + " Since your task was online, avoid screen-based breaks right now.";
  }

  if (assignmentType === "paper") {
    if (breakActivities.length > 0) {
      return escapeHTML(chooseRandomBreakActivity()) + " Since your task was on paper, this break is allowed.";
    }

    return chooseRandomItem(onlineBreaks) + " Since your task was on paper, a short online break is okay if you use a timer.";
  }

  if (assignmentType === "mixed") {
    return chooseRandomItem(mixedBreaks);
  }

  return "Stand up, stretch, drink water, and rest your eyes.";
}

/* -----------------------------
   Smart Break Suggestion
----------------------------- */

function generateSmartBreak() {
  const breakTime = document.getElementById("breakTime").value;
  const breakLocation = document.getElementById("breakLocation").value;
  const energyLevel = document.getElementById("energyLevel").value;
  const breakType = document.getElementById("breakType").value;
  const resultBox = document.getElementById("smartBreakResult");

  let suggestion = "";
  let reason = "";
  let tags = [];

  if (energyLevel === "tired" && breakType === "calm") {
    suggestion = "Rest your eyes, drink water, and do slow breathing for 5 minutes.";
    reason = "You seem tired, so your brain probably needs a low-effort reset.";
    tags = ["Calm", "Low Energy", "Eye Rest"];
  } else if (energyLevel === "restless" && breakType === "active") {
    suggestion = "Walk around, stretch, or play basketball for a few minutes.";
    reason = "Restlessness usually means your body needs movement before your mind can focus again.";
    tags = ["Active", "Movement", "Reset"];
  } else if (energyLevel === "stressed" && breakType === "calm") {
    suggestion = "Try a breathing break, stretch your shoulders, and avoid your phone.";
    reason = "A quiet break can help lower stress without adding more stimulation.";
    tags = ["Stress Relief", "Calm", "No Phone"];
  } else if (breakLocation === "outdoor" && breakType === "active") {
    suggestion = "Go outside for a short walk or shoot basketball for a few minutes.";
    reason = "An outdoor active break helps reset your mood and gives your eyes a break.";
    tags = ["Outdoor", "Active", "Mood Boost"];
  } else if (breakType === "fun") {
    suggestion = "Listen to one song, draw something quick, or do a short fun activity.";
    reason = "A short fun break can improve your mood without pulling you too far away from studying.";
    tags = ["Fun", "Mood Reset", "Short"];
  } else {
    suggestion = "Stand up, stretch, drink water, and look away from your screen.";
    reason = "This balanced break works well for most study sessions.";
    tags = ["Balanced", "Healthy", "Simple"];
  }

  if (breakActivities.length > 0) {
    suggestion = chooseRandomBreakActivity();
    reason = "This was chosen from your own accessible break activities.";
    tags.push("From Your List");
  }

  if (currentFocusTask && currentFocusTask.assignmentType === "online") {
    const lowerSuggestion = suggestion.toLowerCase();

    if (
      lowerSuggestion.includes("phone") ||
      lowerSuggestion.includes("video") ||
      lowerSuggestion.includes("online") ||
      lowerSuggestion.includes("youtube") ||
      lowerSuggestion.includes("tiktok") ||
      lowerSuggestion.includes("game")
    ) {
      suggestion = "Take an offline break instead: stand up, stretch, drink water, and rest your eyes.";
      reason = "Your current task is online, so BrainBreak avoids recommending another screen-based break.";
      tags = ["Screen Recovery", "Offline Break", "Eye Rest"];
    }
  }

  let timeText = "";

  if (breakTime === "short") {
    timeText = "Try this for 3–5 minutes.";
  } else if (breakTime === "medium") {
    timeText = "Try this for 5–10 minutes.";
  } else {
    timeText = "Try this for 10–20 minutes.";
  }

  let tagHTML = "";

  tags.forEach(function(tag) {
    tagHTML += `<span class="suggestion-tag">${escapeHTML(tag)}</span>`;
  });

  resultBox.innerHTML = `
    <h3>BrainBreak Suggestion</h3>
    <div class="suggestion-card">
      <h4>${escapeHTML(suggestion)}</h4>
      <p><strong>Why this helps:</strong> ${escapeHTML(reason)}</p>
      <p><strong>Suggested time:</strong> ${timeText}</p>
      <div>${tagHTML}</div>
    </div>
  `;
}

/* -----------------------------
   BrainBreak Coach
----------------------------- */

function sendFakeChatMessage() {
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  if (!chatInput || !chatMessages) {
    alert("Chat box was not found. Check the IDs in index.html.");
    return;
  }

  const message = chatInput.value.trim();

  if (message === "") {
    alert("Please type a message first.");
    return;
  }

  chatMessages.innerHTML += `
    <div class="user-message">${escapeHTML(message)}</div>
  `;

  chatInput.value = "";

  const reply = generateCoachReply(message);

  setTimeout(function() {
    chatMessages.innerHTML += `
      <div class="bot-message">${reply}</div>
    `;

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 400);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateCoachReply(message) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("online") ||
    lowerMessage.includes("phone") ||
    lowerMessage.includes("youtube") ||
    lowerMessage.includes("tiktok") ||
    lowerMessage.includes("screen")
  ) {
    return getOnlineBreakReply();
  }

  if (
    lowerMessage.includes("tired") ||
    lowerMessage.includes("sleepy") ||
    lowerMessage.includes("exhausted")
  ) {
    return getTiredReply();
  }

  if (
    lowerMessage.includes("stress") ||
    lowerMessage.includes("stressed") ||
    lowerMessage.includes("overwhelmed") ||
    lowerMessage.includes("too much")
  ) {
    return getStressedReply();
  }

  if (
    lowerMessage.includes("first") ||
    lowerMessage.includes("start") ||
    lowerMessage.includes("order") ||
    lowerMessage.includes("what should i do")
  ) {
    return getTaskPlanningReply();
  }

  if (
    lowerMessage.includes("break") ||
    lowerMessage.includes("pause") ||
    lowerMessage.includes("rest")
  ) {
    return getBreakReply();
  }

  if (
    lowerMessage.includes("procrastinate") ||
    lowerMessage.includes("procrastinating") ||
    lowerMessage.includes("lazy") ||
    lowerMessage.includes("can't focus") ||
    lowerMessage.includes("cannot focus")
  ) {
    return getFocusReply();
  }

  if (
    lowerMessage.includes("reward") ||
    lowerMessage.includes("motivation") ||
    lowerMessage.includes("motivated")
  ) {
    return getMotivationReply();
  }

  return getDefaultCoachReply();
}

function getTiredReply() {
  let suggestion = "Take a 5-minute reset: drink water, rest your eyes, and do one slow stretch.";

  if (breakActivities.length > 0) {
    suggestion = "Pick one low-effort break from your list: " + chooseRandomBreakActivity() + ".";
  }

  return `
    It sounds like your brain needs a reset, not more pressure.
    <div class="coach-tip">
      <strong>Try this:</strong> ${escapeHTML(suggestion)}
    </div>
    After that, start with the easiest task for 10 minutes only.
  `;
}

function getStressedReply() {
  return `
    When you feel overwhelmed, the goal is not to finish everything at once. The goal is to choose one clear next step.
    <div class="coach-tip">
      <strong>Try this:</strong> Start with one small piece of one task.
    </div>
    Use a 20–25 minute focus session, then take a real break.
  `;
}

function getTaskPlanningReply() {
  const sortedTasks = getSortedIncompleteTasks();

  if (sortedTasks.length === 0) {
    return `
      I do not see any incomplete tasks yet.
      <div class="coach-tip">
        Go to <strong>Add Tasks</strong> and enter your assignments first. Then I can help you decide what to do first.
      </div>
    `;
  }

  const firstTask = sortedTasks[0];

  return `
    Based on your task list, I would start with:
    <div class="coach-tip">
      <strong>${escapeHTML(firstTask.name)}</strong><br>
      Priority: ${firstTask.priority}<br>
      Estimated time: ${firstTask.minutes || "Not entered"} minutes<br>
      Assignment type: ${getAssignmentTypeLabel(firstTask.assignmentType)}
    </div>
    Start with just 10 minutes. Once you begin, it usually feels easier to continue.
  `;
}

function getBreakReply() {
  let breakIdea = "Stand up, stretch, drink water, and look away from your screen.";

  if (currentFocusTask) {
    breakIdea = getBreakBasedOnAssignmentType();
  } else if (breakActivities.length > 0) {
    breakIdea = chooseRandomBreakActivity();
  }

  return `
    Yes, taking a break can help you focus better when you come back.
    <div class="coach-tip">
      <strong>Suggested break:</strong> ${escapeHTML(breakIdea)}
    </div>
    Keep the break short so it refreshes you without turning into procrastination.
  `;
}

function getOnlineBreakReply() {
  if (currentFocusTask && currentFocusTask.assignmentType === "online") {
    return `
      Since your current task is online, I do not recommend an online break right now.
      <div class="coach-tip">
        <strong>Better break:</strong> Stand up, stretch, drink water, walk around, or rest your eyes.
      </div>
      Your brain and eyes need time away from screens.
    `;
  }

  if (currentFocusTask && currentFocusTask.assignmentType === "paper") {
    return `
      Since your current task is on paper, a short online break can be okay.
      <div class="coach-tip">
        <strong>Rule:</strong> Set a timer first. Keep it short so it does not turn into scrolling.
      </div>
      A song, a short video, or a quick message is better than endless scrolling.
    `;
  }

  if (currentFocusTask && currentFocusTask.assignmentType === "mixed") {
    return `
      Since your current task is mixed, start with an offline break first.
      <div class="coach-tip">
        <strong>Try this:</strong> Stretch, drink water, or walk for 3 minutes before using your phone.
      </div>
      If you still want an online break, keep it very short.
    `;
  }

  return `
    Online breaks depend on what kind of assignment you were doing.
    <div class="coach-tip">
      <strong>Rule:</strong> If your assignment is already online, avoid an online break. If it is on paper, a short online break can be okay with a timer.
    </div>
  `;
}

function getFocusReply() {
  return `
    You do not need to feel fully motivated to start. Make the first step tiny.
    <div class="coach-tip">
      <strong>Try this:</strong> Set a 10-minute timer and work on only the first small part of one task.
    </div>
    After 10 minutes, you can decide whether to continue or take a short break.
  `;
}

function getMotivationReply() {
  return `
    Give yourself something to look forward to after finishing your work.
    <div class="coach-tip">
      <strong>Reward idea:</strong> After completing 2 focus sessions, take a fun break like music, a snack, a walk, or a favorite activity.
    </div>
    Rewards work best when they are planned before you start.
  `;
}

function getDefaultCoachReply() {
  return `
    I can help with planning, focus, breaks, and burnout prevention.
    <div class="coach-tip">
      Try asking: <strong>“What should I do first?”</strong>, <strong>“I feel tired”</strong>, or <strong>“Can I take an online break?”</strong>
    </div>
  `;
}

/* -----------------------------
   Helpers
----------------------------- */

function chooseRandomBreakActivity() {
  const randomIndex = Math.floor(Math.random() * breakActivities.length);
  return breakActivities[randomIndex];
}

function chooseRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

function useQuickPrompt(promptText) {
  const chatInput = document.getElementById("chatInput");

  if (!chatInput) {
    alert("Chat input was not found.");
    return;
  }

  chatInput.value = promptText;
  sendFakeChatMessage();
}

function handleChatKey(event) {
  if (event.key === "Enter") {
    sendFakeChatMessage();
  }
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
/* -----------------------------
   Profile, Local Sign-In, Classes, Settings, and Theme
----------------------------- */

let savedClasses = [];

/* Local Email Sign-In */

function localSignIn() {
  const emailInput = document.getElementById("userEmail");
  const email = emailInput.value.trim();

  if (email === "") {
    alert("Please enter your email.");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Please enter a valid email address.");
    return;
  }

  localStorage.setItem("brainBreakSignedInEmail", email);
  displaySignInStatus();
}

function localSignOut() {
  localStorage.removeItem("brainBreakSignedInEmail");
  displaySignInStatus();
}

function displaySignInStatus() {
  const statusBox = document.getElementById("signInStatus");
  const emailInput = document.getElementById("userEmail");

  if (!statusBox) {
    return;
  }

  const savedEmail = localStorage.getItem("brainBreakSignedInEmail");

  if (!savedEmail) {
    statusBox.innerHTML = "<p>Not signed in yet.</p>";

    if (emailInput) {
      emailInput.value = "";
    }

    return;
  }

  statusBox.innerHTML = `
    <p><strong>Signed in as:</strong> ${escapeHTML(savedEmail)}</p>
  `;

  if (emailInput) {
    emailInput.value = savedEmail;
  }
}

/* Student Profile */

function saveProfile() {
  const studentName = document.getElementById("studentName").value;
  const gradeLevel = document.getElementById("gradeLevel").value;
  const studyGoal = document.getElementById("studyGoal").value;

  const profile = {
    studentName: studentName,
    gradeLevel: gradeLevel,
    studyGoal: studyGoal
  };

  localStorage.setItem("brainBreakProfile", JSON.stringify(profile));
  displayProfile();
}

function displayProfile() {
  const profileSummary = document.getElementById("profileSummary");

  if (!profileSummary) {
    return;
  }

  const savedProfile = localStorage.getItem("brainBreakProfile");

  if (!savedProfile) {
    profileSummary.innerHTML = "<p>No profile saved yet.</p>";
    return;
  }

  const profile = JSON.parse(savedProfile);

  profileSummary.innerHTML = `
    <strong>Name:</strong> ${escapeHTML(profile.studentName || "Not entered")}<br>
    <strong>Grade:</strong> ${escapeHTML(profile.gradeLevel || "Not entered")}<br>
    <strong>Goal:</strong> ${escapeHTML(profile.studyGoal || "Not entered")}
  `;

  document.getElementById("studentName").value = profile.studentName || "";
  document.getElementById("gradeLevel").value = profile.gradeLevel || "11th Grade";
  document.getElementById("studyGoal").value = profile.studyGoal || "";
}

/* Saved Classes */

function addClass() {
  const classInput = document.getElementById("classNameInput");
  const className = classInput.value.trim();

  if (className === "") {
    alert("Please enter a class name.");
    return;
  }

  savedClasses.push(className);
  localStorage.setItem("brainBreakClasses", JSON.stringify(savedClasses));

  classInput.value = "";
  displayClasses();
}

function displayClasses() {
  const classList = document.getElementById("classList");

  if (!classList) {
    return;
  }

  if (savedClasses.length === 0) {
    classList.innerHTML = "<p>No classes saved yet.</p>";
    return;
  }

  classList.innerHTML = "";

  savedClasses.forEach(function(className, index) {
    classList.innerHTML += `
      <div class="class-row">
        <span class="class-pill">${escapeHTML(className)}</span>
        <button onclick="deleteClass(${index})">Delete</button>
      </div>
    `;
  });
}

function deleteClass(index) {
  savedClasses.splice(index, 1);
  localStorage.setItem("brainBreakClasses", JSON.stringify(savedClasses));
  displayClasses();
}

/* Study Settings */

function saveStudySettings() {
  const preferredFocus = document.getElementById("preferredFocus").value;
  const preferredBreak = document.getElementById("preferredBreak").value;
  const studyStyle = document.getElementById("studyStyle").value;

  const settings = {
    preferredFocus: preferredFocus,
    preferredBreak: preferredBreak,
    studyStyle: studyStyle
  };

  localStorage.setItem("brainBreakStudySettings", JSON.stringify(settings));
  displayStudySettings();
}

function displayStudySettings() {
  const summary = document.getElementById("studySettingsSummary");

  if (!summary) {
    return;
  }

  const savedSettings = localStorage.getItem("brainBreakStudySettings");

  if (!savedSettings) {
    summary.innerHTML = "<p>No study settings saved yet.</p>";
    return;
  }

  const settings = JSON.parse(savedSettings);

  summary.innerHTML = `
    <strong>Preferred Focus:</strong> ${settings.preferredFocus} minutes<br>
    <strong>Preferred Break:</strong> ${settings.preferredBreak} minutes<br>
    <strong>Study Style:</strong> ${escapeHTML(settings.studyStyle)}
  `;

  document.getElementById("preferredFocus").value = settings.preferredFocus || "25";
  document.getElementById("preferredBreak").value = settings.preferredBreak || "5";
  document.getElementById("studyStyle").value = settings.studyStyle || "Balanced";
}

/* Theme Settings */

function changeTheme(themeName) {
  const themeClasses = [
    "theme-calm-blue",
    "theme-lavender",
    "theme-mint",
    "theme-sunset",
    "theme-dark"
  ];

  themeClasses.forEach(function(themeClass) {
    document.body.classList.remove(themeClass);
  });

  document.body.classList.add("theme-" + themeName);

  localStorage.setItem("brainBreakTheme", themeName);
  updateThemeLabel(themeName);
}

function updateThemeLabel(themeName) {
  const currentThemeText = document.getElementById("currentThemeText");

  if (!currentThemeText) {
    return;
  }

  const themeLabels = {
    "calm-blue": "Calm Blue",
    "lavender": "Lavender Focus",
    "mint": "Mint Energy",
    "sunset": "Sunset",
    "dark": "Dark Mode"
  };

  currentThemeText.textContent = "Current theme: " + themeLabels[themeName];
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("brainBreakTheme") || "calm-blue";
  changeTheme(savedTheme);
}

/* Load All Settings Data */

function loadSettingsPageData() {
  const classData = localStorage.getItem("brainBreakClasses");

  if (classData) {
    savedClasses = JSON.parse(classData);
  }

  displaySignInStatus();
  displayProfile();
  displayClasses();
  displayStudySettings();
  loadSavedTheme();
}

document.addEventListener("DOMContentLoaded", function() {
  if (typeof loadSettingsPageData === "function") {
    loadSettingsPageData();
  }

  loadTodoItems();
  setupEnterKeyShortcuts();
});

/* -----------------------------
   To-Do List
----------------------------- */

let todoItems = [];

function addTodoItem() {
  const todoInput = document.getElementById("todoInput");
  const todoText = todoInput.value.trim();

  if (todoText === "") {
    alert("Please enter a to-do item.");
    return;
  }

  const todoItem = {
    text: todoText,
    completed: false
  };

  todoItems.push(todoItem);
  saveTodoItems();
  displayTodoItems();

  todoInput.value = "";
}

function displayTodoItems() {
  const todoList = document.getElementById("todoList");

  if (!todoList) {
    return;
  }

  if (todoItems.length === 0) {
    todoList.innerHTML = `
      <h3>Your To-Do List</h3>
      <p>No to-do items added yet.</p>
    `;
    return;
  }

  todoList.innerHTML = "<h3>Your To-Do List</h3>";

  todoItems.forEach(function(item, index) {
    const completedClass = item.completed ? "completed" : "";
    const buttonText = item.completed ? "Undo" : "Complete";

    todoList.innerHTML += `
      <div class="todo-item">
        <span class="todo-text ${completedClass}">
          ${index + 1}. ${escapeHTML(item.text)}
        </span>

        <div class="todo-actions">
          <button onclick="toggleTodoItem(${index})">${buttonText}</button>
          <button onclick="deleteTodoItem(${index})">Delete</button>
        </div>
      </div>
    `;
  });
}

function toggleTodoItem(index) {
  todoItems[index].completed = !todoItems[index].completed;
  saveTodoItems();
  displayTodoItems();
}

function deleteTodoItem(index) {
  todoItems.splice(index, 1);
  saveTodoItems();
  displayTodoItems();
}

function saveTodoItems() {
  localStorage.setItem("brainBreakTodoItems", JSON.stringify(todoItems));
}

function loadTodoItems() {
  const savedTodos = localStorage.getItem("brainBreakTodoItems");

  if (savedTodos) {
    todoItems = JSON.parse(savedTodos);
  }

  displayTodoItems();
}

function handleTodoEnter(event) {
  if (event.key === "Enter") {
    addTodoItem();
  }
}
/* -----------------------------
   Enter Key Shortcuts
----------------------------- */

function setupEnterKeyShortcuts() {
  const taskNameInput = document.getElementById("taskName");
  const breakActivityInput = document.getElementById("breakActivity");
  const classNameInput = document.getElementById("classNameInput");
  const userEmailInput = document.getElementById("userEmail");

  if (taskNameInput) {
    taskNameInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        addTask();
      }
    });
  }

  if (breakActivityInput) {
    breakActivityInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        addBreakActivity();
      }
    });
  }

  if (classNameInput) {
    classNameInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        addClass();
      }
    });
  }

  if (userEmailInput) {
    userEmailInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        localSignIn();
      }
    });
  }
}