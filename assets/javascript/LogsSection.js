const authToken = localStorage.getItem("authToken");
let staffData=[];
let cropData=[];
let fieldData=[];

window.addEventListener('load', () => {
    fetchLogCode();
    setLogDate();
    fetchLogData();
    loadStaffIdsToLogs();
    loadCropCodesToLogs();
    loadFieldCodesToLogs();
});



function fetchLogData() {
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/logs`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (response) {
            console.log("log data fetched successfully.");
            loadLogsTable(response);
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Failed to Load Data",
                text: `Error: ${xhr.responseText || error}`,
            });
            console.error("Failed to fetch logs data:", xhr.responseText || error);
        }
    });
}

function loadLogsTable(data) {
    const logsTableBody = $("#logs-tbl-tbody");
    logsTableBody.empty(); // Clear existing rows

    data.forEach(log => {
        // Handle the observed image
        const observedImage = log.observedImage
            ? `<img src="data:image/${getImageType(log.observedImage)};base64,${log.observedImage}" alt="Log Image" class="centered-image" style="max-width: 120px; height: 100px;">`
            : "No Image";


        // Append a new row to the table
        const row = `
            <tr>
                <td class="log-code-value">${log.logCode}</td>
                <td class="log-date-value">${log.logDate}</td>
                <td class="log-details-value">${log.logDetails}</td>
                <td class="log-image-value">${observedImage}</td>
                <td class="log-staff-id-value">${log.staffId || "N/A"}</td>
                <td class="log-crop-code-value">${log.cropCode || "N/A"}</td>
                <td class="log-field-code-value">${log.fieldCode || "N/A"}</td>
            </tr>`;
        logsTableBody.append(row);
    });

    console.log("Logs table loaded with images.");
}

$("#logs-tbl-tbody").on("click", "tr", function () {
    const logCode = $(this).find(".log-code-value").text();
    const logDate = $(this).find(".log-date-value").text();
    const logDetails = $(this).find(".log-details-value").text();
    const observedImage = $(this).find(".log-image-value img").attr("src") || "No Image";
    const logsStaffId = $(this).find(".log-staff-id-value").text();
    const logsCropCode = $(this).find(".log-crop-code-value").text();
    const logsFieldCode = $(this).find(".log-field-code-value").text();

    //populate modal inputs
    $("#log-code").val(logCode);
    $("#log-date").val(logDate);
    $("#log-details").val(logDetails);
    if (observedImage !==  "No Image"){
        $("#previewImageLog").attr("src", observedImage).removeClass("d-none");
    }else {
        $("#previewImageLog").addClass("d-none");
    }

    $("#logStaffIdOption").val(logsStaffId);
    $("#logCropCodeOption").val(logsCropCode);
    $("#logFieldCodeOption").val(logsFieldCode);

    /*setStaffDetails(logsStaffId);
    setCropDetails(logsCropCode);
    setFieldDetails(logsFieldCode);*/

    //$("#log-section-details-form").modal("show");
});

/*function setStaffDetails(staffId) {
    const selectedStaff = staffData.find(staff => staff.staffId === staffId);
    if (selectedStaff) {
        document.getElementById('set-staff-name-to-logs-section').value = `${selectedStaff.firstName} ${selectedStaff.lastName}`;
        document.getElementById('set-staff-email-to-logs-section').value = selectedStaff.email;
        document.getElementById('set-designation-to-logs-section').value = selectedStaff.designation;
        document.getElementById('set-staff-role-to-logs-section').value = selectedStaff.role;
    } else {
        document.getElementById('set-staff-name-to-logs-section').value = "";
        document.getElementById('set-staff-email-to-logs-section').value = "";
        document.getElementById('set-designation-to-logs-section').value = "";
        document.getElementById('set-staff-role-to-logs-section').value = "";
    }
}

function setCropDetails(cropCode) {
    const selectedCrop = cropData.find(crop => crop.cropCode === cropCode);
    if (selectedCrop) {
        document.getElementById('set-crop-common-name-to-logs-section').value = selectedCrop.cropCommonName;
        document.getElementById('set-crop-scientific-name-to-logs-section').value = selectedCrop.scientificName;
        document.getElementById('set-crop-category-to-logs-section').value = selectedCrop.category;
    } else {
        document.getElementById('set-crop-common-name-to-logs-section').value = "";
        document.getElementById('set-crop-scientific-name-to-logs-section').value = "";
        document.getElementById('set-crop-category-to-logs-section').value = "";
    }
}

function setFieldDetails(fieldCode) {
    const selectedField = fieldData.find(field => field.fieldCode === fieldCode);
    if (selectedField) {
        document.getElementById('set-field-name-to-logs-section').value = selectedField.fieldName;
        document.getElementById('set-field-location-to-logs-section').value = selectedField.fieldLocation;
        document.getElementById('set-field-extent-size-to-logs-section').value = selectedField.extentSize;
    } else {
        document.getElementById('set-field-name-for-log').value = "";
        document.getElementById('set-field-location-for-log').value = "";
        document.getElementById('set-field-extent-size-for-log').value = "";
    }
}*/

function getImageType(base64String) {
    if (!base64String) return "jpeg"; // Default type
    if (base64String.startsWith("iVBORw0K")) return "png";
    if (base64String.startsWith("/9j/")) return "jpeg";
    return "jpeg";
}

//load field codes for logs section
function loadFieldCodesToLogs(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/fields",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (data) {
            fieldData = data; // Assign API response to the global staffData variable

            fieldData.forEach((field) => {
                $("#logFieldCodeOption").append(new Option(field.fieldCode, field.fieldCode));
            });
            console.log("Successfully loaded Field codes to Logs section");
        },
        error: function (xhr, status, error) {
            console.error("Error loading Field codes: ", error);
            console.error("Response:", xhr.responseText);
        }
    });
}


//set Field details according to Field code
document.getElementById('logFieldCodeOption').addEventListener('change', function () {
    const selectedFieldCode = this.value; // Get selected staff ID
    //Find the selected staff data
    const selectedField = fieldData.find(field => field.fieldCode === selectedFieldCode);

    if (selectedField) {
        //Populate staff name and designation fields
        document.getElementById('set-field-name-to-logs-section').value = selectedField.fieldName;
        document.getElementById('set-field-location-to-logs-section').value = selectedField.fieldLocation;
        document.getElementById('set-field-extent-size-to-logs-section').value = selectedField.extentSize;
    } else {
        document.getElementById('set-field-name-for-log').value = "";
        document.getElementById('set-field-location-for-log').value = "";
        document.getElementById('set-field-extent-size-for-log').value = "";
    }
});


//load staff Ids for logs section
function loadStaffIdsToLogs(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/staff",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (data) {
            staffData = data; // Assign API response to the global staffData variable

            staffData.forEach((staff) => {
                $("#logStaffIdOption").append(new Option(staff.staffId, staff.staffId));
            });
            console.log("Successfully loaded staff Ids to Logs section");
        },
        error: function (xhr, status, error) {
            console.error("Error loading Staff Ids: ", error);
            console.error("Response:", xhr.responseText);
        }
    });
}


//set staff details according to staff ID
document.getElementById('logStaffIdOption').addEventListener('change', function () {
    const selectedStaffId = this.value; //get selected staff ID
    //Find the selected staff data
    const selectedStaff = staffData.find(staff => staff.staffId === selectedStaffId);

    if (selectedStaff) {
        //Populate staff name and designation fields
        document.getElementById('set-staff-name-to-logs-section').value = `${selectedStaff.firstName} ${selectedStaff.lastName}`;
        document.getElementById('set-staff-email-to-logs-section').value = selectedStaff.email;
        document.getElementById('set-designation-to-logs-section').value = selectedStaff.designation;
        document.getElementById('set-staff-role-to-logs-section').value = selectedStaff.role;
    } else {
        document.getElementById('set-staff-name-to-logs-section').value = "";
        document.getElementById('set-staff-email-to-logs-section').value = "";
        document.getElementById('set-designation-to-logs-section').value = "";
        document.getElementById('set-staff-role-to-logs-section').value = "";
    }
});


//load crop codes for logs section
function loadCropCodesToLogs(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/crops",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (data) {
            cropData = data;

            cropData.forEach((crop) => {
                $("#logCropCodeOption").append(new Option(crop.cropCode, crop.cropCode));
            });
            console.log("Successfully loaded crop codes to Logs section");
        },
        error: function (xhr, status, error) {
            console.error("Error loading crop codes: ", error);
            console.error("Response:", xhr.responseText);
        }
    });
}


//set crop details according to crop code
document.getElementById('logCropCodeOption').addEventListener('change', function () {
    const selectedCropCode = this.value; //get selected staff ID
    //Find the selected staff data
    const selectedCrop = cropData.find(crop => crop.cropCode === selectedCropCode);

    if (selectedCropCode) {
        //Populate staff name and designation fields
        document.getElementById('set-crop-common-name-to-logs-section').value = selectedCrop.cropCommonName;
        document.getElementById('set-crop-scientific-name-to-logs-section').value = selectedCrop.scientificName;
        document.getElementById('set-crop-category-to-logs-section').value = selectedCrop.category;
    } else {
        document.getElementById('set-crop-common-name-to-logs-section').value = "";
        document.getElementById('set-crop-scientific-name-to-logs-section').value = "";
        document.getElementById('set-crop-category-to-logs-section').value = "";
    }
});


//get formatted log code
function  fetchLogCode(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/logs/generate-next-log-code", // API URL
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (data) {
            //populate vehicle code field
            $("#log-code").val(data.logCode);
            console.log(data.logCode);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching Log code:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}


//set log date
function setLogDate() {
    //Get the current date
    const today = new Date();

    //Format the date as YYYY-MM-DD
    const formattedDate = today.toISOString().split('T')[0];

    const logDateInput = document.getElementById("log-date");
    if (logDateInput) {
        logDateInput.value = formattedDate;
    }
}


    // Handle form submission
$("#logs-save").click(function () {
    // Get the values from the form fields
    const logCode = $("#log-code").val()?.trim();
    const logDate = $("#log-date").val()?.trim();
    const logDetails = $("#log-details").val()?.trim();
    const observedImage = $("#logImage")[0].files[0];

    // Check for missing image
    if (!observedImage) {
        Swal.fire({
            icon: "error",
            title: "Missing Image",
            text: "Please select an image to save the log!",
        });
        return;
    }

    // Initialize lists for each log category
    let staffList = [], fieldList = [], cropList = [];

    // Check if Staff ID is provided
    const staffId = $("#logStaffIdOption").val()?.trim();
    if (staffId) {
        staffList.push({ staffId });
    }

    // Check if Field Code is provided
    const fieldCode = $("#logFieldCodeOption").val()?.trim();
    if (fieldCode) {
        fieldList.push({ fieldCode });
    }

    // Check if Crop Code is provided
    const cropCode = $("#logCropCodeOption").val()?.trim();
    if (cropCode) {
        cropList.push({ cropCode });
    }

    // Check if at least one of the lists is populated
    if (staffList.length === 0 && fieldList.length === 0 && cropList.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Missing Log Data",
            text: "Please select at least one category: Staff, Field, or Crop.",
        });
        return;
    }

    // Prepare FormData to send with the request
    const formData = new FormData();
    formData.append("logCode", logCode);
    formData.append("logDate", logDate);
    formData.append("logDetails", logDetails);
    formData.append("observedImage", observedImage);

    // Append non-empty lists to the form data
    if (staffList.length > 0) {
        formData.append("staffLogs", JSON.stringify(staffList));
    }
    if (fieldList.length > 0) {
        formData.append("fieldLogs", JSON.stringify(fieldList));
    }
    if (cropList.length > 0) {
        formData.append("cropLogs", JSON.stringify(cropList));
    }

    // Make AJAX request
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/logs",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        dataType: "text",
        success: function (response) {
            Swal.fire({
                icon: "success",
                title: "Log Saved",
                text: "Log saved successfully!",
            });
            console.log("Server response:", response);
            fetchLogData();
            logsClearFields();
            fetchLogCode();
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Error Saving log",
                text: `Error: ${xhr.responseText}`,
            });
            console.error("Error details:", xhr);
        }
    });
});


function logsClearFields(){
    // Clear text inputs
    $('#log-code').val("");
    $('#log-date').val("");
    $('#log-details').val("");

    // Reset file input
    $('#logImage').val(null);

    // Reset dropdowns or selects
    $('#logStaffIdOption').val("");
    $('#logFieldCodeOption').val("");
    $('#logCropCodeOption').val("");

    $('#set-crop-common-name-to-logs-section').val("");
    $('#set-crop-scientific-name-to-logs-section').val("");
    $('#set-crop-category-to-logs-section').val("");

    $('#set-staff-name-to-logs-section').val("");
    $('#set-staff-email-to-logs-section').val("");
    $('#set-staff-role-to-logs-section').val("");
    $('#set-designation-to-logs-section').val("");

    $('#set-field-name-to-logs-section').val("");
    $('#set-field-location-to-logs-section').val("");
    $('#set-field-extent-size-to-logs-section').val("");


    // Reset category selection (if applicable)
    $('#logCategory').val(""); // Reset category dropdown (if you have one)

    console.log("All fields have been cleared.");
}


$("#log-search").on("click", function () {
    // Get the log code entered by the user
    const logSearchCode = $("#logs-search-by-log-code").val().trim();

    if (!logSearchCode) {
        Swal.fire(
            "Input Required",
            "Please enter a valid Log code to search.",
            "warning"
        );
        return;
    }

    console.log("Searching for Log code:", logSearchCode);

    // Clear previous log details and related entities
    clearLogDetails();

    // Perform the AJAX GET request to search for the log details
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/logs/${logSearchCode}`, // API endpoint for log details
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add Bearer token to headers
        },
        success: function (response) {
            console.log("Log search result:", response);

            // Populate the form fields with the log details
            $('#log-code').val(response.logCode || "No Code");
            $('#log-date').val(response.logDate || "No Date");
            $('#log-details').val(response.logDetails || "No log details");

            // Display images in preview
            if (response.observedImage) {
                $('#previewImageLog')
                    .attr("src", `data:image/${getImageType(response.observedImage)};base64,${response.observedImage}`)
                    .removeClass('d-none');
            } else {
                $('#previewImageLog').addClass('d-none');
            }

            // Fetch related entities (e.g., staff, crop, field) for the log entry
            $.ajax({
                url: `http://localhost:8080/GreenShadow/api/v1/logs/${logSearchCode}/related-entities`, // Endpoint for related entities
                type: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`, // Add Bearer token to headers
                },
                success: function (relatedEntities) {
                    console.log("Related entities:", relatedEntities);

                    // Populate the related entity fields with the data returned from the second API
                    if (relatedEntities) {
                        // Set the staff details (if available)
                        if (relatedEntities.staff && relatedEntities.staff.length > 0) {
                            const firstStaff = relatedEntities.staff[0];
                            $("#logStaffIdOption").val(firstStaff.staffId || "");
                            $('#set-staff-name-to-logs-section').val(`${firstStaff.firstName || ""} ${firstStaff.lastName || ""}`);
                            $('#set-designation-to-logs-section').val(firstStaff.designation || "");
                            $('#set-staff-email-to-logs-section').val(firstStaff.email || "");
                            $('#set-staff-role-to-logs-section').val(firstStaff.role || "");
                        }

                        // Set the crop details (if available)
                        if (relatedEntities.crops && relatedEntities.crops.length > 0) {
                            const firstCrop = relatedEntities.crops[0];
                            $('#logCropCodeOption').val(firstCrop.cropCode || "");
                            $('#set-crop-common-name-to-logs-section').val(firstCrop.cropCommonName || " ");
                            $('#set-crop-scientific-name-to-logs-section').val(firstCrop.scientificName || " ");
                            $('#set-crop-category-to-logs-section').val(firstCrop.category || " ");
                        }

                        // Set the field details (if available)
                        if (relatedEntities.fields && relatedEntities.fields.length > 0) {
                            const firstField = relatedEntities.fields[0];
                            $('#logFieldCodeOption').val(firstField.fieldCode || " ");
                            $('#set-field-name-to-logs-section').val(firstField.fieldName || " ");
                            $('#set-field-location-to-logs-section').val(firstField.fieldLocation || " ");
                            $('#set-field-extent-size-to-logs-section').val(firstField.extentSize || " ");
                        }
                    } else {
                        console.warn("No related entities found.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching related entities:", xhr.responseText || error);
                    Swal.fire(
                        "Error",
                        "Failed to fetch related entities. Please try again.",
                        "error"
                    );
                }
            });

            $('#logs-section-details-form').modal('show');

            // Show success notification for log details
            Swal.fire(
                "Log Found",
                `Details for Log Code: ${logSearchCode} loaded successfully.`,
                "success"
            );
        },
        error: function (xhr, status, error) {
            const errorMessage = xhr.responseJSON?.message || "Failed to fetch log details. Please try again.";
            Swal.fire(
                "Error",
                errorMessage,
                "error"
            );
            console.error("Search error:", xhr.responseText || error);
        }
    });
});

// logs update
$("#logs-update").on("click", function (e) {
    e.preventDefault();

    const logCode = $('#log-code').val();

    if (!logCode) {
        Swal.fire("Error", "Log code is required to update log details.", "error");
        return;
    }

    // Gather form data
    const formData = new FormData();
    formData.append("logCode", logCode);
    formData.append("logDate", $('#log-date').val() || ""); // Default to empty string
    formData.append("logDetails", $('#log-details').val() || ""); // Default to empty string

    // Handle the image file input
    const logImageInput = $('#logImage')[0];
    const logImage = logImageInput?.files[0];
    if (logImage) {
        formData.append("observedImage", logImage);
    } else {
        // Add an empty Blob to ensure the 'observedImage' part is sent
        formData.append("observedImage", new Blob(), "");
    }

    // Prepare staff data (ensure it exists)
    const staffId = $('#logStaffIdOption').val();
    if (staffId) {
        const staff = [{ staffId }];
        formData.append("staffLogs", JSON.stringify(staff));
    }

    // Prepare field data (ensure it exists)
    const fieldCode = $('#logFieldCodeOption').val();
    if (fieldCode) {
        const field = [{ fieldCode }];
        formData.append("fieldLogs", JSON.stringify(field));
    }

    // Prepare crop data (ensure it exists)
    const cropCode = $('#logCropCodeOption').val(); // Correct key for crop code
    if (cropCode) {
        const crop = [{ cropCode }];
        formData.append("cropLogs", JSON.stringify(crop));
    }

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    // AJAX request with multipart/form-data
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/logs/${logCode}`,
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "Authorization": `Bearer ${authToken}`,
        },
        success: function (response) {
            Swal.fire("Success", "Log updated successfully!", "success").then(() => {
                $('#logs-section-details-form').modal('hide');
            });
            fetchLogData();
            clearLogDetails();
            fetchLogCode();
        },
        error: function (xhr) {
            console.error("Update error:", xhr);
            const errorMessage = xhr.responseJSON?.message || "Failed to update log details. Please try again.";
            Swal.fire("Error", errorMessage, "error");
        },
    });
});


// Function to clear log details and related entities
function clearLogDetails() {
    // Clear log details
    $('#log-code').val("");
    $('#log-date').val("");
    $('#log-details').val("");

    // Clear image preview
    $('#previewImageLog').attr("src", "").addClass('d-none');

    // Clear staff details
    $("#logStaffIdOption").val("");
    $('#set-staff-name-to-logs-section').val("");
    $('#set-designation-to-logs-section').val("");
    $('#set-staff-email-to-logs-section').val("");
    $('#set-staff-role-to-logs-section').val("");

    // Clear crop details
    $('#logCropCodeOption').val("");
    $('#set-crop-common-name-to-logs-section').val("");
    $('#set-crop-scientific-name-to-logs-section').val("");
    $('#set-crop-category-to-logs-section').val("");

    // Clear field details
    $('#logFieldCodeOption').val("");
    $('#set-field-name-to-logs-section').val("");
    $('#set-field-location-to-logs-section').val("");
    $('#set-field-extent-size-to-logs-section').val("");
}

























