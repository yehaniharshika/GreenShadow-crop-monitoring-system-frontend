const authToken = localStorage.getItem("authToken");
let fieldData=[];
window.addEventListener('load', () => {
    fetchCropCode();
    //fetchCropData();
    loadFieldCodes();
});

function loadFieldCodes(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/fields", // API URL for staff data
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (data) {
            fieldData = data; // Assign API response to the global staffData variable
            // Populate the select element with staff IDs
            fieldData.forEach((field) => {
                $("#cropFieldCodeOption").append(new Option(field.fieldCode, field.fieldCode));
            });
            console.log("Successfully loaded Field codes");
        },
        error: function (xhr, status, error) {
            console.error("Error loading Field codes: ", error);
            console.error("Response:", xhr.responseText);
        }
    });
}
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



