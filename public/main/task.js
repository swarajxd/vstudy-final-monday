document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ task.js script loaded.");

    const body = document.querySelector("body");
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.querySelector(".toggle"); // Ensure this class matches your sidebar toggle button
    const modeSwitch = document.querySelector(".toggle-switch"); // Dark mode toggle switch
    const modeText = document.querySelector(".mode-text"); // Text next to toggle

    if (!body) {
        console.error("❌ Body element not found!");
        return;
    }

    // ✅ Sidebar toggle functionality
    if (toggle && sidebar) {
        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("close");
        });
    } else {
        console.warn("⚠️ Sidebar toggle or sidebar element not found.");
    }

    // ✅ Apply previously set dark mode state
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
        if (modeText) modeText.innerText = "Light Mode";
        console.log("🌙 Dark mode applied from localStorage.");
    }

    // ✅ Dark mode toggle
    if (modeSwitch) {
        modeSwitch.addEventListener("click", () => {
            body.classList.toggle("dark");

            if (body.classList.contains("dark")) {
                localStorage.setItem("darkMode", "enabled");
                if (modeText) modeText.innerText = "Light Mode";
                console.log("🌙 Dark mode enabled.");
            } else {
                localStorage.setItem("darkMode", "disabled");
                if (modeText) modeText.innerText = "Dark Mode";
                console.log("☀️ Dark mode disabled.");
            }
        });
    } else {
        console.warn("⚠️ Dark mode toggle switch not found.");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close-modal");
    const taskTitle = document.getElementById("task-title");
    const taskDescription = document.getElementById("task-description");
    const taskDate = document.getElementById("task-date");
    const createTaskBtn = document.getElementById("create-task");
    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");
    const step3 = document.getElementById("step-3");
    const next1 = document.getElementById("next-1");
    const next2 = document.getElementById("next-2");
    const categoryButtons = document.querySelectorAll(".category-btn");
  
    let tasks = [];
    let currentStep = 1;
    let selectedCategory = "";
  
    if (typeof flatpickr !== "undefined") {
        flatpickr(taskDate, {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
        });
    }
    
    addTaskBtn.addEventListener("click", () => {
        modal.style.display = "block";
        currentStep = 1;
        showStep(currentStep);
    });
  
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        resetForm();
    });
  
    next1.addEventListener("click", () => {
        if (taskTitle.value.trim() !== "") {
            currentStep = 2;
            showStep(currentStep);
        }
    });
  
    next2.addEventListener("click", () => {
        if (taskDate.value.trim() !== "") {
            currentStep = 3;
            showStep(currentStep);
        }
    });
  
    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            categoryButtons.forEach((btn) => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedCategory = button.dataset.category;
        });
    });
  // new create func
  createTaskBtn.addEventListener("click", async () => {
    if (taskTitle.value.trim() !== "" && taskDate.value.trim() !== "" && selectedCategory !== "") {
        const newTask = {
            title: taskTitle.value,
            description: taskDescription.value,
            date: taskDate.value,
            category: selectedCategory,
            completed: false,
        };

        try {
            const token = localStorage.getItem("token"); // ✅ Get the stored token
            if (!token) {
                console.error("❌ No token found! User might be logged out.");
                alert("Unauthorized! Please log in again.");
                return;
            }

            const response = await fetch("http://localhost:5000/api/tasks", {  // ✅ Make sure this matches your backend
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`, // ✅ Add the token here
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                const savedTask = await response.json();
                console.log("✅ Task saved:", savedTask);

                 // Fetch and render tasks again
                 fetchTasks();
                 modal.style.display = "none";
                 resetForm();
             } else {
                 console.error("❌ Error saving task:", response.statusText);
             }
         } catch (error) {
             console.error("⚠️ Network error:", error);
         }
     }
 });
 


  
    function showStep(step) {
        step1.classList.add("hidden");
        step2.classList.add("hidden");
        step3.classList.add("hidden");
  
        document.getElementById(`step-${step}`).classList.remove("hidden");
    }
  
    function resetForm() {
        taskTitle.value = "";
        taskDescription.value = "";
        taskDate.value = "";
        selectedCategory = "";
        categoryButtons.forEach((btn) => btn.classList.remove("selected"));
        currentStep = 1;
        showStep(currentStep);
    }
    /*function renderTasks() {
        console.log("🔄 Rendering Tasks...", tasks);
    
        // Clear previous task lists
        document.querySelectorAll(".task-list").forEach(list => list.innerHTML = "");
    
        // Loop through tasks and add them to the correct category column
        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task-item");
            taskElement.innerHTML = `
                <div class="task-header">
                    <h3>${task.title}</h3>
                    <span>${task.date.toLocaleString()}</span>
                </div>
                <p>${task.description}</p>
                <button onclick="deleteTask(${task.id})">❌</button>
            `;
    
            // Append task to the correct category column
            const categoryColumn = document.getElementById(task.category.toLowerCase());
            if (categoryColumn) {
                categoryColumn.querySelector(".task-list").appendChild(taskElement);
            } else {
                console.warn("⚠️ Category column not found for:", task.category);
            }
        });
    
        console.log("✅ Tasks Rendered!");
    }*/
    
        function renderTasks() {
            console.log("📌 Tasks Data:", tasks);
        
            const columns = {
                Mathematics: document.querySelector("#mathematics .task-list"),
                Chemistry: document.querySelector("#chemistry .task-list"),
                Physics: document.querySelector("#physics .task-list"),
            };
        
            for (const category in columns) {
                if (columns[category]) {
                    columns[category].innerHTML = "";
                }
            }
        
            tasks.forEach((task) => {
                if (task.completed) {
                    return; // ✅ Hide completed tasks from UI but keep them in the database
                }
        
                const taskElement = document.createElement("div");
                taskElement.className = "task-item";
        
                let imageSrc = "";
                switch (task.category) {
                    case "Mathematics":
                        imageSrc = "./chalkboard.png";
                        break;
                    case "Chemistry":
                        imageSrc = "./lab.png";
                        break;
                    case "Physics":
                        imageSrc = "./todophy.png";
                        break;
                }
        
                taskElement.innerHTML = `
                    <div class="task-container">
                        <div class="imgbox">
                            <img src="${imageSrc}" class="task-image" alt="${task.category}">
                        </div>
                        <div class="task-info">
                            <label class="container1">
                                <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
                                <div class="checkmark"></div>
                            </label>
                            <div>
                                <div class="head">
                                    <div class="task-title">${task.title}</div>
                                    <div class="task-description">${task.description}</div>
                                </div>
                                <div class="task-date">${task.date.toLocaleString()}</div>
                            </div>
                        </div>
                        <button class="delete-btn" data-id="${task.id}">
                            <svg viewBox="0 0 448 512" class="svgIcon">
                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                            </svg>
                        </button>
                    </div>
                `;
        
                // ✅ Task Check: Mark as Completed
                taskElement.querySelector(".task-check").addEventListener("change", async () => {
                    task.completed = !task.completed;
        
                    try {
                        const token = localStorage.getItem("token");
                        const response = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
                            method: "PUT", // No change to method since you used PUT
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ completed: task.completed }),
                        });
        
                        if (response.ok) {
                            console.log(`✅ Task ${task.id} updated successfully!`);
                             // ✅ Remove completed task from frontend
                            //delay
                            setTimeout(() => {
                                renderTasks();
                            }, 500); // 500ms delay
                        
                        } else {
                            console.error(`❌ Failed to update task ${task.id}`);
                        }
                    } catch (error) {
                        console.error("⚠️ Network error while updating task:", error);
                    }
                });
        
                // ✅ Task Delete
                taskElement.querySelector(".delete-btn").addEventListener("click", async () => {
                    try {
                        const token = localStorage.getItem("token");
                        const response = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        });
        
                        if (response.ok) {
                            console.log(`🗑️ Task ${task.id} deleted successfully!`);
                            tasks = tasks.filter((t) => t.id !== task.id);
                            renderTasks();
                        } else {
                            console.error(`❌ Failed to delete task ${task.id}`);
                        }
                    } catch (error) {
                        console.error("⚠️ Network error while deleting task:", error);
                    }
                });
        
                columns[task.category].appendChild(taskElement);
            });
        }
        
    window.fetchTasks = async function () {
        console.log("⚡ fetchTasks() function is running...");
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ No token found! User is not logged in.");
                return;
            }
    
            const response = await fetch("http://localhost:5000/api/tasks", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            console.log(`🔄 Fetch Response Status: ${response.status}`);
    
            if (!response.ok) {
                console.error(`❌ Fetch failed with status: ${response.status}`);
                return;
            }
    
            const data = await response.json();  // ✅ Fix: Store full response
            const fetchedTasks = data.tasks;     // ✅ Fix: Extract `tasks` array
    
            console.log("🛠 API Response Data:", fetchedTasks);
    
            if (Array.isArray(fetchedTasks)) {
                tasks = fetchedTasks; // ✅ Store tasks globally
                renderTasks(); // ✅ Re-render UI
            } else {
                console.warn("⚠️ No tasks found.");
                tasks = [];
                renderTasks();
            }
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
        }
    };
    
    
    // Run on page load
   /* document.addEventListener("DOMContentLoaded", () => {
        fetchTasks(); // ✅ Fetch tasks when the page loads
    });*/
    


    renderTasks();
  
    
    const textElement = document.getElementById("text");
    if (textElement) {
        const text = textElement.innerText;
        textElement.innerText = "";
        text.split("").forEach((char, index) => {
            const span = document.createElement("span");
            span.innerText = char;
            span.style.animationDelay = `${index * 0.1}s`;
            textElement.appendChild(span);
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    fetchTasks(); // ✅ Fetch tasks when the page loads
});