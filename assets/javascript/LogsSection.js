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



/*$("#logs-save").click(function () {
    // Collect form values
    const logCode = $("#log-code").val()?.trim() || "";
    const logDate = $("#log-date").val()?.trim() || "";
    const logDetails = $("#log-details").val()?.trim() || "";
    const observedImage = $("#observed-image")[0]?.files[0] || null;
    const logCategory = $("#logCategory").val(); // Dropdown for log category

    // Validate required fields
    if (!logCode || !logDate || !logDetails || !observedImage || !logCategory) {
        Swal.fire({
            icon: "error",
            title: "Missing Fields",
            text: "Please fill in all the required fields!",
        });
        return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("logCode", logCode);
    formData.append("logDate", logDate);
    formData.append("logDetails", logDetails);
    formData.append("observedImage", observedImage);

    // Set the log category data
    if (logCategory === "staff") {
        const staffLogs = $("#logStaffIdOption").val()?.trim() || "";
        formData.append("staffLogs", JSON.stringify([{ staffId: staffLogs }]));
    } else if (logCategory === "field") {
        const fieldLogs = $("#logFieldCodeOption").val()?.trim() || "";
        formData.append("fieldLogs", JSON.stringify([{ fieldCode: fieldLogs }]));
    } else if (logCategory === "crop") {
        const cropLogs = $("#logCropCodeOption").val()?.trim() || "";
        formData.append("cropLogs", JSON.stringify([{ cropCode: cropLogs }]));
    }

    // Authorization token (update this with your actual token)
    const authToken = "<token>";

    // AJAX POST request
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/logs",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "Authorization": `Bearer ${authToken}`,
        },
        success: function (response) {
            Swal.fire({
                icon: "success",
                title: "Log Saved",
                text: "The log was saved successfully!",
            });

            // Optionally reset the form
            $("#logs-form")[0].reset();
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Error Saving Log",
                text: `Error: ${xhr.responseText}`,
            });
        },
    });
});*/

    // Handle form submission
$("#logs-save").click(function () {
    const logCode = $("#log-code").val().trim();
    const logDate = $("#log-date").val().trim();
    const logDetails = $("#log-details").val().trim();
    const observedImage = $("#logImage")[0].files[0];

    if (!observedImage) {
        Swal.fire({
            icon: "error",
            title: "Missing Image",
            text: "Please select an image to save the log!",
        });
        return;
    }

    let staffList = [], fieldList = [], cropList = [];
    const logCategory = $("#logCategory").val();
    if (logCategory === "staff") {
        const staffId = $("#logStaffIdOption").val().trim();
        if (!staffId) {
            Swal.fire({
                icon: "error",
                title: "Missing Staff ID",
                text: "Please select a Staff ID!",
            });
            return;
        }
        staffList.push({ staffId });
    } else if (logCategory === "field") {
        const fieldCode = $("#logFieldCodeOption").val().trim();
        if (!fieldCode) {
            Swal.fire({
                icon: "error",
                title: "Missing Field Code",
                text: "Please select a Field Code!",
            });
            return;
        }
        fieldList.push({ fieldCode });
    } else if (logCategory === "crop") {
        const cropCode = $("#logCropCodeOption").val().trim();
        if (!cropCode) {
            Swal.fire({
                icon: "error",
                title: "Missing Crop Code",
                text: "Please select a Crop Code!",
            });
            return;
        }
        cropList.push({ cropCode });
    }

    const formData = new FormData();
    formData.append("logCode", logCode);
    formData.append("logDate", logDate);
    formData.append("logDetails", logDetails);
    formData.append("observedImage", observedImage);

    if (staffList.length > 0) {
        formData.append("staffLogs", JSON.stringify(staffList));
    }
    if (fieldList.length > 0) {
        formData.append("fieldLogs", JSON.stringify(fieldList));
    }
    if (cropList.length > 0) {
        formData.append("cropLogs", JSON.stringify(cropList));
    }

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
    // Get the field code entered by the user
    const logSearchCode = $("#logs-search-by-log-code").val().trim();

    if (!logSearchCode) {
        Swal.fire(
            "Input Required",
            "Please enter a valid Field code to search.",
            "warning"
        );
        return;
    }

    console.log("Searching for log code:", logSearchCode);

    // Perform the AJAX GET request to search for the field
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/logs/${logSearchCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add Bearer token to headers
        },
        success: function (response) {
            console.log("Search result:", response);

            // Populate the form fields with the response data
            $('#log-code').val(response.logCode);
            $('#log-date').val(response.logDate);
            $('#log-details').val(response.logDetails);

            // Display images in preview
            if (response.observedImage) {
                $('#previewImageLog')
                    .attr("src", `data:image/${getImageType(response.observedImage)};base64,${response.observedImage}`)
                    .removeClass('d-none');
            } else {
                $('#previewImageLog').addClass('d-none');
            }

            // Handle staff details
            if (response.staff && response.staff.length > 0) {
                console.log("Staff array:", response.staff); // Log the staff array

                const staff = response.staff[0]; // Get the first staff object
                console.log("First staff object:", staff); // Log the first staff object

                const staffId = staff?.staffId; // Access staffId from the first object
                if (staffId) {
                    $("#logStaffIdOption").val(staffId); // Set the staff ID in the input field
                    console.log("Set staffId to fieldStaffIdOption:", staffId);
                } else {
                    console.error("No valid staffId found in the staff array.");
                }
            } else {
                console.error("Staff array is empty or undefined.");
                console.log("Response staff:", response.staff); // Log the staff field to understand its content
                $("#logStaffIdOption").val(""); // Clear the staff field if no data
            }

            //$('#field-section-details-form').modal('show');

            // Show success notification
            Swal.fire(
                "Field Found",
                `Details for Field Code: ${logSearchCode} loaded successfully.`,
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




















