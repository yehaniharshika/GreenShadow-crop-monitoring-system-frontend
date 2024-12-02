const authToken = localStorage.getItem("authToken");
let staffData=[];
let cropData=[];
let fieldData=[];

window.addEventListener('load', () => {
    fetchLogCode();
    setLogDate();
    //loadStaffIdsToLogs();
    //loadCropCodesToLogs();
    loadFieldCodesToLogs();
});


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

document.getElementById('logFieldCodeOption').addEventListener('change', function () {
    const selectedFieldCode = this.value; // Get selected staff ID
    //Find the selected staff data
    const selectedField = fieldData.find(field => field.fieldCode === selectedFieldCode);

    if (selectedField) {
        //Populate staff name and designation fields
        document.getElementById('set-field-name-for-log').value = selectedField.fieldName;
        document.getElementById('set-field-location-for-log').value = selectedField.fieldLocation;
        document.getElementById('set-field-extent-size-for-log').value = selectedField.extentSize;
    } else {
        document.getElementById('set-field-name-for-log').value = "";
        document.getElementById('set-field-location-for-log').value = "";
        document.getElementById('set-field-extent-size-for-log').value = "";
    }
});

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

function setLogDate() {
    // Get the current date
    const today = new Date();

    // Format the date as YYYY-MM-DD
    const formattedDate = today.toISOString().split('T')[0];

    const logDateInput = document.getElementById("log-date");
    if (logDateInput) {
        logDateInput.value = formattedDate;
    }
}

