const authToken = localStorage.getItem("authToken");

window.addEventListener('load', () => {
    fetchCropCode();
    //fetchCropData();
});

function  fetchCropCode(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/crops/generate-next-crop-code", // API URL
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (data) {
            //populate staff id field
            $("#crop-code").val(data.cropCode);
            console.log(data.cropCode);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching Crop code:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}

/*
$("#staff-save").on("click", function (e) {
    e.preventDefault();

    // Get staff details from the form
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

    console.log("Staff Data:", staffData);

    console.log(authToken)

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/staff`,
        type: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add the token to the Authorization header
        },
        data: JSON.stringify(staffData),
        success: function (response) {
            Swal.fire(
                "Success",
                "Staff saved successfully!",
                "success").then(() => {
            });
            fetchStaffData();
            staffClearFields()
            fetchStaffId();
        },
        error: function (xhr) {
            Swal.fire("Error", xhr.responseJSON.message || "Failed to save staff. Please try again.", "error");
        },
    });
});*/
