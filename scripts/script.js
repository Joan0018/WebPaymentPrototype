// Pricing configuration
const PRICING = {
    'Tunku Abdul Rahman University of Management and Technology (Malaysia)': {
        online: {
            nonPresenter: { rm: 0, usd: 0 },
            presenter: { rm: 300, usd: 70 }
        },
        physical: {
            presenter: { rm: 300, usd: 70 },
            nonPresenter: { rm: 0, usd: 0 }
        }
    },
    'BINUS University (Indonesia)': {
        online: {
            presenter: { rm: 800, usd: 200 },
            nonPresenter: { rm: 0, usd: 0 },
        },
        physical: {
            presenter: { rm: 800, usd: 200 },
            nonPresenter: { rm: 0, usd: 0 }
        }
    },
    'Universitas Diponegoro (UNDIP) (Indonesia)': {
        online: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 0, usd: 0 }
        },
        physical: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 280, usd: 70 }
        }
    },
    'Poornima University (India)': {
        online: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 0, usd: 0 }
        },
        physical: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 280, usd: 70 }
        }
    },
    'Suranaree University of Technology (Thailand)': {
        online: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 0, usd: 0 }
        },
        physical: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 280, usd: 70 }
        }
    },
    'Atlantic Technological University (ATU) (Ireland)': {
        online: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 0, usd: 0 }
        },
        physical: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 280, usd: 70 }
        }
    },
    'Mindanao State University (MSU) (Philippines)': {
        online: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 0, usd: 0 }
        },
        physical: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 280, usd: 70 }
        }
    },
    'Adamson University (AdU) (Philippines)': {
        online: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 0, usd: 0 }
        },
        physical: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 280, usd: 70 }
        }
    },
    'Multimedia University (Malaysia)': {
        online: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 0, usd: 0 }
        },
        physical: {
            presenter: { rm: 1040, usd: 260 },
            nonPresenter: { rm: 280, usd: 70 }
        }
    },
    'Other': {
        online: {
            presenter: {
                nonIEEE: {
                    professional: { rm: 1600, usd: 400 },
                    student: { rm: 1360, usd: 340 }
                },
                ieee: {
                    professional: { rm: 1280, usd: 320 },
                    student: { rm: 1088, usd: 272 }
                }
            },
            nonPresenter: { rm: 0, usd: 0 }
        },
        physical: {
            presenter: {
                nonIEEE: {
                    professional: { rm: 1600, usd: 400 },
                    student: { rm: 1360, usd: 340 }
                },
                ieee: {
                    professional: { rm: 1280, usd: 320 },
                    student: { rm: 1088, usd: 272 }
                }
            },
            nonPresenter: { rm: 280, usd: 70 }
        }
    }
};

// Form handling functions
function toggleOtherCountry() {
    const country = document.getElementById('country').value;
    const otherCountryDiv = document.getElementById('otherCountryDiv');
    const organisationSelect = document.getElementById('organisation');

    // Reset organization select
    organisationSelect.value = '';

    // Show/hide other country input
    if (country === 'Non-Malaysia') {
        otherCountryDiv.classList.remove('hidden');
        document.getElementById('otherCountry').required = true;
    } else {
        otherCountryDiv.classList.add('hidden');
        document.getElementById('otherCountry').required = false;
        document.getElementById('otherCountry').value = '';
    }

    // Filter organization options based on country
    const options = organisationSelect.options;
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.value === '') continue; // Skip the "Select Organisation" option

        const countryAttr = option.getAttribute('data-country');
        if (countryAttr === 'both' || countryAttr === country) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    }

    // Recalculate price when country changes
    calculatePrice();
}

function toggleOtherOrganisation() {
    const organisation = document.getElementById('organisation').value;
    const otherOrgDiv = document.getElementById('otherOrgDiv');
    const attendanceMode = document.getElementById('attendanceMode').value;

    if (organisation === 'Other') {
        otherOrgDiv.classList.remove('hidden');
        document.getElementById('otherOrg').required = true;
    } else {
        otherOrgDiv.classList.add('hidden');
        document.getElementById('otherOrg').required = false;
        document.getElementById('otherOrg').value = '';
    }

    // Update presenter type options based on organization and attendance mode
    if (attendanceMode === 'Physical' && organisation === 'Tunku Abdul Rahman University of Management and Technology (Malaysia)') {
        const presenterTypeSelect = document.getElementById('presenterType');
        const nonPresenterOption = presenterTypeSelect.querySelector('option[value="Non-Presenter"]');
        if (nonPresenterOption) {
            nonPresenterOption.disabled = true;
            // If non-presenter was selected, reset to empty
            if (presenterTypeSelect.value === 'Non-Presenter') {
                presenterTypeSelect.value = '';
            }
        }
    } else {
        const presenterTypeSelect = document.getElementById('presenterType');
        const nonPresenterOption = presenterTypeSelect.querySelector('option[value="Non-Presenter"]');
        if (nonPresenterOption) {
            nonPresenterOption.disabled = false;
        }
    }

    // Reset IEEE member field when organisation changes
    toggleIeeeField();

    // Calculate price when organization changes
    calculatePrice();
}

function toggleAttendanceFields() {
    const attendanceMode = document.getElementById('attendanceMode').value;
    const physicalFields = document.getElementById('physicalFields');
    const registerBtn = document.getElementById('registerBtn');
    const paymentBtn = document.getElementById('paymentBtn');
    const organisation = document.getElementById('organisation').value;

    if (attendanceMode === 'Physical') {
        physicalFields.classList.remove('hidden');
        // Make physical attendance fields required
        document.getElementById('presenterType').required = true;
        document.getElementById('participantType').required = true;
        document.getElementById('dietaryPreference').required = true;

        // For TAR UMT, disable non-presenter option for physical attendance
        if (organisation === 'Tunku Abdul Rahman University of Management and Technology (Malaysia)') {
            const presenterTypeSelect = document.getElementById('presenterType');
            const nonPresenterOption = presenterTypeSelect.querySelector('option[value="Non-Presenter"]');
            if (nonPresenterOption) {
                nonPresenterOption.disabled = true;
                // If non-presenter was selected, reset to empty
                if (presenterTypeSelect.value === 'Non-Presenter') {
                    presenterTypeSelect.value = '';
                }
            }
        } else {
            // Enable non-presenter option for other institutions
            const presenterTypeSelect = document.getElementById('presenterType');
            const nonPresenterOption = presenterTypeSelect.querySelector('option[value="Non-Presenter"]');
            if (nonPresenterOption) {
                nonPresenterOption.disabled = false;
            }
        }
    } else {
        // For online attendance
        if (organisation === 'Tunku Abdul Rahman University of Management and Technology (Malaysia)') {
            // For TAR UMT, show only presenter type selection for online
            physicalFields.classList.remove('hidden');
            document.getElementById('presenterType').required = true;
            document.getElementById('participantType').required = false;
            document.getElementById('dietaryPreference').required = false;
            document.getElementById('otherDietary').required = false;

            // Hide dietary fields
            document.getElementById('dietaryDiv').classList.add('hidden');
            document.getElementById('otherDietaryDiv').classList.add('hidden');
            // Reset dietary values
            document.getElementById('dietaryPreference').value = '';
            document.getElementById('otherDietary').value = '';

            // Enable non-presenter option for online
            const presenterTypeSelect = document.getElementById('presenterType');
            const nonPresenterOption = presenterTypeSelect.querySelector('option[value="Non-Presenter"]');
            if (nonPresenterOption) {
                nonPresenterOption.disabled = false;
            }
        } else {
            // For other institutions, show presenter type selection but hide physical-specific fields
            physicalFields.classList.remove('hidden');
            document.getElementById('presenterType').required = true;
            document.getElementById('participantType').required = false;
            document.getElementById('dietaryPreference').required = false;
            document.getElementById('otherDietary').required = false;
            // Hide dietary fields
            document.getElementById('dietaryDiv').classList.add('hidden');
            document.getElementById('otherDietaryDiv').classList.add('hidden');
            // Reset dietary values
            document.getElementById('dietaryPreference').value = '';
            document.getElementById('otherDietary').value = '';
        }
    }

    // Calculate price when attendance mode changes
    calculatePrice();
}

function togglePresenterFields() {
    const presenterType = document.getElementById('presenterType').value;
    const paperInfoDiv = document.getElementById('paperInfoDiv');
    const participantTypeDiv = document.getElementById('participantTypeDiv');
    const participantTypeSelect = document.getElementById('participantType');

    // Show/hide paper information based on presenter type
    if (presenterType === 'Presenter') {
        paperInfoDiv.classList.remove('hidden');
        participantTypeDiv.classList.remove('hidden');
        // Make paper information fields required
        document.getElementById('paperId').required = true;
        document.getElementById('paperTitle').required = true;
        document.getElementById('certificateName').required = true;
        document.getElementById('participantType').required = true;

        // Add event listener for participant type change
        if (participantTypeSelect) {
            participantTypeSelect.addEventListener('change', function() {
                console.log('Participant type changed to:', this.value);
                calculatePrice();
            });
        }
    } else {
        paperInfoDiv.classList.add('hidden');
        participantTypeDiv.classList.add('hidden');
        // Reset and unrequire paper information fields
        document.getElementById('paperId').required = false;
        document.getElementById('paperTitle').required = false;
        document.getElementById('certificateName').required = false;
        document.getElementById('participantType').required = false;
        // Reset values
        document.getElementById('paperId').value = '';
        document.getElementById('paperTitle').value = '';
        document.getElementById('certificateName').value = '';
        document.getElementById('participantType').value = '';
    }

    toggleDietaryFields();
    toggleIeeeField();
    // Calculate price when presenter type changes
    calculatePrice();
}

function toggleIeeeField() {
    const organisation = document.getElementById('organisation').value;
    const presenterType = document.getElementById('presenterType').value;
    const ieeeDiv = document.getElementById('ieeeDiv');
    const ieeeSelect = document.getElementById('ieeeMember');

    // Only relevant for "Other" institutions (excludes host & co-host) that are Presenters
    if (organisation === 'Other' && presenterType === 'Presenter') {
        ieeeDiv.classList.remove('hidden');
        ieeeSelect.required = true;
    } else {
        ieeeDiv.classList.add('hidden');
        ieeeSelect.required = false;
        ieeeSelect.value = '';
    }

    // Keep the IEEE member number field in sync
    toggleIeeeNumberField();
}

function toggleIeeeNumberField() {
    const ieeeMember = document.getElementById('ieeeMember').value;
    const ieeeNumberDiv = document.getElementById('ieeeNumberDiv');
    const ieeeNumberInput = document.getElementById('ieeeNumber');

    if (ieeeMember === 'Yes') {
        ieeeNumberDiv.classList.remove('hidden');
        ieeeNumberInput.required = true;
    } else {
        ieeeNumberDiv.classList.add('hidden');
        ieeeNumberInput.required = false;
        ieeeNumberInput.value = '';
    }

    // Recalculate price whenever IEEE status changes
    calculatePrice();
}

function toggleDietaryFields() {
    const presenterType = document.getElementById('presenterType').value;
    const participantType = document.getElementById('participantType').value;
    const dietaryDiv = document.getElementById('dietaryDiv');

    // Always show dietary preference for physical attendance
    if (document.getElementById('attendanceMode').value === 'Physical') {
        dietaryDiv.classList.remove('hidden');
        document.getElementById('dietaryPreference').required = true;

        // Calculate price when participant type changes
        calculatePrice();
    } else {
        dietaryDiv.classList.add('hidden');
        document.getElementById('dietaryPreference').required = false;
        document.getElementById('dietaryPreference').value = '';
        document.getElementById('otherDietaryDiv').classList.add('hidden');
        document.getElementById('otherDietary').required = false;
        document.getElementById('otherDietary').value = '';
    }
}

function toggleOtherDietary() {
    const dietaryPreference = document.getElementById('dietaryPreference').value;
    const otherDietaryDiv = document.getElementById('otherDietaryDiv');

    if (dietaryPreference === 'Other') {
        otherDietaryDiv.classList.remove('hidden');
        document.getElementById('otherDietary').required = true;
    } else {
        otherDietaryDiv.classList.add('hidden');
        document.getElementById('otherDietary').required = false;
        document.getElementById('otherDietary').value = '';
    }
}

function calculatePrice() {
    const attendanceMode = document.getElementById('attendanceMode').value;
    const organisation = document.getElementById('organisation').value;
    const presenterType = document.getElementById('presenterType').value;
    const participantType = document.getElementById('participantType').value;
    const country = document.getElementById('country').value;
    const ieeeMember = document.getElementById('ieeeMember') ? document.getElementById('ieeeMember').value : '';
    const pricingDiv = document.getElementById('pricingDiv');
    const registerBtn = document.getElementById('registerBtn');
    const paymentBtn = document.getElementById('paymentBtn');
    
    console.log('Price calculation inputs:', {
        attendanceMode,
        organisation,
        presenterType,
        participantType,
        country,
        ieeeMember
    });
    
    // Get the pricing for the selected organisation
    const orgPricing = PRICING[organisation];
    
    // Calculate base price
    let price = { rm: 0, usd: 0 };
    
    if (attendanceMode === 'Online') {
        if (presenterType === 'Presenter') {
            if (organisation === 'Other') {
                const tier = ieeeMember === 'Yes' ? orgPricing.online.presenter.ieee : orgPricing.online.presenter.nonIEEE;
                if (participantType === 'Professional') {
                    price = tier.professional;
                    console.log('Setting professional price:', price);
                } else if (participantType === 'Student') {
                    price = tier.student;
                    console.log('Setting student price:', price);
                }
            } else if (organisation === 'Tunku Abdul Rahman University of Management and Technology (Malaysia)') {
                // For TAR UMT online presenter
                price = orgPricing.online.presenter;
            } else {
                // For other institutions' online presenters
                price = orgPricing.online.presenter;
            }
        } else {
            // For all online non-presenters
            price = orgPricing.online.nonPresenter;
        }
    } else {
        if (presenterType === 'Presenter') {
            if (organisation === 'Other') {
                const tier = ieeeMember === 'Yes' ? orgPricing.physical.presenter.ieee : orgPricing.physical.presenter.nonIEEE;
                if (participantType === 'Professional') {
                    price = tier.professional;
                } else if (participantType === 'Student') {
                    price = tier.student;
                }
            } else {
                // For all other institutions' physical presenters
                price = orgPricing.physical.presenter;
            }
        } else {
            // For all physical non-presenters
            price = orgPricing.physical.nonPresenter;
        }
    }

    // Show/hide pricing div based on conditions
    if (!organisation || !presenterType) {
        pricingDiv.classList.add('hidden');
        registerBtn.classList.remove('hidden');
        paymentBtn.classList.add('hidden');
        return;
    }

    // For "Other" institutions' presenters, wait until participant type and IEEE status are chosen
    if (organisation === 'Other' && presenterType === 'Presenter' && (!participantType || !ieeeMember)) {
        pricingDiv.classList.add('hidden');
        registerBtn.classList.remove('hidden');
        paymentBtn.classList.add('hidden');
        return;
    }

    // Show pricing div for all cases
    pricingDiv.classList.remove('hidden');

    // Update amounts and button visibility
    if (country === 'Malaysia') {
        document.getElementById('totalAmount').innerHTML = `<h3>RM ${price.rm}</h3>`;
        document.getElementById('usdAmount').textContent = '';
    } else if (price.usd > 0) {
        document.getElementById('totalAmount').innerHTML = `<h3>USD ${price.usd}</h3>`;
        document.getElementById('usdAmount').textContent = `RM ${price.rm}`;
    } else {
        document.getElementById('totalAmount').innerHTML = `<h3>RM ${price.rm}</h3>`;
        document.getElementById('usdAmount').textContent = '';
    }

    // Show payment button if there's a fee
    if (price.rm > 0 || price.usd > 0) {
        registerBtn.classList.add('hidden');
        paymentBtn.classList.remove('hidden');
    } else {
        registerBtn.classList.remove('hidden');
        paymentBtn.classList.add('hidden');
    }
}

function handleSubmit(event) {
    event.preventDefault();

    // Get the form element
    const form = document.querySelector('form');

    // Check if form is valid
    if (!form.checkValidity()) {
        // If form is invalid, show browser's default validation messages
        form.reportValidity();
        return;
    }

    // Additional validation for conditional fields
    const attendanceMode = document.getElementById('attendanceMode').value;
    const organisation = document.getElementById('organisation').value;
    const presenterType = document.getElementById('presenterType').value;

    if (attendanceMode === 'Physical') {
        // Check dietary preference for all physical attendance
        const dietaryPreference = document.getElementById('dietaryPreference').value;

        if (!dietaryPreference) {
            alert('Please select your dietary preference.');
            return;
        }

        // If dietary preference is "Other", check if other dietary is filled
        if (dietaryPreference === 'Other' && !document.getElementById('otherDietary').value) {
            alert('Please specify your dietary preference.');
            return;
        }

        // Only check presenter type and paper information if not TAR UMT non-presenter
        if (!(organisation === 'Tunku Abdul Rahman University of Management and Technology (Malaysia)' && presenterType === 'Non-Presenter')) {
            if (!presenterType) {
                alert('Please select your presenter type.');
                return;
            }

            // If presenter, check paper information
            if (presenterType === 'Presenter') {
                const paperId = document.getElementById('paperId').value;
                const paperTitle = document.getElementById('paperTitle').value;
                const certificateName = document.getElementById('certificateName').value;
                const participantType = document.getElementById('participantType').value;

                if (!participantType) {
                    alert('Please select your participant type.');
                    return;
                }

                if (!paperId || !paperTitle || !certificateName) {
                    alert('Please fill in all paper information fields.');
                    return;
                }

                if (organisation === 'Other' && !document.getElementById('ieeeMember').value) {
                    alert('Please select whether you are an IEEE member.');
                    return;
                }

                if (organisation === 'Other' && document.getElementById('ieeeMember').value === 'Yes' && !document.getElementById('ieeeNumber').value) {
                    alert('Please enter your IEEE Member No.');
                    return;
                }
            }
        }
    }

    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();

    // Reset form after modal is closed
    document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
        form.reset();
        // Reset all hidden fields
        document.getElementById('otherCountryDiv').classList.add('hidden');
        document.getElementById('otherOrgDiv').classList.add('hidden');
        document.getElementById('physicalFields').classList.add('hidden');
        document.getElementById('dietaryDiv').classList.add('hidden');
        document.getElementById('otherDietaryDiv').classList.add('hidden');
        document.getElementById('paperInfoDiv').classList.add('hidden');
        document.getElementById('participantTypeDiv').classList.add('hidden');
        document.getElementById('ieeeDiv').classList.add('hidden');
        document.getElementById('ieeeNumberDiv').classList.add('hidden');
        document.getElementById('pricingDiv').classList.add('hidden');
        // Reset buttons
        document.getElementById('registerBtn').classList.remove('hidden');
        document.getElementById('paymentBtn').classList.add('hidden');
    });
}

function handlePayment(event) {
    event.preventDefault();

    // Get the form element
    const form = document.querySelector('form');

    // Check if form is valid
    if (!form.checkValidity()) {
        // If form is invalid, show browser's default validation messages
        form.reportValidity();
        return;
    }

    // Additional validation for conditional fields
    const attendanceMode = document.getElementById('attendanceMode').value;

    if (attendanceMode === 'Physical') {
        // Check physical attendance required fields
        const presenterType = document.getElementById('presenterType').value;
        const participantType = document.getElementById('participantType').value;
        const dietaryPreference = document.getElementById('dietaryPreference').value;

        if (!presenterType || !dietaryPreference) {
            alert('Please fill in all required fields for physical attendance.');
            return;
        }

        // If dietary preference is "Other", check if other dietary is filled
        if (dietaryPreference === 'Other' && !document.getElementById('otherDietary').value) {
            alert('Please specify your dietary preference.');
            return;
        }

        // If presenter, check paper information
        if (presenterType === 'Presenter') {
            const paperId = document.getElementById('paperId').value;
            const paperTitle = document.getElementById('paperTitle').value;
            const certificateName = document.getElementById('certificateName').value;
            const organisation = document.getElementById('organisation').value;

            if (!participantType) {
                alert('Please fill in all required fields for physical attendance.');
                return;
            }

            if (!paperId || !paperTitle || !certificateName) {
                alert('Please fill in all paper information fields.');
                return;
            }

            if (organisation === 'Other' && !document.getElementById('ieeeMember').value) {
                alert('Please select whether you are an IEEE member.');
                return;
            }

            if (organisation === 'Other' && document.getElementById('ieeeMember').value === 'Yes' && !document.getElementById('ieeeNumber').value) {
                alert('Please enter your IEEE Member No.');
                return;
            }
        }
    }

    // Store form data in sessionStorage
    const formData = new FormData(form);
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    // Store payment amount and country
    const totalAmount = document.getElementById('totalAmount').textContent;
    const country = document.getElementById('country').value;
    formDataObj.paymentAmount = totalAmount;
    formDataObj.country = country;

    sessionStorage.setItem('registrationData', JSON.stringify(formDataObj));

    // Redirect to loading page
    window.location.href = 'loading.html';
}

// File upload handling functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        displayFileInfo(file);
    }
}

function displayFileInfo(file) {
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const previewImage = document.getElementById('previewImage');

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = 'block';

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile() {
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('previewImage').style.display = 'none';
}

function submitEvidence() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('Please select a file first.');
        return;
    }

    // TODO: Implement file upload logic here

    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('paymentEvidenceSuccessModal'));
    successModal.show();
}

// Initialize drag and drop functionality when the page loads
document.addEventListener('DOMContentLoaded', function () {
    // Initialize organization list based on selected country
    toggleOtherCountry();

    // Add event listener for participant type change
    const participantTypeSelect = document.getElementById('participantType');
    if (participantTypeSelect) {
        participantTypeSelect.addEventListener('change', function() {
            console.log('Participant type changed to:', this.value);
            calculatePrice();
        });
    }

    // Clear form on page load and navigation
    function clearForm() {
        const form = document.querySelector('form');
        if (form) {
            form.reset();

            // Reset all hidden fields
            document.getElementById('otherCountryDiv').classList.add('hidden');
            document.getElementById('otherOrgDiv').classList.add('hidden');
            document.getElementById('physicalFields').classList.add('hidden');
            document.getElementById('dietaryDiv').classList.add('hidden');
            document.getElementById('otherDietaryDiv').classList.add('hidden');
            document.getElementById('paperInfoDiv').classList.add('hidden');
            document.getElementById('participantTypeDiv').classList.add('hidden');
            document.getElementById('ieeeDiv').classList.add('hidden');
            document.getElementById('ieeeNumberDiv').classList.add('hidden');
            document.getElementById('pricingDiv').classList.add('hidden');

            // Reset buttons
            document.getElementById('registerBtn').classList.remove('hidden');
            document.getElementById('paymentBtn').classList.add('hidden');

            // Clear sessionStorage
            sessionStorage.clear();
        }
    }

    // Clear form on initial load
    clearForm();

    // Clear form on navigation
    window.addEventListener('pageshow', function (event) {
        clearForm();
    });

    // Clear form when returning to the page
    window.addEventListener('popstate', function (event) {
        clearForm();
    });

    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        uploadArea.addEventListener('drop', handleDrop, false);
    }
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.classList.add('border-primary');
    }
}

function unhighlight(e) {
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.classList.remove('border-primary');
    }
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (file) {
        document.getElementById('fileInput').files = dt.files;
        displayFileInfo(file);
    }
}