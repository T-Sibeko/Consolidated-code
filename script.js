const notaResetVersion = "fresh-start-1";

if (localStorage.getItem("notaResetVersion") !== notaResetVersion) {

    const oldData = [
        "users",
        "loggedInUser",
        "jobs",
        "profile",
        "selectedTheme",
        "selectedFont"
    ];

    oldData.forEach(key => {
        localStorage.removeItem(key);
    });

    localStorage.setItem("notaResetVersion", no",notaResetVersion);}




const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const fullname = document.getElementById("signup-fullname").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const username = document.getElementById("signup-username").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;

        const message = document.getElementById("signup-message");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            message.textContent = "This username or email is already registered.";
            return;
        }

        const newUser = {
            fullname: fullname,
            email: email,
            username: username,
            password: password
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        message.style.color = "green";
        message.textContent = "Account created successfully! You can now log in.";

        signupForm.reset();

        setTimeout(() => {
            document.getElementById("signup-panel").hidden = true;
            document.getElementById("login-panel").hidden = false;
        }, 1200);

    });
}



/* ==================== LOGIN PROTECTION ==================== */

const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

const isLoginPage = window.location.pathname.includes("log-in.html");
const isSignupPage = window.location.pathname.includes("sign-up.html");

if (!currentUser && !isLoginPage && !isSignupPage) {
    window.location.href = "log-in.html";
}


/* ==================== NAVIGATION ==================== */

const navLinks = document.querySelectorAll(".navbar-contents button");
const pages = document.querySelectorAll(".page-section");

function showPage(pageId) {
    const selectedPage = document.getElementById(pageId);

    if (!selectedPage) {
        console.error("Page not found:", pageId);
        return;
    }

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    selectedPage.classList.add("active");

    navLinks.forEach(function(button) {
        button.classList.remove("active");
    });

    const activeButton = document.querySelector(
        `.navbar-contents button[data-page="${pageId}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    if (pageId === "dashboard") {
        updateDashboard();
    }
}

navLinks.forEach(function(button) {
    button.addEventListener("click", function() {
        showPage(button.dataset.page);
    });
});


/* ==================== SIDEBAR ==================== */

const sidebar = document.querySelector(".sidenavbar");
const sidebarToggle = document.getElementById("sidebar-toggle");

if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener("click", function() {
        sidebar.classList.toggle("collapsed");

        const collapsed = sidebar.classList.contains("collapsed");

        sidebarToggle.setAttribute("aria-expanded", !collapsed);
    });
}


/* ==================== LOGOUT ==================== */

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "log-in.html";
    });
}


/* ==================== THEMES ==================== */

const availableThemes = ["teal", "pink", "purple"];

function changeTheme(theme) {
    if (!availableThemes.includes(theme)) {
        theme = "teal";
    }

    document.body.dataset.theme = theme;

    localStorage.setItem("selectedTheme", theme);

    document.querySelectorAll('input[name="theme"]').forEach(function(input) {
        input.checked = input.value === theme;
    });

    updateDashboard();
}

const savedTheme = localStorage.getItem("selectedTheme") || "teal";

changeTheme(savedTheme);

document.querySelectorAll('input[name="theme"]').forEach(function(input) {
    input.addEventListener("change", function() {
        if (input.checked) {
            changeTheme(input.value);
        }
    });
});


/* ==================== FONT SETTINGS ==================== */

const fontChoice = document.getElementById("font-choice");

if (fontChoice) {
    const savedFont = localStorage.getItem("selectedFont") || "modern";

    fontChoice.value = savedFont;

    if (savedFont === "classic") {
        document.body.classList.add("font-classic");
    }

    fontChoice.addEventListener("change", function() {
        document.body.classList.toggle(
            "font-classic",
            fontChoice.value === "classic"
        );

        localStorage.setItem("selectedFont", fontChoice.value);
    });
}


/* ==================== NOTIFICATIONS ==================== */

function showNotification(message, type = "success") {
    const notification = document.getElementById("app-notification");

    if (!notification) {
        alert(message);
        return;
    }

    notification.textContent = message;
    notification.className = `app-notification ${type} show`;

    clearTimeout(showNotification.timer);

    showNotification.timer = setTimeout(function() {
        notification.classList.remove("show");
    }, 3000);
}


/* ==================== APPLICATION MANAGEMENT ==================== */

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

const jobForm = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("application-search");
const statusFilter = document.getElementById("application-status-filter");

const statusStyles = {
    Applied: "primary",
    Interview: "warning",
    Offer: "success",
    Rejected: "danger"
};


function saveJobs() {
    localStorage.setItem("jobs", JSON.stringify(jobs));

    document.dispatchEvent(new Event("jobsUpdated"));
}


/* ==================== DISPLAY APPLICATIONS ==================== */

function renderJobs() {
    if (!jobList) return;

    jobList.innerHTML = "";

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "all";

    const filteredJobs = jobs.filter(function(job) {
        const matchesSearch =
            (job.position || "").toLowerCase().includes(searchTerm) ||
            (job.company || "").toLowerCase().includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            job.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredJobs.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-applications";

        emptyMessage.textContent = jobs.length
            ? "No applications match your search or filter."
            : "You have not added any applications yet.";

        jobList.appendChild(emptyMessage);
        return;
    }

    filteredJobs.forEach(function(job) {
        const column = document.createElement("div");
        column.className = "col-md-4 mb-3";

        const card = document.createElement("article");
        card.className = "job-card";

        const title = document.createElement("h3");
        title.textContent = job.position || "Untitled position";

        card.appendChild(title);

        const details = [
            ["Company", job.company],
            ["Location", job.location],
            ["Type", job.type],
            ["Application Date", job.applicationDate || "Not specified"],
            ["CV", job.resume || "No File Uploaded"]
        ];

        details.forEach(function([label, value]) {
            const detail = document.createElement("p");

            const strong = document.createElement("strong");
            strong.textContent = label + ": ";

            detail.append(
                strong,
                document.createTextNode(value || "Not specified")
            );

            card.appendChild(detail);
        });

        const statusLine = document.createElement("p");

        const statusLabel = document.createElement("strong");
        statusLabel.textContent = "Status: ";

        const statusBadge = document.createElement("span");

        statusBadge.className =
            "badge text-bg-" + (statusStyles[job.status] || "secondary");

        statusBadge.textContent = job.status || "Not specified";

        statusLine.append(statusLabel, statusBadge);

        card.appendChild(statusLine);

        const actions = document.createElement("div");
        actions.className = "job-card-actions";

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-job-button";
        deleteButton.innerHTML = '<i class="bi bi-trash"></i> Delete';

        deleteButton.addEventListener("click", function() {
            deleteJob(job.id);
        });

        actions.appendChild(deleteButton);
        card.appendChild(actions);

        column.appendChild(card);
        jobList.appendChild(column);
    });
}


/* ==================== ADD APPLICATION ==================== */

if (jobForm) {
    jobForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const position = document.getElementById("position").value.trim();
        const company = document.getElementById("company").value.trim();
        const location = document.getElementById("job-location").value.trim();
        const status = document.getElementById("status").value;
        const type = document.getElementById("type").value;
        const applicationDate = document.getElementById("applicationDate").value;

        const fileInput = document.getElementById("application-cv");
        const file = fileInput.files.length > 0 ? fileInput.files[0] : null;

        if (!position || !company || !location) {
            showAppNotification("Please enter the position, company and job location.");
            return;
        }

        const newJob = {
            id: crypto.randomUUID
                ? crypto.randomUUID()
                : String(Date.now()),
            position: position,
            company: company,
            location: location,
            status: status,
            type: type,
            applicationDate: applicationDate,
            resume: file ? file.name : "No File Uploaded"
        };

        jobs.push(newJob);

        saveJobs();
        renderJobs();
        jobForm.reset();

        showAppNotification("Application added successfully!");
    });
}

            


/* ==================== DELETE APPLICATION ==================== */

function deleteJob(jobId) {
    const confirmed = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    jobs = jobs.filter(function(job) {
        return String(job.id) !== String(jobId);
    });

    saveJobs();
    renderJobs();

    showNotification("Application deleted successfully.", "success");
}


/* ==================== SEARCH AND FILTER ==================== */

if (searchInput) {
    searchInput.addEventListener("input", renderJobs);
}

if (statusFilter) {
    statusFilter.addEventListener("change", renderJobs);
}


/* ==================== OLD APPLICATION IDs ==================== */

let jobsNeedSaving = false;

jobs.forEach(function(job) {
    if (!job.id) {
        job.id = crypto.randomUUID
            ? crypto.randomUUID()
            : String(Date.now());

        jobsNeedSaving = true;
    }
});

if (jobsNeedSaving) {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

renderJobs();


/* ==================== DASHBOARD ==================== */

let jobChart = null;

function updateDashboard() {
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    const totalJobs = document.getElementById("totalJobs");
    const appliedJobs = document.getElementById("appliedJobs");
    const interviewJobs = document.getElementById("interviewJobs");
    const offerJobs = document.getElementById("offerJobs");
    const rejectedJobs = document.getElementById("rejectedJobs");

    if (totalJobs) {
        totalJobs.textContent = jobs.length;
    }

    if (appliedJobs) {
        appliedJobs.textContent =
            jobs.filter(job => job.status === "Applied").length;
    }

    if (interviewJobs) {
        interviewJobs.textContent =
            jobs.filter(job => job.status === "Interview").length;
    }

    if (offerJobs) {
        offerJobs.textContent =
            jobs.filter(job => job.status === "Offer").length;
    }

    if (rejectedJobs) {
        rejectedJobs.textContent =
            jobs.filter(job => job.status === "Rejected").length;
    }

    const chartCanvas = document.getElementById("jobChart");

    if (!chartCanvas || typeof Chart === "undefined") return;

    const statuses = ["Applied", "Interview", "Offer", "Rejected"];

    const statusCounts = statuses.map(function(status) {
        return jobs.filter(job => job.status === status).length;
    });

    const chartColours = [
        "#478C8B",
        "#E6B85C",
        "#3C956B",
        "#C85D68"
    ];

    if (jobChart) {
        jobChart.data.datasets[0].data = statusCounts;
        jobChart.update();
        return;
    }

    jobChart = new Chart(chartCanvas.getContext("2d"), {
        type: "bar",

        data: {
            labels: statuses,

            datasets: [{
                label: "Applications",
                data: statusCounts,
                backgroundColor: chartColours,
                borderRadius: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

document.addEventListener("jobsUpdated", updateDashboard);

updateDashboard();


/* ==================== FLOATING PROFILE BUTTON ==================== */

const floatingProfileButton =
    document.getElementById("floating-profile-button");

if (floatingProfileButton) {
    floatingProfileButton.addEventListener("click", function() {
        showPage("profile");
    });
}


/* ==================== PROFILE FORM ==================== */

const profileForm = document.getElementById("accountProfileForm");

if (profileForm) {
    const savedProfile = JSON.parse(
        localStorage.getItem("profile") || "{}"
    );

    if (profileForm.elements.namedItem("firstName")) {
        profileForm.elements.namedItem("firstName").value =
            savedProfile.firstName || "";
    }

    if (profileForm.elements.namedItem("lastName")) {
        profileForm.elements.namedItem("lastName").value =
            savedProfile.lastName || "";
    }

    if (profileForm.elements.namedItem("email")) {
        profileForm.elements.namedItem("email").value =
            savedProfile.email || "";
    }

    if (profileForm.elements.namedItem("phone")) {
        profileForm.elements.namedItem("phone").value =
            savedProfile.phone || "";
    }

    if (profileForm.elements.namedItem("address")) {
        profileForm.elements.namedItem("address").value =
            savedProfile.address || "";
    }

    profileForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const profile = {
            firstName: profileForm.elements.namedItem("firstName").value.trim(),
            lastName: profileForm.elements.namedItem("lastName").value.trim(),
            email: profileForm.elements.namedItem("email").value.trim(),
            phone: profileForm.elements.namedItem("phone").value.trim(),
            address: profileForm.elements.namedItem("address").value.trim()
        };

        localStorage.setItem("profile", JSON.stringify(profile));

        const message = profileForm.querySelector(
            ".account-profile-message"
        );

        if (message) {
            message.textContent = "Profile saved successfully.";
        }
    });
}


/* ==================== RESUME FORM ==================== */

const resumeForm = document.getElementById("resume-form");

if (resumeForm) {
    resumeForm.addEventListener("submit", function(event) {
        event.preventDefault();

        showNotification(
            "Your resume details have been submitted.",
            "success"
        );
    });
}


/* ==================== PROFILE IMAGE PREVIEW ==================== */

const profilePicture = document.getElementById("profile-picture");
const resumeProfilePreview = document.getElementById("resume-profile-preview");

if (profilePicture && resumeProfilePreview) {
    profilePicture.addEventListener("change", function() {
        const file = profilePicture.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showNotification("Please select a valid image.", "error");
            profilePicture.value = "";
            return;
        }

        resumeProfilePreview.src = URL.createObjectURL(file);
    });
}


/* ==================== CV FILE NAME ==================== */

const cvUpload = document.getElementById("job-resume-file");
const cvFileName = document.getElementById("cv-file-name");

if (cvUpload && cvFileName) {
    cvUpload.addEventListener("change", function() {
        const file = cvUpload.files[0];

        cvFileName.textContent = file
            ? file.name + " selected."
            : "There are currently no documents added.";
    });
}


/* ==================== CANVA ==================== */

const canvaButton = document.getElementById("canva-button");

if (canvaButton) {
    canvaButton.addEventListener("click", function() {
        window.open(
            "https://www.canva.com/resumes/templates/",
            "_blank",
            "noopener,noreferrer"
        );
    });
}


/* ==================== JOBS OF INTEREST ==================== */

const jobSearchForm = document.getElementById("jobSearchForm");

if (jobSearchForm) {
    jobSearchForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const category = document.getElementById("jobCategory").value;
        const location = document.getElementById("jobLocation").value;

        if (!category || !location) {
            showNotification(
                "Please select a job category and location.",
                "error"
            );
            return;
        }

        const pnetURL =
            `https://www.pnet.co.za/jobs/${encodeURIComponent(category)}/in-${encodeURIComponent(location)}`;

        window.open(pnetURL, "_blank", "noopener,noreferrer");
    });
}


/* ==================== PUBLIC PROFILE POPUP ==================== */

const publicProfileButton =
    document.getElementById("public-profile-button");

const publicProfilePopup =
    document.getElementById("public-profile-popup");

const publicYes = document.getElementById("public-yes");
const publicNo = document.getElementById("public-no");

if (publicProfileButton && publicProfilePopup) {
    publicProfileButton.addEventListener("click", function() {
        publicProfilePopup.hidden = false;
    });
}

if (publicYes && publicProfilePopup) {
    publicYes.addEventListener("click", function() {
        publicProfilePopup.hidden = true;
    });
}

if (publicNo && publicProfilePopup) {
    publicNo.addEventListener("click", function() {
        publicProfilePopup.hidden = true;
    });
}
