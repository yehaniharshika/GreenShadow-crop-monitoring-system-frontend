const authToken = localStorage.getItem("authToken");
let staffData = [];
window.addEventListener('load', () => {
    fetchFieldCode();
    loadStaffIds();
    fetchFieldData();
});


/*function fetchFieldData(){
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
}*/

/*function loadFieldTable(data) {
    const fieldTableBody = $("#field-tbl-tbody");
    fieldTableBody.empty();

    data.forEach(field => {
        // Check if fieldImage1 and fieldImage2 are available and display them
        const fieldImage1 = field.fieldImage1 ?
            `<img src="data:image/${getImageType(field.fieldImage1)};base64,${field.fieldImage1}" alt="Field Image 1" class="centered-image">`
            : "No Image";

        const fieldImage2 = field.fieldImage2 ?
            `<img src="data:image/${getImageType(field.fieldImage2)};base64,${field.fieldImage2}" alt="Field Image 2" class="centered-image">`
            : "No Image";

        // Create table row with image and data
        const row = `
            <tr>
                <td class="field-code-value">${field.fieldCode}</td>
                <td class="field-name-value">${field.fieldName}</td>
                <td class="field-location-value">${field.fieldLocation}</td>
                <td class="field-extent-size-value">${field.extentSize}</td>
                <td class="field-image1-value">${fieldImage1}</td>
                <td class="field-image2-value">${fieldImage2}</td>
            </tr>`;

        fieldTableBody.append(row);
    });
}

//Function to determine image type (png, jpeg, etc.) from base64 string
function getImageType(base64String) {
    if (base64String.startsWith("iVBORw0K")) {
        return "png";  //PNG image
    } else if (base64String.startsWith("/9j/")) {
        return "jpeg";  //JPG/JPEG image
    } else {
        return "jpeg";  //default to JPEG if no match found
    }
}
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
    console.log("Field Image 1: ", fieldImage1);
    console.log("Field Image 2: ", fieldImage2);

    //set the values to the modal form inputs (for text-based fields)
    $('#field-code').val(fieldCode);
    $('#field-name').val(fieldName);
    $('#field-location').val(fieldLocation);
    $('#extent-size').val(extentSize);

    // Display the images in the modal using <img> tags
    if (fieldImage1 !== "No Image") {
        console.log("Setting image 1: ", fieldImage1);
        $('#previewImage1').attr('src', fieldImage1).removeClass('d-none');  // Show image 1
    } else {
        $('#previewImage1').addClass('d-none');  // Hide image 1 if there's no image
    }

    if (fieldImage2 !== "No Image") {
        console.log("Setting image 2: ", fieldImage2);
        $('#previewImage2').attr('src', fieldImage2).removeClass('d-none');  // Show image 2
    } else {
        $('#previewImage2').addClass('d-none');  // Hide image 2 if there's no image
    }

    //show the modal
    $('#field-section-details-form').modal('show');
});*/






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


/*// Function to load staff IDs
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

// Event listener for staff ID selection
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
});*/

/*$("#field-save").click(function () {

    const fieldCode = $("#field-code").val().trim();
    const fieldName = $("#field-name").val().trim();
    const fieldLocation = $("#field-location").val().trim();
    const extentSize = $("#extent-size").val().trim();
    const fieldImage1 = $("#fieldImage1")[0].files[0];
    const fieldImage2 = $("#fieldImage2")[0].files[0];
    // collect staff data
    const staffId = $("#fieldStaffIdOption").val();

    // Validate fields
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

        // Log to debug
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
            $("form")[0].reset(); // Clear the form
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
});*/





