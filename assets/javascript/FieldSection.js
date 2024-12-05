const authToken = localStorage.getItem("authToken");
let staffData = [];

window.addEventListener('load', () => {
    fetchFieldCode();
    loadStaffIds();
    fetchFieldData();
});



function fetchFieldData(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/fields",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (response){
            loadFieldTable(response);

        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch field data:", xhr.responseText || error);
        }
    });
}

// Function to load data into the table
function loadFieldTable(data) {
    const fieldTableBody = $("#field-tbl-tbody");
    fieldTableBody.empty();

    data.forEach(field => {
        // Check and display field images
        const fieldImage1 = field.fieldImage1
            ? `<img src="data:image/${getImageType(field.fieldImage1)};base64,${field.fieldImage1}" alt="Field Image 1" class="centered-image">`
            : "No Image";

        const fieldImage2 = field.fieldImage2
            ? `<img src="data:image/${getImageType(field.fieldImage2)};base64,${field.fieldImage2}" alt="Field Image 2" class="centered-image">`
            : "No Image";

        // Add table row
        const row = `
            <tr>
                <td class="field-code-value">${field.fieldCode || "No Code"}</td>
                <td class="field-name-value">${field.fieldName || "No Name"}</td>
                <td class="field-location-value">${field.fieldLocation || "No Location"}</td>
                <td class="field-extent-size-value">${field.extentSize || "No Size"}</td>
                <td class="field-image1-value">${fieldImage1}</td>
                <td class="field-image2-value">${fieldImage2}</td>           
            </tr>`;
        fieldTableBody.append(row);
    });
}


// Function to determine the image type from a base64 string
function getImageType(base64String) {
    if (base64String.startsWith("iVBORw0K")) {
        return "png";
    } else if (base64String.startsWith("/9j/")) {
        return "jpeg";
    } else {
        return "jpeg"; // Default to JPEG
    }
}


// Handle row click to populate modal form
$("#field-tbl-tbody").on('click', 'tr', function() {
    //extracting text values from table row cells
    let fieldCode = $(this).find(".field-code-value").text();
    let fieldName = $(this).find(".field-name-value").text();
    let fieldLocation = $(this).find(".field-location-value").text();
    let extentSize = $(this).find(".field-extent-size-value").text();

    //extracting the src (base64) of the images
    let fieldImage1 = $(this).find(".field-image1-value img").attr('src') || "No Image";
    let fieldImage2 = $(this).find(".field-image2-value img").attr('src') || "No Image";


    //log the extracted values for debugging
    console.log("Field Code: ", fieldCode);
    console.log("Field Name: ", fieldName);
    console.log("Field Location: ", fieldLocation);
    console.log("Extent Size: ", extentSize);

    /*console.log("Field Image 1: ", fieldImage1);
    console.log("Field Image 2: ", fieldImage2);*/

    //set the values to the modal form inputs (for text-based fields)
    $('#field-code').val(fieldCode);
    $('#field-name').val(fieldName);
    $('#field-location').val(fieldLocation);
    $('#extent-size').val(extentSize);

    //display the images in the modal using <img> tags
    if (fieldImage1 !== "No Image") {
        $('#previewImage1').attr('src', fieldImage1).removeClass('d-none');  // Show image 1
    } else {
        $('#previewImage1').addClass('d-none');  // Hide image 1 if there's no image
    }

    if (fieldImage2 !== "No Image") {
        $('#previewImage2').attr('src', fieldImage2).removeClass('d-none');  // Show image 2
    } else {
        $('#previewImage2').addClass('d-none');  // Hide image 2 if there's no image
    }


    //show the modal
    $('#field-section-details-form').modal('show');
});


//set field code
function  fetchFieldCode(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/fields/generate-next-field-code", // API URL
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (data) {
            //populate staff id field
            $("#field-code").val(data.fieldCode);
            console.log(data.fieldCode);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching Crop code:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}


// Function to load staff IDs
function loadStaffIds() {
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/staff", // API URL for staff data
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (data) {
            staffData = data; // Assign API response to the global staffData variable
            // Populate the select element with staff IDs
            staffData.forEach((staff) => {
                $("#fieldStaffIdOption").append(new Option(staff.staffId, staff.staffId));
            });
            console.log("Successfully loaded Staff IDs");
        },
        error: function (xhr, status, error) {
            console.error("Error loading Staff IDs:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}


//Event listener for staff ID selection
document.getElementById('fieldStaffIdOption').addEventListener('change', function () {
    const selectedStaffId = this.value; // Get selected staff ID
    // Find the selected staff data
    const selectedStaff = staffData.find(staff => staff.staffId === selectedStaffId);

    if (selectedStaff) {
        // Populate staff name and designation fields
        document.getElementById('set-field-staff-name').value = `${selectedStaff.firstName} ${selectedStaff.lastName}`;
        document.getElementById('set-field-staff-designation').value = selectedStaff.designation;
    } else {
        // Clear fields if no matching staff is found
        document.getElementById('set-field-staff-name').value = "";
        document.getElementById('set-field-staff-designation').value = "";
    }
});


//field save
$("#field-save").click(function () {
    const fieldCode = $("#field-code").val().trim();
    const fieldName = $("#field-name").val().trim();
    const fieldLocation = $("#field-location").val().trim();
    const extentSize = $("#extent-size").val().trim();
    const fieldImage1 = $("#fieldImage1")[0].files[0];
    const fieldImage2 = $("#fieldImage2")[0].files[0];

    //collect staff data
    const staffId = $("#fieldStaffIdOption").val();

    //validate fields
    if (!fieldCode || !fieldName || !fieldLocation || !extentSize || !fieldImage1 || !fieldImage2 || !staffId) {
        Swal.fire({
            icon: "error",
            title: "Missing Fields",
            text: "Please fill in all the required fields!",
        });
        return;
    }

    // create a staff list JSON object
    const staffList = [
        {
            staffId: staffId,
        }
    ];

    // create FormData object
    const formData = new FormData();
    formData.append("fieldCode", fieldCode);
    formData.append("fieldName", fieldName);
    formData.append("extentSize", extentSize);
    formData.append("fieldLocation", fieldLocation);
    formData.append("fieldImage1", fieldImage1);
    formData.append("fieldImage2", fieldImage2);
    formData.append("staff", JSON.stringify(staffList));


    console.log("Submitting the following data to the server:");
    console.log({
        fieldCode,
        fieldName,
        extentSize,
        fieldLocation,
        staff: staffList
    });

    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/fields", // Replace with your API endpoint
        type: "POST",
        data: formData,
        processData: false, // Prevent jQuery from processing the FormData
        contentType: false, // Let the browser set the content type (multipart/form-data)
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add Bearer token to headers
        },
        dataType: "text", // Explicitly set the response data type to plain text
        success: function (response) {
            Swal.fire({
                icon: "success",
                title: "Field Saved",
                text: "Field saved successfully!",
            });
            console.log("Server response:", response);
            fetchFieldData();
            staffClearFields();
            fetchFieldCode();
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Error Saving Field",
                text: `Error: ${xhr.responseText}`,
            });
            console.error("Error details:", xhr);
        }
    });
});


//field update
$("#field-update").on("click", function (e) {
    e.preventDefault();

    const fieldCode = $('#field-code').val();

    if (!fieldCode) {
        Swal.fire("Error", "Field code is required to update field details.", "error");
        return;
    }

    // Ensure file inputs have files selected
    const fieldImage1Input = $('#fieldImage1')[0];
    const fieldImage2Input = $('#fieldImage2')[0];

    if (!fieldImage1Input.files || !fieldImage1Input.files[0]) {
        Swal.fire("Error", "Field Image 1 is required.", "error");
        return;
    }

    if (!fieldImage2Input.files || !fieldImage2Input.files[0]) {
        Swal.fire("Error", "Field Image 2 is required.", "error");
        return;
    }

    // Gather form data
    const formData = new FormData();
    formData.append("fieldCode", fieldCode);
    formData.append("fieldName", $('#field-name').val());
    formData.append("fieldLocation", $('#field-location').val());
    formData.append("extentSize", $('#extent-size').val());
    formData.append("fieldImage1", fieldImage1Input.files[0]); // Attach file
    formData.append("fieldImage2", fieldImage2Input.files[0]); // Attach file

    // Prepare staff data (JSON)
    const staff = [
        {
            staffId: $('#fieldStaffIdOption').val(),
        },
    ];
    formData.append("staff", JSON.stringify(staff)); // Attach staff data as JSON string

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    // AJAX request with multipart/form-data
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/fields/${fieldCode}`,
        type: "PUT",
        data: formData,
        processData: false, // Prevent automatic data processing
        contentType: false, // Let the browser set the appropriate headers for FormData
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add Bearer token
        },
        success: function (response) {
            Swal.fire(
                "Success",
                "Field updated successfully!",
                "success"
            ).then(() => {
                $('#field-section-details-form').modal('hide');
            });
            fetchFieldData();
            staffClearFields();
            fetchFieldCode();
        },
        error: function (xhr) {
            console.error("Update error:", xhr);
            const errorMessage = xhr.responseJSON?.message || "Failed to update field details. Please try again.";
            Swal.fire("Error", errorMessage, "error");
        },
    });
});


// Event listener for the search button
$("#field-search").on("click", function () {
    // Get the field code entered by the user
    const fieldSearchCode = $("#field-search-by-field-code").val().trim();

    if (!fieldSearchCode) {
        Swal.fire(
            "Input Required",
            "Please enter a valid Field code to search.",
            "warning"
        );
        return;
    }

    console.log("Searching for Field code:", fieldSearchCode);

    // Perform the AJAX GET request to search for the field details
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/fields/${fieldSearchCode}`, // API endpoint for field details
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add Bearer token to headers
        },
        success: function (response) {
            console.log("Field search result:", response);

            // Populate the form fields with the field details
            $('#field-code').val(response.fieldCode || "No Code");
            $('#field-name').val(response.fieldName || "No Name");
            $('#field-location').val(response.fieldLocation || "No Location");
            $('#extent-size').val(response.extentSize || "No Size");

            // Display images in preview
            if (response.fieldImage1) {
                $('#previewImage1')
                    .attr("src", `data:image/${getImageType(response.fieldImage1)};base64,${response.fieldImage1}`)
                    .removeClass('d-none');
            } else {
                $('#previewImage1').addClass('d-none');
            }

            if (response.fieldImage2) {
                $('#previewImage2')
                    .attr("src", `data:image/${getImageType(response.fieldImage2)};base64,${response.fieldImage2}`)
                    .removeClass('d-none');
            } else {
                $('#previewImage2').addClass('d-none');
            }

            // Fetch staff details associated with the fieldCode
            $.ajax({
                url: `http://localhost:8080/GreenShadow/api/v1/fields/${fieldSearchCode}/staff`, // Endpoint for staff details
                type: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`, // Add Bearer token to headers
                },
                success: function (staffResponse) {
                    console.log("Staff data:", staffResponse);

                    if (staffResponse && staffResponse.length > 0) {
                        // Populate the first staff details
                        const firstStaff = staffResponse[0];
                        $("#fieldStaffIdOption").val(firstStaff.staffId || ""); // Set the staff ID
                        $('#set-field-staff-name').val(`${firstStaff.firstName || ""} ${firstStaff.lastName || ""}`); // Set staff name
                        $('#set-field-staff-designation').val(firstStaff.designation || ""); // Set staff designation
                    } else {
                        console.warn("No staff assigned to this field.");
                        $("#fieldStaffIdOption").val(""); // Clear the input field if no staff assigned
                        $('#set-field-staff-name').val(""); // Clear staff name
                        $('#set-field-staff-designation').val(""); // Clear staff designation
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching staff data:", xhr.responseText || error);
                    Swal.fire(
                        "Error",
                        "Failed to fetch staff details. Please try again.",
                        "error"
                    );
                }
            });

            $('#field-section-details-form').modal('show');

            // Show success notification for field details
            Swal.fire(
                "Field Found",
                `Details for Field Code: ${fieldSearchCode} loaded successfully.`,
                "success"
            );
        },
        error: function (xhr, status, error) {
            const errorMessage = xhr.responseJSON?.message || "Failed to fetch field details. Please try again.";
            Swal.fire(
                "Error",
                errorMessage,
                "error"
            );
            console.error("Search error:", xhr.responseText || error);
        }
    });
});



//field delete
$("#field-delete").on("click", function (e) {
    e.preventDefault();

    // Retrieve the staff ID from the input field
    const fieldDeleteCode = $('#field-code').val();

    if (!fieldDeleteCode) {
        Swal.fire("Error", "Crop Code is required to delete crop details.", "error");
        return;
    }

    console.log("field code to delete: ", fieldDeleteCode);

    if (!authToken) {
        Swal.fire(
            "Error",
            "No authentication token found. Please log in again.",
            "error"
        );
        return;
    }
    console.log(authToken)
    // Send the DELETE request
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/fields/${fieldDeleteCode}`,
        type: "DELETE",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add the token to the Authorization header
        },
        dataType: "text",
        success: function (response) {
            Swal.fire("Success",
                "Field deleted successfully!",
                "success").then(() => {
                //Hide the modal after successful deletion
                $('#field-section-details-form').modal('hide');
            });

            //Refresh staff data
            fetchFieldData();
            fetchFieldCode();
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.message || "Failed to delete Field details.Please try again.";
            Swal.fire("Error", errorMessage, "error");
        }
    });
});


function staffClearFields(){
    $("#field-code").val("");
    $("#field-name").val("");
    $("#field-location").val("");
    $("#extent-size").val("");
    $("#fieldImage1").val("");
    $("#fieldImage2").val("");
    $("#fieldStaffIdOption").val("");
    $("#set-field-staff-name").val("");
    $("#set-field-staff-designation").val("");

}








