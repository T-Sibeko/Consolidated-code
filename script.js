(function() {
    const themeNames = ["teal", "pink", "purple"];
    const storageKey = "nothaTheme";

    function applyTheme(themeName, persist) {
        const selectedTheme = themeNames.includes(themeName)
            ? themeName
            : "teal";

        document.body.dataset.theme = selectedTheme;

        document.querySelectorAll('input[name="theme"]').forEach(function(option) {
            option.checked = option.value === selectedTheme;
        });

        document.querySelectorAll("[data-theme-selector]").forEach(function(selector) {
            selector.value = selectedTheme;
        });

        if (persist) {
            localStorage.setItem(storageKey, selectedTheme);
        }

        document.dispatchEvent(new CustomEvent("themeChanged", {
            detail: { theme: selectedTheme }
        }));
    }

    applyTheme(localStorage.getItem(storageKey), false);

    document.querySelectorAll('input[name="theme"]').forEach(function(option) {
        option.addEventListener("change", function() {
            if (option.checked) {
                applyTheme(option.value, true);
            }
        });
    });

    document.querySelectorAll("[data-theme-selector]").forEach(function(selector) {
        selector.addEventListener("change", function() {
            applyTheme(selector.value, true);
        });
    });

    window.addEventListener("storage", function(event) {
        if (event.key === storageKey) {
            applyTheme(event.newValue, false);
        }
    });
})();



const navLinks = document.querySelectorAll(
    ".navbar-contents button"
);

const pages = document.querySelectorAll(
    ".page-section"
);

const pageNames = {
    "dashboard": "dashboard",
    "resume": "resume",
    "add-application": "add-application",
    "jobs-of-interest": "jobs-of-interest",
    "settings": "settings"
};


/* PAGE DISPLAY */

function showPage(pageId) {

    const actualPageId = pageNames[pageId] || pageId;

    const selectedPage = document.getElementById(actualPageId);

    if (!selectedPage) {
        console.error("Sorry, page not found:", actualPageId);
        return;
    }

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    selectedPage.classList.add("active");

    navLinks.forEach(function(button) {
        button.classList.remove("active");
        button.removeAttribute("aria-current");
    });

    const activeButton = Array.from(navLinks).find(function(button) {
        return button.dataset.page === pageId;
    });

    if (activeButton) {
        activeButton.classList.add("active");
        activeButton.setAttribute("aria-current", "page");
    }
}


/* COLLAPSE AND EXPAND SIDEBAR */

const sidebar = document.querySelector(".sidenavbar");

const sidebarToggle = document.getElementById("sidebar-toggle");

if (sidebarToggle && sidebar) {

    sidebarToggle.addEventListener("click", function() {

        sidebar.classList.toggle("collapsed");

        const isCollapsed = sidebar.classList.contains("collapsed");

        sidebarToggle.setAttribute("aria-expanded", !isCollapsed);

        sidebarToggle.setAttribute(
            "aria-label",
            isCollapsed ? "Expand navigation" : "Collapse navigation"
        );

    });

}


/* LOGOUT */

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        localStorage.removeItem("loggedInUser");

        window.location.href = "log-in.html";

    });

}


/* NAVIGATION BUTTON EVENTS */

navLinks.forEach(function(button) {

    button.addEventListener("click", function() {

        const selectedPage = button.dataset.page;

        showPage(selectedPage);

    });

});


/* HOME LINK */

const homeLink = document.querySelector(".Navbar");

if (homeLink) {

    homeLink.addEventListener("click", function(event) {

        event.preventDefault();

        showPage("dashboard");

    });

}


/* DASHBOARD AS LANDING PAGE */

showPage("dashboard");



/* ---------------- PROFILE PICTURE ---------------- */


/* Picture upload */

const profilePicture = document.getElementById("profile-picture");

const resumeProfilePreview = document.getElementById("resume-profile-preview");


if (profilePicture && resumeProfilePreview) {

    profilePicture.addEventListener("change", function() {

        const selectedFile = profilePicture.files[0];

        if (!selectedFile) {
            return;
        }

        /* Verify image file */

        if (!selectedFile.type.startsWith("image/")) {

            alert("Please select a valid image.");

            profilePicture.value = "";

            return;
        }

        /* Create temporary image URL */

        const imageURL = URL.createObjectURL(selectedFile);

        /* Display image */

        resumeProfilePreview.src = imageURL;

    });

}



/* ---------------- SUPPORTING DOCUMENTS ---------------- */


/* Document upload */

const cvUpload = document.getElementById("job-resume-file");

const cvFileName = document.getElementById("cv-file-name");


if (cvUpload && cvFileName) {

    cvUpload.addEventListener("change", function() {

        const selectedFile = cvUpload.files[0];

        if (selectedFile) {

            cvFileName.textContent =
                selectedFile.name + " selected.";

        } else {

            cvFileName.textContent =
                "There are currently no documents added.";

        }

    });

}



/* ---------------- ONLINE RESUME SUBMISSION ---------------- */

const resumeMessage = document.getElementById("resume-message");

const resumeForm = document.getElementById("resume-form");


if (resumeForm) {

    resumeForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (resumeMessage) {

            resumeMessage.textContent =
                "Your resume details have been updated successfully.";

            resumeMessage.classList.add("success-message");

        }

    });

}



/* ---------------- CANVA BUTTON ---------------- */

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



/* ---------------- JOBS OF INTEREST ---------------- */

const jobSearchForm = document.getElementById("jobSearchForm");


if (jobSearchForm) {

    jobSearchForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const category = document.getElementById("jobCategory").value;

        const location = document.getElementById("jobLocation").value;

        if (!category || !location) {

            alert("Please select a job category and location.");

            return;

        }

        const pnetURL =
            `https://www.pnet.co.za/jobs/${encodeURIComponent(category)}/in-${encodeURIComponent(location)}`;

        window.open(pnetURL, "_blank");

    });

}



/* ---------------- FONT SETTINGS ---------------- */

const fontChoice = document.getElementById("font-choice");


if (fontChoice) {

    fontChoice.addEventListener("change", function() {

        document.body.classList.remove("font-classic");

        if (fontChoice.value === "classic") {

            document.body.classList.add("font-classic");

        }

    });

}


/* Default font */

document.body.classList.remove("font-classic");



/* ---------------- PUBLIC PROFILE POPUP ---------------- */

const publicProfileButton = document.getElementById("public-profile-button");

const publicProfilePopup = document.getElementById("public-profile-popup");

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



/* =========================================================
   APPLICATION MANAGEMENT
   Add, display, search, filter and delete applications
   ========================================================= */


/* Retrieve saved applications */

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];


/* HTML elements */

const jobForm = document.getElementById("jobForm");

const jobList = document.getElementById("jobList");

const searchInput = document.getElementById("application-search");

const statusFilter = document.getElementById("application-status-filter");


/* Status colours */

const statusStyles = {

    Applied: "primary",

    Interview: "warning",

    Offer: "success",

    Rejected: "danger"

};



/* SAVE APPLICATIONS */

function saveJobs() {

    localStorage.setItem("jobs", JSON.stringify(jobs));

    document.dispatchEvent(new Event("jobsUpdated"));

}



/* POPUP NOTIFICATIONS */

function showAppNotification(message) {

    const notice = document.getElementById("app-notification");

    if (!notice) return;

    notice.textContent = message;

    notice.classList.add("show");

    window.clearTimeout(showAppNotification.timer);

    showAppNotification.timer = window.setTimeout(function() {

        notice.classList.remove("show");

    }, 2800);

}



/* DISPLAY APPLICATION CARDS */

function renderJobs() {

    if (!jobList) return;

    jobList.innerHTML = "";


    /* Search and filter values */

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "all";


    /* Filter applications */

    const filteredJobs = jobs.filter(function(job) {

        const matchesSearch =

            (job.position || "").toLowerCase().includes(searchTerm) ||

            (job.company || "").toLowerCase().includes(searchTerm);


        const matchesStatus =

            selectedStatus === "all" || job.status === selectedStatus;


        return matchesSearch && matchesStatus;

    });



    /* No applications found */

    if (filteredJobs.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-applications";

        emptyMessage.textContent = jobs.length

            ? "No applications match your search or filter."

            : "You have not added any applications yet.";

        jobList.appendChild(emptyMessage);

        return;

    }



    /* Create application cards */

    filteredJobs.forEach(function(job) {

        const column = document.createElement("div");

        column.className = "col-md-4 mb-3";


        const card = document.createElement("article");

        card.className = "job-card";


        /* Position title */

        const title = document.createElement("h3");

        title.textContent = job.position || "Untitled position";

        card.appendChild(title);



        /* Application details */

        [

            ["Company", job.company],

            ["Location", job.location],

            ["Type", job.type],

            ["Application Date", job.applicationDate || "Not specified"],

            ["CV", job.resume || "No File Uploaded"]

        ].forEach(function([label, value]) {

            const detail = document.createElement("p");

            const strong = document.createElement("strong");

            strong.textContent = label + ": ";

            detail.append(

                strong,

                document.createTextNode(value || "Not specified")

            );

            card.appendChild(detail);

        });



        /* Application status */

        const statusLine = document.createElement("p");

        const statusLabel = document.createElement("strong");

        statusLabel.textContent = "Status: ";


        const statusBadge = document.createElement("span");

        statusBadge.className =
            "badge text-bg-" + (statusStyles[job.status] || "secondary");

        statusBadge.textContent = job.status || "Not specified";


        statusLine.append(statusLabel, statusBadge);

        card.appendChild(statusLine);



        /* Delete button */

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



/* DELETE APPLICATION */

function deleteJob(jobId) {

    const confirmed = window.confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;


    jobs = jobs.filter(function(job) {

        return String(job.id) !== String(jobId);

    });


    saveJobs();

    renderJobs();

    showAppNotification("Application deleted successfully.");

}



/* ADD NEW APPLICATION */

if (jobForm) {

    jobForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const position = document.getElementById("position").value.trim();

        const company = document.getElementById("company").value.trim();

        const location = document.getElementById("job-location").value.trim();


        /* Validate required fields */

        if (!position || !company || !location) {

            showAppNotification(
                "Please complete the position, company and location fields."
            );

            return;

        }


        /* CV upload */

        const resumeInput = document.getElementById("resume");

        const resume = resumeInput && resumeInput.files[0];


        /* Create application object */

        jobs.push({

            id: (window.crypto && crypto.randomUUID)

                ? crypto.randomUUID()

                : String(Date.now()) + Math.random().toString(16).slice(2),

            position: position,

            company: company,

            location: location,

            status: document.getElementById("status").value,

            type: document.getElementById("type").value,

            applicationDate: document.getElementById("applicationDate").value,

            resume: resume ? resume.name : "No File Uploaded"

        });


        /* Save and refresh */

        saveJobs();

        renderJobs();

        jobForm.reset();

        showAppNotification("Application added successfully.");

    });

}



/* SEARCH APPLICATIONS */

if (searchInput) {

    searchInput.addEventListener("input", renderJobs);

}



/* FILTER APPLICATIONS BY STATUS */

if (statusFilter) {

    statusFilter.addEventListener("change", renderJobs);

}



/* GIVE OLDER APPLICATIONS UNIQUE IDs */

let jobsNeedSaving = false;


jobs.forEach(function(job) {

    if (!job.id) {

        job.id = (window.crypto && crypto.randomUUID)

            ? crypto.randomUUID()

            : String(Date.now()) + Math.random().toString(16).slice(2);

        jobsNeedSaving = true;

    }

});


if (jobsNeedSaving) {

    localStorage.setItem("jobs", JSON.stringify(jobs));

}


/* Initial application display */

renderJobs();



/* =========================================================
   DASHBOARD AND CHART
   ========================================================= */

(function() {

    let jobChart = null;


    function updateDashboard() {

        const dashboard = document.getElementById("dashboard");

        if (!dashboard) return;


        /* Retrieve applications */

        const jobs = JSON.parse(localStorage.getItem("jobs")) || [];


        /* Update statistic cards */

        const totalJobs = document.getElementById("totalJobs");

        const appliedJobs = document.getElementById("appliedJobs");

        const interviewJobs = document.getElementById("interviewJobs");

        const offerJobs = document.getElementById("offerJobs");

        const rejectedJobs = document.getElementById("rejectedJobs");


        if (totalJobs) totalJobs.textContent = jobs.length;


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



        /* Prepare chart data */

        const statuses = ["Applied", "Interview", "Offer", "Rejected"];


        const statusCounts = statuses.map(status =>

            jobs.filter(job => job.status === status).length

        );


        const chartCanvas = document.getElementById("jobChart");

        if (!chartCanvas || typeof Chart === "undefined") return;



        /* Get current theme colours */

        const styles = getComputedStyle(document.body);


        const textColour = styles.getPropertyValue("--text").trim();

        const primaryColour = styles.getPropertyValue("--primary").trim();

        const interviewColour =
            styles.getPropertyValue("--status-interview").trim();

        const offerColour =
            styles.getPropertyValue("--status-offer").trim();

        const rejectedColour =
            styles.getPropertyValue("--status-rejected").trim();

        const mutedColour = styles.getPropertyValue("--muted").trim();


        const chartColours = [

            primaryColour,

            interviewColour,

            offerColour,

            rejectedColour

        ];



        /* Update existing chart instead of creating duplicates */

        if (jobChart) {

            jobChart.data.datasets[0].data = statusCounts;

            jobChart.data.datasets[0].backgroundColor = chartColours;


            jobChart.options.plugins.legend.labels.color = textColour;

            jobChart.options.scales.x.ticks.color = textColour;

            jobChart.options.scales.y.ticks.color = textColour;

            jobChart.options.scales.y.grid.color = mutedColour;


            jobChart.update();

            return;

        }



        /* Create chart */

        const chartContext = chartCanvas.getContext("2d");


        jobChart = new Chart(chartContext, {

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

                        labels: {

                            color: textColour

                        }

                    }

                },


                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            precision: 0,

                            color: textColour

                        },

                        grid: {

                            color: mutedColour

                        }

                    },


                    x: {

                        ticks: {

                            color: textColour

                        },

                        grid: {

                            display: false

                        }

                    }

                }

            }

        });

    }



    /* Update dashboard when applications change */

    document.addEventListener("jobsUpdated", updateDashboard);


    /* Initial dashboard display */

    updateDashboard();


    /* Refresh when Dashboard is selected */

    document.querySelectorAll(
        '.navbar-contents button[data-page="dashboard"]'
    ).forEach(button => {

        button.addEventListener("click", updateDashboard);

    });


    /* Refresh chart when theme changes */

    document.addEventListener("themeChanged", updateDashboard);

})();



/* =========================================================
   FLOATING PROFILE BUTTON
   ========================================================= */

const floatingProfileButton =
    document.getElementById("floating-profile-button");


if (floatingProfileButton) {

    floatingProfileButton.addEventListener("click", function() {

        showPage("profile");

    });

}



/* =========================================================
   PROFILE FORM
   ========================================================= */

const profileForms = document.querySelectorAll("[data-profile-form]");


profileForms.forEach(function(profileForm) {

    const savedProfileImage =
        profileForm.querySelector(".account-saved-image");

    const profileImageInput =
        profileForm.elements.namedItem("profileImage");

    const profileMessage =
        profileForm.querySelector(".account-profile-message");


    if (!profileImageInput) return;


    /* Profile image selection */

    profileImageInput.addEventListener("change", function() {

        const selectedFile = profileImageInput.files[0];


        if (selectedFile) {

            if (savedProfileImage) {

                savedProfileImage.textContent =
                    `Selected file: ${selectedFile.name}`;

            }

        } else if (savedProfileImage) {

            savedProfileImage.textContent = "";

        }

    });



    /* Save profile details */

    profileForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const firstName =
            profileForm.elements.namedItem("firstName").value.trim();

        const lastName =
            profileForm.elements.namedItem("lastName").value.trim();

        const email =
            profileForm.elements.namedItem("email").value.trim();

        const phone =
            profileForm.elements.namedItem("phone").value.trim();

        const address =
            profileForm.elements.namedItem("address").value.trim();


        const profileImage = profileImageInput.files[0];


        if (!firstName || !email) {

            alert("Please complete all required fields");

            return;

        }


        const savedProfile = {

            firstName,

            lastName,

            email,

            phone,

            address,

            profileImage: profileImage ? profileImage.name : "No Image"

        };


        try {

            /* Save profile */

            localStorage.setItem(
                "profile",
                JSON.stringify(savedProfile)
            );


            /* Clear form */

            profileForm.reset();


            /* Clear file name */

            if (savedProfileImage) {

                savedProfileImage.textContent = "";

            }


            /* Success message */

            if (profileMessage) {

                profileMessage.textContent =
                    "Profile saved successfully!";

            } else {

                alert("Profile saved successfully!");

            }


        } catch (error) {

            if (profileMessage) {

                profileMessage.textContent =
                    "Unable to save profile. Please try again.";

            } else {

                alert("Unable to save profile. Please try again.");

            }

            console.error(error);

        }

    });

});