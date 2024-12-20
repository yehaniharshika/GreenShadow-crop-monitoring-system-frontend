const authToken = localStorage.getItem("authToken");
window.addEventListener('load', () => {
    fetchStaffId();
    fetchStaffData();
});

const regexPatterns = {
    firstName: /^[A-Za-z\s]{3,}$/,
    lastName: /^[A-Za-z\s]{3,}$/,
    dob: /^\d{4}-\d{2}-\d{2}$/,  // Date format: YYYY-MM-DD
    gender: /^(Male|Female|Other)$/,  // Gender options
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,  // Email format
    phone: /^(070|071|072|074|075|076|077|078|038)\d{7}$/,  // Phone number format
};

function validateStaffForm() {
    let valid = true; // Track overall form validity

    const fields = [
        { id: '#firstName', pattern: regexPatterns.firstName, error: "Invalid First Name. Only letters allowed." },
        { id: '#lastName', pattern: regexPatterns.lastName, error: "Invalid Last Name. Only letters allowed." },
        { id: '#dob', pattern: regexPatterns.dob, error: "Invalid Date of Birth. Format should be YYYY-MM-DD." },
        { id: '#gender', pattern: regexPatterns.gender, error: "Invalid Gender. Allowed values: Male, Female, Other." },
        { id: '#email', pattern: regexPatterns.email, error: "Invalid Email format." },
        { id: '#contact-number', pattern: regexPatterns.phone, error: "Invalid contact number. It should be exactly 10 digits." }
    ];

    // Validate each field
    fields.forEach(({ id, pattern, error }) => {
        const value = $(id).val();
        if (!pattern.test(value)) {
            Swal.fire("Error", error, "error");
            valid = false;
        }
    });

    return valid; // Return overall validity
}

$("#staff-save").on("click", function (e) {
    e.preventDefault(); // Prevent default form submission

    if (!validateStaffForm()) {
        return; // Stop if validation fails
    }

    // Collect staff details from the form
    const staffData = {
        staffId: $('#staff-id').val(),
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        DOB: $('#dob').val(),
        gender: $('#gender').val(),
        designation: $('#designation').val(),
        joinedDate: $('#joined-date').val(),
        addressLine1: $('#addressLine1').val(),
        addressLine2: $('#addressLine2').val(),
        addressLine3: $('#addressLine3').val(),
        addressLine4: $('#addressLine4').val(),
        addressLine5: $('#addressLine5').val(),
        email: $('#email').val(),
        role: $('#role').val(),
        contactNumber: $('#contact-number').val()
    };

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    // Save staff details via AJAX
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/staff`,
        type: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`,
        },
        data: JSON.stringify(staffData),
        success: function (response) {
            Swal.fire("Success", "Staff saved successfully!", "success").then(() => {
                fetchStaffData();
                staffClearFields();
                fetchStaffId();
            });
        },
        error: function (xhr) {
            Swal.fire("Error", xhr.responseJSON?.message || "Failed to save staff. Please try again.", "error");
        },
    });
});


function  fetchStaffId(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/staff/generate-next-staff-id", // API URL
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (data) {
            //populate staff id field
            $("#staff-id").val(data.staffId);
            console.log(data.staffId);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching customer Id:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}

function fetchStaffData(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/staff",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (response){
            loadStaffTable(response);
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch staff data:", xhr.responseText || error);
        }
    });
}

function loadStaffTable(data){
    const tableBody = $("#staff-tbl-tbody");
    tableBody.empty();

    data.forEach(staff =>{
        const row = `
            <tr>
                <td class="staff-id-value">${staff.staffId}</td>
                <td class="staff-first-name-value">${staff.firstName}</td>
                <td class="staff-last-name-value">${staff.lastName}</td>
                <td class="staff-gender-value">${staff.gender}</td>
                <td class="staff-addressLine1-value">${staff.addressLine1}</td>
                <td class="staff-addressLine2-value">${staff.addressLine2}</td>
                <td class="staff-addressLine3-value">${staff.addressLine3}</td>
                <td class="staff-addressLine4-value">${staff.addressLine4}</td>
                <td class="staff-addressLine5-value">${staff.addressLine5}</td>
                <td class="staff-dob-value">${staff.DOB}</td>
                <td class="staff-joined-date-value">${staff.joinedDate}</td>
                <td class="staff-designation-value">${staff.designation}</td>
                <td class="staff-contact-value">${staff.contactNumber}</td>
                <td class="staff-email-value">${staff.email}</td>
                <td class="staff-role-value">${staff.role}</td>
            </tr>`;
        tableBody.append(row)
    })
}

$("#staff-tbl-tbody").on('click', 'tr', function() {
    let staffId = $(this).find(".staff-id-value").text();
    let firstName = $(this).find(".staff-first-name-value").text();
    let lastName = $(this).find(".staff-first-name-value").text();
    let gender = $(this).find(".staff-gender-value").text();
    let addressLine1 = $(this).find(".staff-addressLine1-value").text();
    let addressLine2 = $(this).find(".staff-addressLine2-value").text();
    let addressLine3 = $(this).find(".staff-addressLine3-value").text();
    let addressLine4 = $(this).find(".staff-addressLine4-value").text();
    let addressLine5 = $(this).find(".staff-addressLine5-value").text();
    let DOB = $(this).find(".staff-dob-value").text();
    let joinedDate = $(this).find(".staff-joined-date-value").text();
    let designation = $(this).find(".staff-designation-value").text();
    let contactNumber = $(this).find(".staff-contact-value").text();
    let email = $(this).find(".staff-email-value").text();
    let role = $(this).find(".staff-role-value").text();

    $('#staff-id').val(staffId),
    $('#firstName').val(firstName),
    $('#lastName').val(lastName),
    $('#dob').val(DOB),
    $('#gender').val(gender),
    $('#designation').val(designation),
    $('#joined-date').val(joinedDate),
    $('#addressLine1').val(addressLine1),
    $('#addressLine2').val(addressLine2),
    $('#addressLine3').val(addressLine3),
    $('#addressLine4').val(addressLine4),
    $('#addressLine5').val(addressLine5),
    $('#contact-number').val(contactNumber),
    $('#email').val(email),
    $('#role').val(role)

    $('#staff-section-details-form').modal('show');
});


$("#staff-update").on("click", function (e) {
    e.preventDefault();

    if (!validateStaffForm()) {
        return; // Stop if validation fails
    }

    const staffId = $('#staff-id').val();

    if (!staffId){
        Swal.fire("Error", "Staff ID is required to update staff details.", "error");
        return;
    }

    // Get staff details from the form
    const staffData = {
        staffId: staffId,
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        DOB: $('#dob').val(),
        gender: $('#gender').val(),
        designation: $('#designation').val(),
        joinedDate: $('#joined-date').val(),
        addressLine1: $('#addressLine1').val(),
        addressLine2: $('#addressLine2').val(),
        addressLine3: $('#addressLine3').val(),
        addressLine4: $('#addressLine4').val(),
        addressLine5: $('#addressLine5').val(),
        email: $('#email').val(),
        role: $('#role').val(),
        contactNumber: $('#contact-number').val()
    };

    console.log("Staff Data: ", staffData);
    console.log("Auth Token: ",authToken)

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/staff/${staffId}`,
        type: "PUT",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add the token to the Authorization header
        },
        data: JSON.stringify(staffData),
        success: function (response) {
            Swal.fire(
                "Success",
                "Staff updated successfully!",
                "success").then(() => {
                $('#staff-section-details-form').modal('hide');
            });
            fetchStaffData();
            staffClearFields();
            fetchStaffId();
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.message || "Failed to update staff details. Please try again.";
            Swal.fire("Error", errorMessage, "error");
        },
    });
});

$("#staff-delete").on("click", function (e) {
    e.preventDefault();

    // Retrieve the staff ID from the input field
    const staffDeleteId = $('#staff-id').val();

    if (!staffDeleteId) {
        Swal.fire("Error", "Staff ID is required to delete staff details.", "error");
        return;
    }

    console.log("Staff ID to delete: ", staffDeleteId);
    console.log("Auth Token: ", authToken);

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    // Send the DELETE request
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/staff/${staffDeleteId}`,
        type: "DELETE",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add the token to the Authorization header
        },
        success: function (response) {
            Swal.fire("Success", "Staff deleted successfully!", "success").then(() => {
                // Hide the modal after successful deletion
                $('#staff-section-details-form').modal('hide');
            });

            // Refresh staff data
            fetchStaffData();
            fetchStaffId();
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.message || "Failed to delete staff details. Please try again.";
            Swal.fire("Error", errorMessage, "error");
        }
    });
});


$("#staff-search").on("click", function (e) {
    let staffSearchId = $("#staff-search-by-staff-id").val();

    if (!staffSearchId) {
        Swal.fire(
            'Input Required',
            'Please enter a correct staff ID to search.',
            'warning'
        );
        return;
    }

    console.log("searching for staff Id: ", staffSearchId);

    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/staff/${staffSearchId}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add the token to the Authorization header
        },

        success: function (response) {
            // Use the response directly as it's already parsed
            const staff = response;

            $('#staff-id').val(staff.staffId);
            $('#firstName').val(staff.firstName);
            $('#lastName').val(staff.lastName);
            $('#dob').val(staff.DOB);
            $('#gender').val(staff.gender);
            $('#designation').val(staff.designation);
            $('#joined-date').val(staff.joinedDate);
            $('#addressLine1').val(staff.addressLine1);
            $('#addressLine2').val(staff.addressLine2);
            $('#addressLine3').val(staff.addressLine3);
            $('#addressLine4').val(staff.addressLine4);
            $('#addressLine5').val(staff.addressLine5);
            $('#contact-number').val(staff.contactNumber);
            $('#email').val(staff.email);
            $('#role').val(staff.role);
            $('#staff-section-details-form').modal('show');

            Swal.fire(
                'Staff Found!',
                'Staff details retrieved successfully.',
                'success'
            );
            
            // Clear the fields after 6 seconds
            setTimeout(() => {
                $('#staff-id').val('');
                $('#firstName').val('');
                $('#lastName').val('');
                $('#dob').val('');
                $('#gender').val('');
                $('#designation').val('');
                $('#joined-date').val('');
                $('#addressLine1').val('');
                $('#addressLine2').val('');
                $('#addressLine3').val('');
                $('#addressLine4').val('');
                $('#addressLine5').val('');
                $('#contact-number').val('');
                $('#email').val('');
                $('#role').val('');
            }, 6000);
        },
        error: function (xhr) {
            Swal.fire(
                "Error",
                xhr.responseJSON?.message || "Failed to search staff. Please try again.",
                "error"
            );
        },
    });
});


function staffClearFields(){
    $('#staff-id').val('');
    $('#firstName').val('');
    $('#lastName').val('');
    $('#dob').val('');
    $('#gender').val('');
    $('#designation').val('');
    $('#joined-date').val('');
    $('#addressLine1').val('');
    $('#addressLine2').val('');
    $('#addressLine3').val('');
    $('#addressLine4').val('');
    $('#addressLine5').val('');
    $('#contact-number').val('');
    $('#email').val('');
    $('#role').val('');
}


