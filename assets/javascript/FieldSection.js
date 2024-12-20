const authToken = localStorage.getItem("authToken");
let staffData = [];

window.addEventListener('load', () => {
    fetchFieldCode();
    loadStaffIds();
    loadFieldCards();
});


function initializeSlider() {
    //Initialize slider functionality for each field card
    document.querySelectorAll('.slider').forEach(slider => {
        const images = slider.querySelectorAll('.slider-image');
        let currentImageIndex = 0;

        //Function to show the image at the given index
        function showImage(index) {
            images.forEach(image => image.classList.add('d-none'));
            //Show the selected image
            images[index].classList.remove('d-none');
        }

        // Function to move to the next image automatically (alternating every 3000ms)
        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
        }

        // Set an interval to automatically move the slider every 3 seconds (3000ms)
        setInterval(nextImage, 2500);

        // Start with the first image
        showImage(currentImageIndex);

        // Ensure the buttons exist before adding event listeners
        const prevButton = slider.querySelector('.prev-button');
        const nextButton = slider.querySelector('.next-button');

        if (prevButton && nextButton) {
            // Event listener for next button
            nextButton.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                showImage(currentImageIndex);
            });

            // Event listener for previous button
            prevButton.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                showImage(currentImageIndex);
            });
        }
    });
}

function loadFieldCards() {
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/fields",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (fields) {
            const cardsContainer = $('#field-cards-container');
            cardsContainer.empty(); // Clear previous cards

            fields.forEach(field => {
                // Handle image rendering with Base64
                const fieldImage1 = field.fieldImage1
                    ? `data:image/jpeg;base64,${field.fieldImage1}`
                    : "";

                const fieldImage2 = field.fieldImage2
                    ? `data:image/jpeg;base64,${field.fieldImage2}`
                    : "";

                const card = `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div class="card field-card" data-id="${field.fieldCode}">
                            <div class="card-body">
                                <p class="card-text"><strong>Field Code: </strong> ${field.fieldCode}</p>
                                <p class="card-text"><strong>Field Name: </strong> ${field.fieldName}</p>
                                <p class="card-text"><strong>Location: </strong> ${field.fieldLocation}</p>
                                <p class="card-text"><strong>Extent Size: </strong> ${field.extentSize} Sq. m</p>
                                                                <p class="card-text"><strong>Staff ID: </strong> <span id="staff-id-${field.fieldCode}">Loading...</span></p>

                                <strong>Field Images: </strong>
                                <div class="slider-container">
                                    <div class="slider">
                                        ${fieldImage1
                    ? `<img src="${fieldImage1}" class="slider-image img-fluid" alt="Field Image 1" />`
                    : "<p>No Image</p>"}
                                        ${fieldImage2
                    ? `<img src="${fieldImage2}" class="slider-image img-fluid d-none" alt="Field Image 2" />`
                    : "<p>No Image</p>"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                cardsContainer.append(card);

                // Fetch staff details for the field
                $.ajax({
                    url: `http://localhost:8080/GreenShadow/api/v1/fields/${field.fieldCode}/staff`, // Staff details endpoint
                    type: "GET",
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                    },
                    success: function (staffResponse) {
                        const staffIdElement = $(`#staff-id-${field.fieldCode}`);

                        if (staffResponse && staffResponse.length > 0) {
                            // Assuming the first staff member is the one we want to display
                            const firstStaff = staffResponse[0];
                            staffIdElement.text(firstStaff.staffId || "No Staff ID");
                        } else {
                            staffIdElement.text("No Staff Assigned");
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Error fetching staff data:", xhr.responseText || error);
                        Swal.fire(
                            "Error",
                            "Failed to fetch staff details for this field.",
                            "error"
                        );
                    }
                });
            });

            //Initialize slider functionality after rendering cards
            initializeSlider();

            // Attach click event to cards for modal functionality
            $('.field-card').click(function () {
                const fieldCode = $(this).data('id');
                const selectedField = fields.find(field => field.fieldCode === fieldCode);

                if (selectedField) {
                    // Set modal fields
                    $('#field-code').val(selectedField.fieldCode);
                    $('#field-name').val(selectedField.fieldName);
                    $('#field-location').val(selectedField.fieldLocation);
                    $('#extent-size').val(selectedField.extentSize);

                    // Set modal images
                    if (selectedField.fieldImage1) {
                        $('#previewImage1')
                            .attr('src', `data:image/jpeg;base64,${selectedField.fieldImage1}`)
                            .removeClass('d-none');  // Show image 1
                    } else {
                        $('#previewImage1').addClass('d-none');  // Hide image 1
                    }

                    if (selectedField.fieldImage2) {
                        $('#previewImage2')
                            .attr('src', `data:image/jpeg;base64,${selectedField.fieldImage2}`)
                            .removeClass('d-none');  // Show image 2
                    } else {
                        $('#previewImage2').addClass('d-none');  // Hide image 2
                    }
                    $('#fieldStaffIdOption').val(selectedField.staffId);


                    // Open the modal
                    $('#field-section-details-form').modal('show');
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Field Not Found",
                        text: "The selected field could not be found!",
                    });
                }
            });
        },
        error: function (xhr, status, error) {
            console.error('Failed to load fields:', xhr.responseText || error);
            Swal.fire({
                icon: "error",
                title: "Error Loading Fields",
                text: `Unable to fetch fields. Error: ${xhr.responseText || error}`,
            });
        }
    });
}


//Save Field Function
$("#field-save").click(function () {
    const fieldCode = $("#field-code").val().trim();
    const fieldName = $("#field-name").val().trim();
    const fieldLocation = $("#field-location").val().trim();
    const extentSize = $("#extent-size").val().trim();
    const fieldImage1 = $("#fieldImage1")[0].files[0];
    const fieldImage2 = $("#fieldImage2")[0].files[0];
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

    const locationParts = fieldLocation.split(",");
    if (locationParts.length !== 2) {
        Swal.fire({
            icon: "error",
            title: "Invalid Location Format",
            text: "Please enter the location in the format: Latitude,Longitude",
        });
        return;
    }

    const latitude = locationParts[0].trim();
    const longitude = locationParts[1].trim();
    const formattedLocation = `Latitude: ${latitude}, Longitude: ${longitude}`;

    // Create staff list JSON object
    const staffList = [{ staffId }];

    // Create FormData object
    const formData = new FormData();
    formData.append("fieldCode", fieldCode);
    formData.append("fieldName", fieldName);
    formData.append("extentSize", extentSize);
    formData.append("fieldLocation", formattedLocation);
    formData.append("fieldImage1", fieldImage1);
    formData.append("fieldImage2", fieldImage2);
    formData.append("staff", JSON.stringify(staffList));

    console.log("Submitting the following data to the server:", {
        fieldCode,
        fieldName,
        extentSize,
        formattedLocation,
        staff: staffList,
    });

    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/fields",
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
            const staffId = response.staffId; // Assuming the backend response contains this
            $(`.field-card[data-id="${fieldCode}"] .card-text strong:contains('Staff ID')`)
                .next().text(staffId || "No Staff ID Assigned");
            loadFieldCards();
            clearFieldsDetails();
            fetchFieldCode();
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Error Saving Field",
                text: `Error: ${xhr.responseText || "Unknown error occurred"}`,
            });
            console.error("Error details:", xhr);
        }
    });
});


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


/*Field update*/
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

    const locationParts = $('#field-location').val().split(",");
    if (locationParts.length !== 2) {
        Swal.fire({
            icon: "error",
            title: "Invalid Location Format",
            text: "Please enter the location in the format: Latitude,Longitude",
        });
        return;
    }

    const latitude = locationParts[0].trim();
    const longitude = locationParts[1].trim();
    const formattedLocation = `Latitude: ${latitude}, Longitude: ${longitude}`;

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
    formData.append("fieldLocation", formattedLocation); // Use formattedLocation
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
            loadFieldCards();
            clearFieldsDetails();
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
            loadFieldCards();
            clearFieldsDetails();
            fetchFieldCode();
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.message || "Failed to delete Field details.Please try again.";
            Swal.fire("Error", errorMessage, "error");
        }
    });
});


function clearFieldsDetails() {
    $("#field-code").val("");
    $("#field-name").val("");
    $("#field-location").val("");
    $("#extent-size").val("");
    $("#fieldImage1").attr("src", ""); // Clear the src attribute of the image
    $("#fieldImage2").attr("src", ""); // Clear the src attribute of the image
    $("#fieldStaffIdOption").val("");
    $("#set-field-staff-name").val("");
    $("#set-field-staff-designation").val("");
}









