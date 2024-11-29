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
            ? `<img src="data:image/${getImageType(crop.cropImage)};base64,${crop.cropImage}" alt="Crop Image" class="centered-image" style="max-width: 120px; height: 100px;">`
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

//get formatted crop code
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

//crop save
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
            fetchCropData();
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

//crop delete
$("#crop-delete").on("click", function (e) {
    e.preventDefault();

    // Retrieve the staff ID from the input field
    const cropDeleteCode = $('#crop-code').val();

    if (!cropDeleteCode) {
        Swal.fire("Error", "Crop Code is required to delete crop details.", "error");
        return;
    }

    console.log("crop code to delete: ", cropDeleteCode);

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    // Send the DELETE request
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/crops/${cropDeleteCode}`,
        type: "DELETE",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add the token to the Authorization header
        },
        dataType: "text",
        success: function (response) {
            Swal.fire("Success", "Crop deleted successfully!", "success").then(() => {
                //Hide the modal after successful deletion
                $('#crop-section-details-form').modal('hide');
            });

            //Refresh staff data
            fetchCropData();
            fetchCropCode();
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.message || "Failed to delete crop details.Please try again.";
            Swal.fire("Error", errorMessage, "error");
        }
    });
});


//crop update
$("#crop-update").click(function () {
    const cropCode = $("#crop-code").val().trim();
    const cropCommonName = $("#crop-common-name").val().trim();
    const cropScientificName = $("#crop-scientific-name").val().trim();
    const cropCategory = $("#category").val().trim();
    const cropSeason = $("#season").val().trim();
    const cropImage = $("#cropImage")[0].files[0];
    const fieldCode = $("#cropFieldCodeOption").val();


    if (!cropCode){
        Swal.fire("Error", "Crop code is required to update crop details.", "error");
        return;
    }

    if (!cropCommonName || !cropScientificName || !cropCategory || !cropSeason || !fieldCode) {
        Swal.fire({
            icon: "error",
            title: "Missing Fields",
            text: "Please fill in all the required fields!",
        });
        return;
    }
    console.log("Auth Token:", authToken);
    // Prepare FormData
    const formData = new FormData();
    formData.append("cropCode", cropCode); // Add the crop code (ID)
    formData.append("cropCommonName", cropCommonName);
    formData.append("scientificName", cropScientificName);
    formData.append("category", cropCategory);
    formData.append("cropSeason", cropSeason);
    if (cropImage) {
        formData.append("cropImage", cropImage); // Include only if a new image is provided
    }
    formData.append("fieldCode", fieldCode);

    console.log("Form Data prepared for update:", formData);

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
        url: `http://localhost:8080/GreenShadow/api/v1/crops/${cropCode}`, // Endpoint with crop ID
        type: "PUT",
        data: formData,
        processData: false, // Do not process FormData
        contentType: false, // Allow FormData to set content type
        headers: {
            "Authorization": `Bearer ${authToken}`, // Include the token in the headers
        },
        success: function (response) {
            Swal.fire({
                icon: "success",
                title: "Crop Updated",
                text: "Crop details updated successfully!",
            });
            console.log("Update response:", response);

            // Refresh crop data and codes
            fetchCropData();
            fetchCropCode();

            // Optionally hide the modal after updating
            $('#crop-section-details-form').modal('hide');
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.message || "Failed to update crop details. Please try again.";
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: errorMessage,
            });
            console.error("Error updating crop:", xhr);
        },
    });
});


//crop search
$("#crop-search").on("click", function () {
    // Get the field code entered by the user
    const cropSearchCode = $("#crop-search-by-crop-code").val().trim();

    if (!cropSearchCode) {
        Swal.fire(
            "Input Required",
            "Please enter a valid crop code to search.",
            "warning"
        );
        return;
    }

    console.log("Searching for crop code:", cropSearchCode);

    //Perform the ajax GET request to search for the field
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/crops/${cropSearchCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add Bearer token to headers
        },
        success: function (response) {
            console.log("Search result:", response);

            //populate the form fields with the response data
            $('#crop-code').val(response.cropCode);
            $('#crop-common-name').val(response.cropCommonName);
            $('#crop-scientific-name').val(response.scientificName);
            $('#category').val(response.category);
            $('#season').val(response.cropSeason);

            //Display images in preview
            if (response.cropImage) {
                $('#previewImageCrop')
                    .attr("src", `data:image/${getImageType(response.cropImage)};base64,${response.cropImage}`)
                    .removeClass('d-none');
            } else {
                $('#previewImageCrop').addClass('d-none');
            }

            $('#cropFieldCodeOption').val(response.fieldCode);
            const selectedField = fieldData.find(field => field.fieldCode === response.fieldCode);

            if (selectedField) {
                //populate the field details
                $('#set-crop-field-name').val(selectedField.fieldName);
                $('#set-crop-field-location').val(selectedField.fieldLocation);
                $('#set-crop-field-extent-size').val(selectedField.extentSize);
            } else {
                //clear the field details if not found
                $('#set-crop-field-name').val("");
                $('#set-crop-field-location').val("");
                $('#set-crop-field-extent-size').val("");
            }

            $('#crop-section-details-form').modal('show');

            //show success notification
            Swal.fire(
                "Crop Found",
                `Details for Crop Code: ${cropSearchCode} loaded successfully.`,
                "success"
            );
        },
        error: function (xhr, status, error) {
            const errorMessage = xhr.responseJSON?.message || "Failed to fetch crop details. Please try again.";
            Swal.fire(
                "Error",
                errorMessage,
                "error"
            );
            console.error("Search error:", xhr.responseText || error);
        }
    });
});










