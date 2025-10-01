// Security: Input sanitization function
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';

    // Remove or escape potentially dangerous characters
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .replace(/\\/g, '&#x5C;')
        .replace(/`/g, '&#96;')
        .substring(0, 5000); // Limit length to prevent abuse
}

// Security: Safe HTML creation using textContent
function createSafeElement(tag, text, className = '') {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) {
        element.className = className;
    }
    return element;
}

// Job and Education counters
let jobCounter = 1;
let educationCounter = 1;

// Function to create a new job entry
function createJobEntry(id = null) {
    const jobId = id || `job${jobCounter++}`;
    const jobEntry = document.createElement('div');
    jobEntry.className = 'job-entry';
    jobEntry.innerHTML = `
    <h3>Work Experience</h3>
        <button type="button" class="btn-remove" data-type="job" data-id="${jobId}">×</button>
        <div class="form-group">
            <label for="${jobId}Title">Job Title</label>
            <input type="text" id="${jobId}Title" placeholder="Senior Developer" maxlength="100">
        </div>
        <div class="form-group">
            <label for="${jobId}Company">Company</label>
            <input type="text" id="${jobId}Company" placeholder="Tech Solutions Inc." maxlength="100">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="${jobId}Dates">Dates</label>
                <input type="text" id="${jobId}Dates" placeholder="Jan 2020 - Present" maxlength="50">
            </div>
            <div class="form-group">
                <label for="${jobId}Location">Location</label>
                <input type="text" id="${jobId}Location" placeholder="Remote" maxlength="100">
            </div>
        </div>
        <div class="form-group">
            <label for="${jobId}Description">Description</label>
            <textarea id="${jobId}Description" placeholder="Responsibilities, achievements, and key contributions..." maxlength="1000"></textarea>
        </div>
    `;
    return jobEntry;
}

// Function to create a new education entry
function createEducationEntry(id = null) {
    const eduId = id || `edu${educationCounter++}`;
    const educationEntry = document.createElement('div');
    educationEntry.className = 'education-entry';
    educationEntry.innerHTML = `
    <h3>Education</h3>
        <button type="button" class="btn-remove" data-type="education" data-id="${eduId}">×</button>
        <div class="form-group">
            <label for="${eduId}Degree">Degree</label>
            <input type="text" id="${eduId}Degree" placeholder="Bachelor of Science in Computer Science" maxlength="100">
        </div>
        <div class="form-group">
            <label for="${eduId}School">School</label>
            <input type="text" id="${eduId}School" placeholder="University of Technology" maxlength="100">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="${eduId}Dates">Dates</label>
                <input type="text" id="${eduId}Dates" placeholder="2015 - 2019" maxlength="50">
            </div>
            <div class="form-group">
                <label for="${eduId}Location">Location</label>
                <input type="text" id="${eduId}Location" placeholder="Boston, MA" maxlength="100">
            </div>
        </div>
    `;
    return educationEntry;
}

// Function to update the CV preview securely
function updatePreview() {
    const cvPreview = document.getElementById('cvPreview');

    // Clear previous content securely
    while (cvPreview.firstChild) {
        cvPreview.removeChild(cvPreview.firstChild);
    }

    // Get and sanitize basic information
    const fullName = sanitizeInput(document.getElementById('fullName').value) || 'Your Name';
    const jobTitle = sanitizeInput(document.getElementById('jobTitle').value) || 'Professional Title';
    const email = sanitizeInput(document.getElementById('email').value) || 'your.email@example.com';
    const phone = sanitizeInput(document.getElementById('phone').value) || '+1 234 567 890';
    const location = sanitizeInput(document.getElementById('location').value) || 'City, Country';
    const summary = sanitizeInput(document.getElementById('summary').value) || 'Brief professional summary highlighting your experience, skills, and career objectives.';

    // Get skills
    const skills = sanitizeInput(document.getElementById('skills').value) || 'Skill 1, Skill 2, Skill 3';
    const skillsList = skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');

    // Create CV header
    const cvHeader = createSafeElement('div', '', 'cv-header');
    const cvName = createSafeElement('h1', fullName, 'cv-name');
    const cvTitle = createSafeElement('div', jobTitle, 'cv-title');
    const cvContact = createSafeElement('div', '', 'cv-contact');

    // Create contact info safely
    const contactItems = [email, '•', phone, '•', location];
    contactItems.forEach(item => {
        const span = createSafeElement('span', item);
        cvContact.appendChild(span);
    });

    cvHeader.appendChild(cvName);
    cvHeader.appendChild(cvTitle);
    cvHeader.appendChild(cvContact);
    cvPreview.appendChild(cvHeader);

    // Professional Summary
    const summarySection = createSafeElement('div', '', 'cv-section');
    const summaryTitle = createSafeElement('h2', 'Professional Summary', 'cv-section-title');
    const summaryContent = createSafeElement('p', summary);

    summarySection.appendChild(summaryTitle);
    summarySection.appendChild(summaryContent);
    cvPreview.appendChild(summarySection);

    // Work Experience - Dynamic
    const experienceSection = createSafeElement('div', '', 'cv-section');
    const experienceTitle = createSafeElement('h2', 'Work Experience', 'cv-section-title');
    experienceSection.appendChild(experienceTitle);

    // Get all job entries
    const jobEntries = document.querySelectorAll('.job-entry');
    jobEntries.forEach((entry, index) => {
        const jobId = entry.querySelector('.btn-remove').dataset.id;
        const jobTitleEl = document.getElementById(`${jobId}Title`);
        const jobCompany = document.getElementById(`${jobId}Company`);
        const jobDates = document.getElementById(`${jobId}Dates`);
        const jobLocation = document.getElementById(`${jobId}Location`);
        const jobDescription = document.getElementById(`${jobId}Description`);

        if (jobTitleEl && jobCompany) {
            const jobTitleText = sanitizeInput(jobTitleEl.value) || 'Job Title';
            const jobCompanyText = sanitizeInput(jobCompany.value) || 'Company Name';
            const jobDatesText = sanitizeInput(jobDates?.value || '') || 'Dates';
            const jobLocationText = sanitizeInput(jobLocation?.value || '') || 'Location';
            const jobDescriptionText = sanitizeInput(jobDescription?.value || '') || 'Description of responsibilities, achievements, and key contributions in this role.';

            const experienceItem = createSafeElement('div', '', 'cv-item');
            const jobTitleElement = createSafeElement('div', jobTitleText, 'cv-item-title');
            const jobDetails = createSafeElement('div', `${jobCompanyText} | ${jobDatesText} | ${jobLocationText}`, 'cv-item-date');
            const jobDescElement = createSafeElement('div', jobDescriptionText, 'cv-item-desc');

            experienceItem.appendChild(jobTitleElement);
            experienceItem.appendChild(jobDetails);
            experienceItem.appendChild(jobDescElement);
            experienceSection.appendChild(experienceItem);
        }
    });

    cvPreview.appendChild(experienceSection);

    // Education - Dynamic
    const educationSection = createSafeElement('div', '', 'cv-section');
    const educationTitle = createSafeElement('h2', 'Education', 'cv-section-title');
    educationSection.appendChild(educationTitle);

    // Get all education entries
    const educationEntries = document.querySelectorAll('.education-entry');
    educationEntries.forEach((entry, index) => {
        const eduId = entry.querySelector('.btn-remove').dataset.id;
        const eduDegree = document.getElementById(`${eduId}Degree`);
        const eduSchool = document.getElementById(`${eduId}School`);
        const eduDates = document.getElementById(`${eduId}Dates`);
        const eduLocation = document.getElementById(`${eduId}Location`);

        if (eduDegree && eduSchool) {
            const degreeText = sanitizeInput(eduDegree.value) || 'Degree';
            const schoolText = sanitizeInput(eduSchool.value) || 'School/University';
            const datesText = sanitizeInput(eduDates?.value || '') || 'Dates';
            const locationText = sanitizeInput(eduLocation?.value || '') || 'Location';

            const educationItem = createSafeElement('div', '', 'cv-item');
            const degreeElement = createSafeElement('div', degreeText, 'cv-item-title');
            const educationDetails = createSafeElement('div', `${schoolText} | ${datesText} | ${locationText}`, 'cv-item-date');

            educationItem.appendChild(degreeElement);
            educationItem.appendChild(educationDetails);
            educationSection.appendChild(educationItem);
        }
    });

    cvPreview.appendChild(educationSection);

    // Skills
    const skillsSection = createSafeElement('div', '', 'cv-section');
    const skillsTitle = createSafeElement('h2', 'Skills', 'cv-section-title');
    const skillsListContainer = createSafeElement('div', '', 'skills-list');

    skillsList.forEach(skill => {
        const skillTag = createSafeElement('div', skill, 'skill-tag');
        skillsListContainer.appendChild(skillTag);
    });

    skillsSection.appendChild(skillsTitle);
    skillsSection.appendChild(skillsListContainer);
    cvPreview.appendChild(skillsSection);
}

// Secure download function
function downloadCV() {
    // Get sanitized values for filename
    const fullName = sanitizeInput(document.getElementById('fullName').value) || 'MyCV';
    const safeFileName = fullName.replace(/[^a-zA-Z0-9]/g, '_');

    // Create a safe HTML document for download
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CV - ${sanitizeInput(document.getElementById('fullName').value) || 'My CV'}</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
        .cv-header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #3498db; }
        .cv-name { font-size: 2.2rem; color: #2c3e50; margin-bottom: 5px; }
        .cv-title { font-size: 1.3rem; color: #3498db; margin-bottom: 10px; font-weight: 500; }
        .cv-contact { display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; font-size: 0.95rem; color: #555; }
        .cv-section { margin-bottom: 25px; }
        .cv-section-title { font-size: 1.3rem; color: #2c3e50; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee; }
        .cv-item { margin-bottom: 15px; }
        .cv-item-title { font-weight: 600; color: #2c3e50; font-size: 1.1rem; }
        .cv-item-date { color: #7f8c8d; font-size: 0.9rem; font-style: italic; }
        .cv-item-desc { margin-top: 5px; line-height: 1.5; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 5px; }
        .skill-tag { background-color: #eaf2f8; padding: 5px 12px; border-radius: 20px; font-size: 0.9rem; color: #2c3e50; }
        @media print { body { padding: 0; } .cv-section { page-break-inside: avoid; } }
    </style>
</head>
<body>
    ${document.getElementById('cvPreview').innerHTML}
</body>
</html>`;

    // Create and trigger download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${safeFileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Remove entry function
function removeEntry(type, id) {
    const entry = document.querySelector(`.${type}-entry .btn-remove[data-id="${id}"]`)?.closest(`.${type}-entry`);
    if (entry) {
        entry.remove();
        updatePreview();
    }
}

// Initialize event listeners and setup
function initializeApp() {
    // Add first job and education entries by default
    const jobsContainer = document.getElementById('jobsContainer');
    const educationContainer = document.getElementById('educationContainer');

    jobsContainer.appendChild(createJobEntry('job1'));
    educationContainer.appendChild(createEducationEntry('edu1'));

    // Event listeners for buttons
    document.getElementById('updatePreview').addEventListener('click', updatePreview);
    document.getElementById('downloadCV').addEventListener('click', downloadCV);

    // Add job button
    document.getElementById('addJob').addEventListener('click', function () {
        jobsContainer.appendChild(createJobEntry());
        attachInputListeners();
        updatePreview();
        showSimpleNotification('Job added');
    });

    // Add education button
    document.getElementById('addEducation').addEventListener('click', function () {
        educationContainer.appendChild(createEducationEntry());
        attachInputListeners();
        updatePreview();
        showSimpleNotification('Degree added');
    });

    // Add input limits and sanitization
    attachInputListeners();

    // Security: Prevent any potential script injection through URL parameters
    if (window.location.search) {
        console.log('Security: URL parameters ignored for safety');
    }

    // Initialize with default preview
    updatePreview();
}

// Attach input listeners to all inputs
function attachInputListeners() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        // Remove existing listeners to avoid duplicates
        input.replaceWith(input.cloneNode(true));
    });

    // Re-attach listeners
    const newInputs = document.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', function () {
            // Enforce maxlength
            if (this.value.length > this.maxLength) {
                this.value = this.value.substring(0, this.maxLength);
            }
        });

        // Throttle preview updates for performance
        let timeout;
        input.addEventListener('input', function () {
            clearTimeout(timeout);
            timeout = setTimeout(updatePreview, 500);
        });
    });

    // Attach remove button listeners
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', function () {
            const type = this.dataset.type;
            const id = this.dataset.id;
            removeEntry(type, id);
        });
    });
}

// GDPR Cookie functions
document.getElementById('accept-cookies').onclick = function () {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('gdpr-banner').style.display = 'none';
};

document.getElementById('decline-cookies').onclick = function () {
    localStorage.setItem('cookiesAccepted', 'false');
    document.getElementById('gdpr-banner').style.display = 'none';
};

// Check if the user has already made a choice
if (localStorage.getItem('cookiesAccepted')) {
    document.getElementById('gdpr-banner').style.display = 'none';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Simple notification function
function showSimpleNotification(message) {
    const notification = document.getElementById('simple-notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 1000); // Show for 1 second
}