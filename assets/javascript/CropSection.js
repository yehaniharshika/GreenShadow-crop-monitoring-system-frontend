const authToken = localStorage.getItem("authToken");
let fieldData=[];
window.addEventListener('load', () => {
    fetchCropCode();
    fetchCropData();
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

function fetchCropData() {
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/crops",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (response) {
            console.log("Crop data fetched successfully.");
            loadCropTable(response);
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Failed to Load Data",
                text: `Error: ${xhr.responseText || error}`,
            });
            console.error("Failed to fetch Crop data:", xhr.responseText || error);
        }
    });
}

//Load cro data to table
function loadCropTable(data) {
    const cropTableBody = $("#crop-tbl-tbody");
    cropTableBody.empty(); // Clear existing rows

    data.forEach(crop => {
        // Construct the image tag or display a placeholder
        const cropImage = crop.cropImage
            ? `<img src="data:image/${getImageType(crop.cropImage)};base64,${crop.cropImage}" alt="Crop Image" class="centered-image" style="max-width: 100px; height: auto;">`
            : "No Image";

        // Append a new row to the table
        const row = `
            <tr>
                <td class="crop-code-value">${crop.cropCode}</td>
                <td class="crop-common-name-value">${crop.cropCommonName}</td>
                <td class="crop-scientific-name-value">${crop.scientificName}</td>
                <td class="crop-image-value">${cropImage}</td>
                <td class="crop-category-value">${crop.category}</td>
                <td class="crop-season-value">${crop.cropSeason}</td>
                <td class="crop-field-code-value">${crop.fieldCode}</td>
            </tr>`;
        cropTableBody.append(row);
    });
}


//Handle row click to populate modal
$("#crop-tbl-tbody").on("click", "tr", function () {
    const cropCode = $(this).find(".crop-code-value").text();
    const cropCommonName = $(this).find(".crop-common-name-value").text();
    const cropScientificName = $(this).find(".crop-scientific-name-value").text();
    const cropCategory = $(this).find(".crop-category-value").text();
    const cropSeason = $(this).find(".crop-season-value").text();
    const cropImage = $(this).find(".crop-image-value img").attr("src") || "No Image";
    const cropFieldCode = $(this).find(".crop-field-code-value").text();

    //populate modal inputs
    $("#crop-code").val(cropCode);
    $("#crop-common-name").val(cropCommonName);
    $("#crop-scientific-name").val(cropScientificName);
    $("#category").val(cropCategory);
    $("#season").val(cropSeason);

    //display the image in the modal
    if (cropImage !== "No Image") {
        $("#previewImageCrop").attr("src", cropImage).removeClass("d-none");
    } else {
        $("#previewImageCrop").addClass("d-none");
    }

    $("#cropFieldCodeOption").val(cropFieldCode);

    //show crop modal
    $("#crop-section-details-form").modal("show");
});


function getImageType(base64String) {
    if (!base64String) return "jpeg"; // Default type
    if (base64String.startsWith("iVBORw0K")) return "png";
    if (base64String.startsWith("/9j/")) return "jpeg";
    return "jpeg";
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

    if (!authToken) {
        Swal.fire({
            icon: "error",
            title: "Authorization Error",
            text: "Missing or invalid authentication token.",
        });
        return;
    }
    console.log("Auth token: ", authToken);

    //send AJAX POST request to POST
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
                text: "Crop Saved Successfully!",
            });
            console.log("Server response:", response);
            fetchCropCode();
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









