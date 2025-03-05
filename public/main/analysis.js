const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle=body.querySelector(".toggle"),
    modeSwitch=body.querySelector(".toggle-switch"),
    modeText=body.querySelector(".mode-text");

    toggle.addEventListener("click",() =>{
        sidebar.classList.toggle("close");
    });

    //darkmode js
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

    document.addEventListener("DOMContentLoaded", function () {
        const textElement = document.getElementById("text");
        const text = textElement.innerText;
        textElement.innerText = ""; // Clear original text
      
        text.split("").forEach((char, index) => {
          const span = document.createElement("span");
          span.innerText = char;
          span.style.animationDelay = `${index * 0.1}s`; // Delay each letter
          textElement.appendChild(span);
        });
      });
      

      new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: ['Physics', 'Chemistry', 'Math'],
            datasets: [{
                label: 'QUIZ',
                data: [40, 75, 23],
                backgroundColor: '#FF9F7E',
            }, {
                label: 'TOPICS',
                data: [75, 54, 65],
                backgroundColor: '#FFD68A',
            }]
            
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                x:
                {
                    ticks: {
                        color: '#908E8D', // Change Y-axis label color
                    }

                },
                y: {
                    ticks: {
                        color: '#908E8D', // Change Y-axis label color
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels:
                    {
                        color:'#908E8D'
                    }
                }
            }
        }
    });
    new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: ['Chemistry', 'Physics', 'Maths'],
            datasets: [{
                data: [33, 70, 60],
                backgroundColor: ['#D9785F', '#FFD68A', '#FF9F7E', '#FFD68A', '#FFD68A'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#908E8D', // Change legend text color
                    },
                },
            },
        }
    });
    function createGradient(ctx, color1, color2) {
        let gradient = ctx.createLinearGradient(0, 0, 0, 350); // Vertical gradient
        gradient.addColorStop(0.2, color1);  // Near the line, less opaque
        gradient.addColorStop(0.8, color2);  // More transparent at the bottom
        return gradient;
    }
    
    function createLineChart(id, label, data, borderColor, gradientColors) {
        const ctx = document.getElementById(id).getContext('2d');
        const backgroundColor = createGradient(ctx, gradientColors[0], gradientColors[1]);
    
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    fill: true, // Enables gradient fill
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            color: '#908E8D' // X-axis label color
                        }
                    },
                    y: {
                        ticks: {
                            color: '#908E8D' // Y-axis label color
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Create charts with gradients
    createLineChart('physicsChart', 'Physics', [45, 32, 11, 48, 59, 16, 70], '#FFD68A', ['rgba(255, 214, 138, 0.3)', 'rgba(255, 214, 138, 0.1)']);
    
    createLineChart('chemistryChart', 'Chemistry', [32, 48, 11, 45, 59, 70, 16], '#FF9F7E', ['rgba(255, 159, 126, 0.3)', 'rgba(255, 159, 126, 0.1)']);
    
    createLineChart('mathChart', 'Math', [48, 32, 11, 59, 48, 61, 70], '#D9785F', ['rgba(217, 120, 95, 0.3)', 'rgba(217, 120, 95, 0.1)']);
    

    function createLineChart1(id, label, data, borderColor) {
        return new Chart(document.getElementById(id), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: borderColor,
                   
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            color: '#908E8D' // X-axis label color
                        }
                    },
                    y: {
                        ticks: {
                            color: '#908E8D' // Y-axis label color
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Pomodoro Chart (Orange-Red)
    createLineChart1('pomodoroChart', 'Pomodoro', [13, 2, 36, 48, 34, 60, 20], '#FF9F7E');
    
    // Physics Chart (Blue)
    function createGradient(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); // Vertical gradient
        gradient.addColorStop(0, 'rgba(255, 159, 64, 0.3)'); // Darker near the line
        gradient.addColorStop(1, 'rgba(255, 159, 64, 0.1)'); // Fades away
        return gradient;
    }
    
    // Initialize the analytics chart
    const analyticsCtx = document.getElementById('analyticsChart').getContext('2d');
    const gradient = createGradient(analyticsCtx);
    
    new Chart(analyticsCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4','Week 5','Week 6','Week 7'],
            datasets: [{
                label: 'Progress',
                data: [10, 30, 20, 50, 40, 70, 60],
                borderColor: '#FF9F40', // Line color
                backgroundColor: gradient, // Gradient for the area under the line
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: '#908E8D', // X-axis label color
                    }
                },
                y: {
                    ticks: {
                        color: '#908E8D', // Y-axis label color
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false // Hide legend
                }
            }
        }
    });