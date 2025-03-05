const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle=body.querySelector(".toggle1"),
    modeSwitch=body.querySelector(".toggle-switch"),
    modeText=body.querySelector(".mode-text");

    toggle.addEventListener("click",() =>{
        sidebar.classList.toggle("close");
    });

    //darkmode dont switch
    document.addEventListener("DOMContentLoaded", () => {
      const body = document.querySelector("body");
      const modeSwitch = document.querySelector(".toggle-switch"); // Dark mode toggle switch
      const modeText = document.querySelector(".mode-text"); // Text next to toggle
  
      // ✅ Apply dark mode if it was previously enabled
      if (localStorage.getItem("darkMode") === "enabled") {
          body.classList.add("dark");
          modeText.innerText = "Light Mode";
      }
  
      // ✅ Toggle dark mode on click
      if (modeSwitch) {
          modeSwitch.addEventListener("click", () => {
              body.classList.toggle("dark");
  
              if (body.classList.contains("dark")) {
                  localStorage.setItem("darkMode", "enabled"); // ✅ Save state
                  modeText.innerText = "Light Mode";
              } else {
                  localStorage.setItem("darkMode", "disabled"); // ✅ Save state
                  modeText.innerText = "Dark Mode";
              }
          });
      } else {
          console.warn("⚠️ Dark mode toggle switch not found on this page.");
      }
  });
  
    document.addEventListener("DOMContentLoaded", () => {
      const soundButton = document.querySelector('.sound-btn[data-sound="Rainy"]');
      const body = document.body;
    
      soundButton.addEventListener("click", () => {
        if (body.style.background === "var(--rain-body)") {
          body.style.background = ""; // Reset background
        } else {
          body.style.background = "var(--rain-body)"; // Change to rain background
        }
      });
    });
    
document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("time-display")
  const timerStatus = document.getElementById("timer-status")
  const startPauseBtn = document.getElementById("start-pause-btn")
  const resetBtn = document.getElementById("reset-btn")
  const sessionInput = document.getElementById("session-input")
  const breakInput = document.getElementById("break-input")

  let timeLeft = 1800 // 29:59 in seconds
  let isRunning = false
  let hasStarted = false
  let intervalId
  let startTime; // Store session start time

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft)
  }

  function startTimer() {
    isRunning = true;
    hasStarted = true;
    timerStatus.textContent = "Running";
    startPauseBtn.textContent = "❚❚ PAUSE";
    resetBtn.style.display = "inline";
    startTime = Date.now(); // Capture the session start time

    intervalId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            clearInterval(intervalId);
            isRunning = false;
            timerStatus.textContent = "Finished";
            startPauseBtn.textContent = "▶ START";
            endPomodoroSession(); // Call when session ends
        }
    }, 1000);
}

  function pauseTimer() {
    isRunning = false
    timerStatus.textContent = "Paused"
    startPauseBtn.textContent = "▶ START"
    clearInterval(intervalId)
  }

  function resetTimer() {
    isRunning = false;
    hasStarted = false;
    timerStatus.textContent = "";
    startPauseBtn.textContent = "▶ START";
    resetBtn.style.display = "none";
    clearInterval(intervalId);
    timeLeft = Number.parseInt(sessionInput.value) * 60;
    updateDisplay();
}

function calculateTotalTime() {
    let endTime = Date.now();
    let totalTime = Math.floor((endTime - startTime) / 1000); // Convert to seconds
    totalTime=totalTime/60;
    return totalTime;
}

function saveTotalTimeToDatabase(totalTime) {
    let email = localStorage.getItem("email"); // ✅ Get email

    if (!email) {
        console.error("User email is missing. Make sure the user is logged in.");
        alert("You need to log in before using the Pomodoro timer.");
        return;
    }

    fetch("http://localhost:5000/save-pomodoro-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, time_spent: totalTime }) // ✅ Send email & time
    })
    .then(response => response.json())
    .then(data => {
        console.log("Time saved successfully:", data);
    })
    .catch(error => {
        console.error("Error saving time:", error);
    });
}


function endPomodoroSession() {
    let totalTime = calculateTotalTime();
    console.log("Pomodoro session ended. Total time:", totalTime);
    saveTotalTimeToDatabase(totalTime);
}

startPauseBtn.addEventListener("click", () => {
    if (!hasStarted) {
        timeLeft = Number.parseInt(sessionInput.value) * 60;
    }
    isRunning ? pauseTimer() : startTimer();
});

resetBtn.addEventListener("click", resetTimer);

function updateTime(input, increment) {
    let value = Number.parseInt(input.value) + increment;
    value = Math.max(1, Math.min(60, value));
    input.value = value;
    if (!hasStarted) {
        timeLeft = Number.parseInt(sessionInput.value) * 60;
        updateDisplay();
    }
}

  document.getElementById("session-up").addEventListener("click", () => updateTime(sessionInput, 1))
  document.getElementById("session-down").addEventListener("click", () => updateTime(sessionInput, -1))
  document.getElementById("break-up").addEventListener("click", () => updateTime(breakInput, 1))
  document.getElementById("break-down").addEventListener("click", () => updateTime(breakInput, -1))

  sessionInput.addEventListener("change", () => {
    if (!hasStarted) {
      timeLeft = Number.parseInt(sessionInput.value) * 60 
      updateDisplay()
    }
  })

  const soundButtons = document.querySelectorAll(".sound-btn")
  soundButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      soundButtons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      // Here you would add logic to change the ambient sound
    })
  })

  updateDisplay()
})

document.addEventListener("DOMContentLoaded", () => {
  const soundButtons = document.querySelectorAll(".sound-btn");
  const body = document.body;
  const rainEffectFront = document.querySelector(".rain.front-row");
  const rainEffectBack = document.querySelector(".rain.back-row");

  soundButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove all background classes before applying new ones
      body.classList.remove("rainy", "forest-bg", "house-bg", "cafe-bg");

      // Remove "active" class from all buttons
      soundButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Check which button was clicked and apply the corresponding background
      const sound = btn.dataset.sound;

      if (sound === "Rainy") {
        body.classList.add("rainy");
        makeItRain();
      } else {
        // Stop rain effect when switching away from "Rainy"
        rainEffectFront.innerHTML = "";
        rainEffectBack.innerHTML = "";
        
        // Apply respective backgrounds
        if (sound === "Forest") body.classList.add("forest-bg");
        if (sound === "Café") body.classList.add("cafe-bg");
        if (sound === "House") body.classList.add("house-bg");
      }
    });
  });

  // Toggle button functionality for rain effect customizations
  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      body.classList.toggle(toggle.classList[0]); // Toggle class based on button clicked
      makeItRain();
    });
  });
});

function makeItRain() {
  const rainEffectFront = document.querySelector(".rain.front-row");
  const rainEffectBack = document.querySelector(".rain.back-row");

  if (!rainEffectFront || !rainEffectBack) return;

  // Clear previous rain effect
  rainEffectFront.innerHTML = "";
  rainEffectBack.innerHTML = "";

  let increment = 0;
  let drops = "";
  let backDrops = "";

  while (increment < 100) {
    let randoHundo = Math.floor(Math.random() * 98) + 1;
    let randoFiver = Math.floor(Math.random() * 4) + 2;
    increment += randoFiver;

    drops += `<div class="drop" style="left: ${increment}%; bottom: ${randoFiver + 100}%; animation-delay: 0.${randoHundo}s;">
                <div class="stem" style="animation-delay: 0.${randoHundo}s;"></div>
                <div class="splat" style="animation-delay: 0.${randoHundo}s;"></div>
              </div>`;

    backDrops += `<div class="drop" style="right: ${increment}%; bottom: ${randoFiver + 100}%; animation-delay: 0.${randoHundo}s;">
                    <div class="stem" style="animation-delay: 0.${randoHundo}s;"></div>
                    <div class="splat" style="animation-delay: 0.${randoHundo}s;"></div>
                  </div>`;
  }

  rainEffectFront.innerHTML = drops;
  rainEffectBack.innerHTML = backDrops;
}

document.addEventListener("DOMContentLoaded", function () {
  const soundButtons = document.querySelectorAll(".sound-btn");

  soundButtons.forEach(button => {
      button.addEventListener("click", function () {
          const sound = button.getAttribute("data-sound");

          // Reset styles and classes for all buttons
          document.body.className = ""; // Removes all background classes
          soundButtons.forEach(btn => btn.classList.remove("active"));

          // Reset text colors to default
          document.querySelector("#time-display").style.color = "";
          document.querySelectorAll(".timer-controls button").forEach(btn => {
              btn.style.color = "";
          });
          document.querySelectorAll(".setting span").forEach(span => {
              span.style.color = "";
          });
          ["#session-up", "#session-input", "#session-down", "#break-up", "#break-input", "#break-down"]
          .forEach(selector => {
              let element = document.querySelector(selector);
              if (element) element.style.color = "";
          });

          // Apply new background and active state
          if (sound === "Café") {
              document.body.classList.add("cafe-bg");
              button.classList.add("active");

              // Change text color to white
              document.querySelector("#time-display").style.color = "white";
              document.querySelectorAll(".timer-controls button").forEach(btn => {
                  btn.style.color = "white";
              });
              document.querySelectorAll(".setting span").forEach(span => {
                  span.style.color = "white";
              });
              ["#session-up", "#session-input", "#session-down", "#break-up", "#break-input", "#break-down"]
              .forEach(selector => {
                  let element = document.querySelector(selector);
                  if (element) element.style.color = "white";
              });
          } else {
              // Apply background for other sounds if needed
              document.body.classList.add(`${sound.toLowerCase()}-bg`);
              button.classList.add("active");
          }
      });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const soundButtons = document.querySelectorAll(".sound-btn");

  soundButtons.forEach(button => {
      button.addEventListener("click", function () {
          const sound = button.getAttribute("data-sound");

          // Reset styles and classes for all buttons
          document.body.className = ""; // Removes all background classes
          soundButtons.forEach(btn => btn.classList.remove("active"));

          // Reset text colors to default
          document.querySelector("#time-display").style.color = "";
          document.querySelectorAll(".timer-controls button").forEach(btn => {
              btn.style.color = "";
          });
          document.querySelectorAll(".setting span").forEach(span => {
              span.style.color = "";
          });
          ["#session-up", "#session-input", "#session-down", "#break-up", "#break-input", "#break-down"]
          .forEach(selector => {
              let element = document.querySelector(selector);
              if (element) element.style.color = "";
          });

          // Apply new background and active state
          if (sound === "Forest") {
              document.body.classList.add("forest-bg");
              button.classList.add("active");

              // Set text color to **white** for better visibility
              document.querySelector("#time-display").style.color = "#e0d7b8"; 
              document.querySelectorAll(".timer-controls button").forEach(btn => {
                  btn.style.color = "#e0d7b8";
              });
              document.querySelectorAll(".setting span").forEach(span => {
                  span.style.color = "#e0d7b8";
              });
              ["#session-up", "#session-input", "#session-down", "#break-up", "#break-input", "#break-down"]
              .forEach(selector => {
                  let element = document.querySelector(selector);
                  if (element) element.style.color = "#e0d7b8";
              });
          } else if (sound === "Café") {
              document.body.classList.add("cafe-bg");
              button.classList.add("active");

              // Change text color to white for café theme
              document.querySelector("#time-display").style.color = "#e0d7b8";
              document.querySelectorAll(".timer-controls button").forEach(btn => {
                  btn.style.color = "#e0d7b8";
              });
              document.querySelectorAll(".setting span").forEach(span => {
                  span.style.color = "#e0d7b8";
              });
              ["#session-up", "#session-input", "#session-down", "#break-up", "#break-input", "#break-down"]
              .forEach(selector => {
                  let element = document.querySelector(selector);
                  if (element) element.style.color = "#e0d7b8";
              });
          } else if (sound === "Peace") { // Fix for House button
              document.body.classList.add("house-bg");
              button.classList.add("active");

              // Set text color to white for better visibility
              document.querySelector("#time-display").style.color = "#e0d7b8";
              document.querySelectorAll(".timer-controls button").forEach(btn => {
                  btn.style.color = "#e0d7b8";
              });
              document.querySelectorAll(".setting span").forEach(span => {
                  span.style.color = "#e0d7b8";
              });
              ["#session-up", "#session-input", "#session-down", "#break-up", "#break-input", "#break-down"]
              .forEach(selector => {
                  let element = document.querySelector(selector);
                  if (element) element.style.color = "#e0d7b8";
              });
          } else {
              // Apply background for other sounds if needed
              document.body.classList.add(`${sound.toLowerCase()}-bg`);
              button.classList.add("active");
          }
      });
  });
});
let currentAudio = null; // Variable to store the currently playing audio

document.querySelectorAll('.sound-btn').forEach(button => {
    button.addEventListener('click', function() {
        const soundName = this.getAttribute('data-sound').toLowerCase();
        const soundFile = `${soundName}.wav`; // Assuming the audio files are named like "forest.mp3", "rainy.mp3", etc.

        // Stop the currently playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Play the new sound
        currentAudio = new Audio(soundFile);
        currentAudio.loop = true; // Enable looping
        currentAudio.play();
    });
});