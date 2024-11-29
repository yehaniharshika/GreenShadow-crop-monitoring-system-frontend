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

document.getElementById('cropFieldCodeOption').addEventListener('change', function () {
    const selectedFieldCode = this.value; // Get selected staff ID
    // Find the selected staff data
    const selectedField = fieldData.find(field => field.fieldCode === selectedFieldCode);

    if (selectedField) {
        // Populate staff name and designation fields
        document.getElementById('set-crop-field-name').value = selectedField.fieldName;
        document.getElementById('set-crop-field-location').value = selectedField.fieldLocation;
        document.getElementById('set-crop-field-extent-size').value = selectedField.extentSize;
    } else {
        document.getElementById('set-crop-field-name').value = "";
        document.getElementById('set-crop-field-location').value = "";
        document.getElementById('set-crop-field-extent-size').value = "";
    }
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
$("#crop-save").click(function () {
    const cropCode = $("#crop-code").val().trim();
    const cropCommonName = $("#crop-common-name").val().trim();
    const cropScientificName = $("#crop-scientific-name").val().trim();
    const cropCategory = $("#category").val().trim();
    const cropSeason = $("#season").val().trim();
    const cropImage = $("#cropImage")[0].files[0];
    const fieldCode = $("#cropFieldCodeOption").val();

    // Validate fields
    if (!cropCode || !cropCommonName || !cropScientificName || !cropImage || !cropCategory || !cropSeason || !fieldCode) {
        Swal.fire({
            icon: "error",
            title: "Missing Fields",
            text: "Please fill in all the required fields!",
        });
        return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("cropCode", cropCode);
    formData.append("cropCommonName", cropCommonName);
    formData.append("scientificName", cropScientificName);
    formData.append("category", cropCategory);
    formData.append("cropSeason", cropSeason);
    formData.append("cropImage", cropImage);
    formData.append("fieldCode", fieldCode);

    console.log("Form Data prepared.");

    // Ensure valid token
    if (!authToken) {
        Swal.fire({
            icon: "error",
            title: "Authorization Error",
            text: "Missing or invalid authentication token.",
        });
        return;
    }
    console.log("Auth token: ", authToken);

    // Send AJAX POST request
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/crops",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "Authorization": `Bearer ${authToken}`,
        },
        dataType: "text", // Expect plain text response from the server
        success: function (response) {
            Swal.fire({
                icon: "success",
                title: "Crop Saved",
                text: response, // Use the server response
            });
            console.log("Server response:", response);
            fetchCropCode(); // Refresh crop code after successful save
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Error Saving Crop",
                text: `Error: ${xhr.responseText}`,
            });
            console.error("Error details:", xhr);
        },
    });
});









