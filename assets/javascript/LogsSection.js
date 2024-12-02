const authToken = localStorage.getItem("authToken");
let staffData=[];
let cropData=[];
let fieldData=[];

window.addEventListener('load', () => {
    fetchLogCode();
    setLogDate();
    loadStaffIdsToLogs();
    loadCropCodesToLogs();
    loadFieldCodesToLogs();
});


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


