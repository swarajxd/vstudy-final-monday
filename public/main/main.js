const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle=body.querySelector(".toggle"),
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

    const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");
// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";
    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }
    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();
prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});
// Welcome username
document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");
    
    if (userName) {
        const welcomeElement = document.getElementById("welcomeMessage");
        if (welcomeElement) {
            welcomeElement.textContent = userName;
        } else {
            console.error("🚨 Element with ID 'welcomeMessage' not found in DOM.");
        }
    } else {
        console.error("❌ No userName found in localStorage!");
    }
});



//Upcoming tasks
document.addEventListener("DOMContentLoaded", async () => {
    const tasksContainer = document.getElementById("tasks-container");

    if (!tasksContainer) {
        console.error("❌ Error: #tasks-container does not exist in the DOM.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found. User may not be logged in.");
            return;
        }

        const response = await fetch("/api/tasks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        console.log("Fetched tasks:", data);

        tasksContainer.innerHTML = ""; // Clear previous tasks

        // Subject images mapping
        const subjectImages = {
            "mathematics": "./chalkboard.png",
            "chemistry": "./lab.png",
            "physics": "./todophy.png"
        };

        // Filter only incomplete tasks (where 'completed' is false)
        const incompleteTasks = data.tasks.filter(task => task.completed === false);

        // Get only the first 6 incomplete tasks
        const tasksToShow = incompleteTasks.slice(0, 5);

        tasksToShow.forEach(task => {
            const subjectClass = task.category.toLowerCase(); // Ensure category is lowercase
            const subjectImage = subjectImages[subjectClass] || "default-image.jpg"; // Default if category not found

            const taskElement = document.createElement("div");
            taskElement.classList.add("task", subjectClass);

            taskElement.innerHTML = `
                <div class="imagebox1">
                    <img src="${subjectImage}" alt="${task.category} Image">
                </div>
                <div class="taskcon">
                    <h2 class="task-title">${task.title}</h2>
                    <div class="task-contain">
                        <p>${task.date || "No date available"}</p>
                    </div>
                </div>
                <i class='bx bx-right-arrow-circle'></i>
            `;

            tasksContainer.appendChild(taskElement);
        });

    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
});

//display studytime
document.addEventListener("DOMContentLoaded", async () => {
    const userEmail = localStorage.getItem("email"); // Get user email from localStorage

    if (!userEmail) {
        console.log("User email not found in localStorage.");
        return;
    }

    try {
        const response = await fetch(`/api/getStudyTime?email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();

        console.log("Study time received:", data.time);

        // Convert minutes to hours and minutes
        const totalMinutes = parseInt(data.time, 10); // Ensure it's a number
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const formattedTime = `${hours} hr : ${minutes} min`;

        // Get the study time display element
        const studyTimeElement = document.getElementById("studyTime");

        if (studyTimeElement) {
            studyTimeElement.innerText = formattedTime;  // ✅ Display formatted time
        } else {
            console.error("Element with ID 'studyTime' not found.");
        }
    } catch (error) {
        console.error("Error fetching study time:", error);
    }
});

      


//graph
const ctx = document.getElementById('myChart').getContext('2d');

// Function to create gradient fill with opacity variation
function createGradient(ctx, color1, color2) {
    let gradient = ctx.createLinearGradient(0, 0, 0, 350); // Vertical gradient
    gradient.addColorStop(0.2, color1);  // Near the line, less opaque
    gradient.addColorStop(0.8, color2);  // Away from the line, more opaque
    return gradient;
}

// Create gradients for datasets
// Assuming 'ctx' is your canvas context
const blueGradient = createGradient(ctx, 'rgba(255, 201, 60, 0.3)', 'rgba(255, 201, 60, 0.1)');
// Assuming 'ctx' is your canvas context
const orangeGradient = createGradient(ctx, 'rgba(255, 111, 60, 0.3)', 'rgba(255, 111, 60, 0.1)');


// Create the chart
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [
            {
                label: 'POMODORO',
                data: [5.7, 4.5, 4, 6.5, 6.2, 9, 6.3],
                borderColor: '#ffc93c',
                backgroundColor: blueGradient,
                borderWidth: 4,
                fill: true,
                tension: 0.4,
                pointRadius: 0, // Hide dots
                pointHoverRadius: 7, // Show dots on hover
                hidden: false
            },
            {
                label: 'TO-DO LIST',
                data: [6.1, 5.5, 7.8, 3.5, 4.2, 2.1, 3.9],
                borderColor: '#ff9a3c',
                backgroundColor: orangeGradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0, // Hide dots
                pointHoverRadius: 7, // Show dots on hover
                hidden: false
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',  // Center the legend at the top
                align: 'center',  // Align the legend in the center
                labels: {
                    font: {
                        size: 14,
                        family: 'Poppins, sans-serif',
                        weight: 'bold'
                    },
                    padding: 20,
                    boxWidth: 12,  // Change to smaller width for a circle (you can adjust this value)
                    usePointStyle: true, // Use point style (circle) for the legend items
                    padding: 10, // Adjust spacing between legend items
                },
                onClick: (e, legendItem, legend) => {
                    const chart = legend.chart;
                    const datasets = chart.data.datasets;
                    const index = legendItem.datasetIndex;
                    const isOnlyVisible = datasets.every((ds, i) => i === index || ds.hidden);
    
                    // Toggle visibility: If one is visible, show both; otherwise, hide the others.
                    datasets.forEach((ds, i) => {
                        ds.hidden = isOnlyVisible ? false : i !== index;
                    });
    
                    chart.update();
                }
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#f1f1f1',
                bodyColor: '#f1f1f1',
                bodyFont: {
                    size: 14,
                    family: 'Poppins, sans-serif',
                    weight: 'normal',
                    style: 'normal'
                },
                padding: 15,
                displayColors: false,
                caretSize: 8,
                cornerRadius: 6,
                boxWidth: 10,
                bodySpacing: 5
            }
        },
        scales: {
            x: {
                title: { display: false },
                grid: { display: false }
            },
            y: {
                title: { display: false },
                min: 1,
                max: 10,
                grid: { display: false },
                ticks: {
                    color: '#555',
                    font: {
                        family: 'Poppins, sans-serif',
                        size: 12,
                        weight: 'bold'
                    },
                    padding: 10
                }
            }
        },
        layout: {
            padding: {
                left: 20,
                right: 20,
                top:0,
                bottom: 20
            }
        },
        elements: {
            line: {
                tension: 0.3,
                borderWidth: 3,
                borderColor: '#42A5F5',
                backgroundColor: 'rgba(66, 165, 245, 0.2)'
            },
            point: {
                radius: 5,
                backgroundColor: '#42A5F5'
            }
        }
    }
});
const students = [
    { name: "Bhavith Shetty", studyTime: 35, goal: 30, profilePic: 'profilepic.jpeg' }, // Replace with actual image path
    { name: "Swaraj Shinde", studyTime: 32, goal: 35, profilePic: 'swaraj.jfif' }, // Replace with actual image path
    { name: "Prakyat Shetty", studyTime: 30, goal: 25, profilePic: 'prakyat.jfif' }, // Replace with actual image path
    { name: "Taha Sayad", studyTime: 28, goal: 30, profilePic: 'taha.jfif' }, // Replace with actual image path
    { name: "Tanmay Shelar", studyTime: 25, goal: 20, profilePic: 'tanmay.jpg' }, // Replace with actual image path
    { name: "Smit Wadke", studyTime: 22, goal: 25, profilePic: 'smit.jpg' } // Replace with actual image path
];

// Add medal images for the top 3 students
const medalImages = {
    1: 'gold.png',    // Replace with actual gold medal image path
    2: 'silver.png',  // Replace with actual silver medal image path
    3: 'bronze.png'   // Replace with actual bronze medal image path
};

function createStudentElement(student, rank) {
    const progressPercentage = (student.studyTime / student.goal) * 100;
    const li = document.createElement('li');
    li.className = 'student-item';

    // Conditionally add the medal for top 3 students
    let medalImg = '';
    if (rank <= 3) {
        medalImg = `<img src="${medalImages[rank]}" alt="Medal" class="medal">`;
    }

    li.innerHTML = `
        <div class="rank">
        ${medalImg} <!-- Medal Image for top 3 -->
            <div class="rank-number">${rank}</div>
        </div>
        <div class="content">
            <div class="info">
                <h3 class="name">${student.name}</h3>
                <div class="stats">
                    <span>${student.studyTime} hours studied</span>
                    <span class="divider">•</span>
                    <span>${Math.round(progressPercentage)}% of goal</span>
                </div>
            </div>
            <div class="progress-wrapper">
                <div class="progress-bar">
                    <div class="progress" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
        </div>
    `;
    li.addEventListener('click', () => showStudentDetails(student));
    return li;
}

function populateLeaderboard() {
    const studentList = document.getElementById('studentList');
    students.sort((a, b) => b.studyTime - a.studyTime);
    students.forEach((student, index) => {
        studentList.appendChild(createStudentElement(student, index + 1));
    });
}

function showStudentDetails(student) {
    const modalContent = document.getElementById('modalContent');
    const progressPercentage = Math.round((student.studyTime / student.goal) * 100);

    // Create the modal content with profile picture
    modalContent.innerHTML = `
        <div class="modal-header">
            <img src="${student.profilePic}" alt="Profile Picture" class="profile-pic">
            <h3 class="modal-title">${student.name}</h3>
        </div>
        <div class="modal-stats">
            <div class="stat-item">
                <span class="stat-label">Study Time</span>
                <span class="stat-value">${student.studyTime} hours</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Weekly Goal</span>
                <span class="stat-value">${student.goal} hours</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Progress</span>
                <span class="stat-value">${progressPercentage}%</span>
            </div>
        </div>
    `;
    document.getElementById('modalOverlay').classList.add('active');
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.remove('active');
});

document.getElementById('modalOverlay').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
        document.getElementById('modalOverlay').classList.remove('active');
    }
});

// Initialize the leaderboard
populateLeaderboard();
let activeIndex = -1;

        function toggleEvent(index) {
            const dots = document.querySelectorAll('.timeline-dot');
            const path = document.getElementById('path');
            const events = document.querySelectorAll('.event-container');

            // If clicking on the last active item, deselect it
            if (index === activeIndex) {
                activeIndex--;
            } else if (index > activeIndex) {
                activeIndex = index;
            }

            // Update dot classes
            dots.forEach((dot, i) => {
                if (i < activeIndex) {
                    dot.classList.add('completed');
                } else if (i === activeIndex) {
                    dot.classList.add('active');
                }
            });

            // Adjust line height dynamically
            if (activeIndex >= 0) {
                const firstEvent = events[0].offsetTop;
                const lastEvent = events[activeIndex]?.offsetTop ?? firstEvent;
                path.style.height = (lastEvent - firstEvent + 20) + "px";
                path.classList.add("active");
            } else {
                path.style.height = "0px";
                path.classList.remove("active");
                dot.classList.remove('active', 'completed');
            }
        }

        // Initialize first item as active
        toggleEvent(0);