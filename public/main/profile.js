const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle=body.querySelector(".toggle"),
    modeSwitch=body.querySelector(".toggle-switch"),
    modeText=body.querySelector(".mode-text");

    toggle.addEventListener("click",() =>{
        sidebar.classList.toggle("close");
    });
    modeSwitch.addEventListener("click",() =>{
        body.classList.toggle("dark");

        if(body.classList.contains("dark")){
            modeText.innerText ="Light Mode"
        }
        else{
            modeText.innerText="Dark Mode"
        }
    });
    document.addEventListener("DOMContentLoaded", function () {
        const editProfileBtn = document.getElementById("editProfileBtn");
        const closeProfileBtn = document.getElementById("closeProfileBtn");
        const editProfileForm = document.getElementById("editProfileForm");
        const overlay = document.getElementById("overlay");
    
        // Open the edit profile form
        editProfileBtn.addEventListener("click", function () {
            editProfileForm.classList.remove("hidden");
            overlay.classList.remove("hidden");
        });
    
        // Close the edit profile form
        closeProfileBtn.addEventListener("click", function () {
            editProfileForm.classList.add("hidden");
            overlay.classList.add("hidden");
        });
    
        // Close when clicking outside the form
        overlay.addEventListener("click", function () {
            editProfileForm.classList.add("hidden");
            overlay.classList.add("hidden");
        });
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
    function sendRequest() {
        let friendNameInput = document.getElementById("friend-name");
        let friendName = friendNameInput.value.trim();
    
        if (friendName !== "") {
            let friendsList = document.getElementById("friends-list");
    
            let newFriend = document.createElement("li");
            newFriend.classList.add("friend");
    
            newFriend.innerHTML = `
                <div class="avatar"></div>
                <div>
                    <p class="username">${friendName}</p>
                    <p class="fullname">New Friend</p>
                </div>
            `;
    
            friendsList.appendChild(newFriend);
            friendNameInput.value = "";
    
            // Show popup
            let popup = document.getElementById("popup");
            popup.classList.add("show");
    
            setTimeout(() => {
                popup.classList.remove("show");
            }, 2000);
        }
    }