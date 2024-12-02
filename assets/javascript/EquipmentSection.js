const authToken = localStorage.getItem("authToken");
let staffData=[];
let fieldData=[];

window.addEventListener('load', () => {
    fetchEquipmentId();
    fetchEquipmentData();
    loadStaffIds();
    loadFieldCodes();
});


//get formatted equipment ID
function  fetchEquipmentId(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/equipments/generate-next-equipment-id", // API URL
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (data) {
            //populate vehicle code field
            $("#equipment-id").val(data.equipmentId);
            console.log(data.equipmentId);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching Equipment ID:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}


//fetch all equipment details
function fetchEquipmentData(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/equipments",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (response){
            loadEquipmentTable(response);
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch Equipment data:", xhr.responseText || error);
        }
    });
}


//load equipment table
function loadEquipmentTable(data){
    const equipmentTableBody = $("#equipment-tbl-tbody");
    equipmentTableBody.empty();

    data.forEach(equipment =>{
        const row = `
            <tr>
                <td class="equipment-id-value">${equipment.equipmentId}</td>
                <td class="equipment-name-value">${equipment.equipmentName}</td>
                <td class="equipment-type-value">${equipment.type}</td>
                <td class="equipment-status-value">${equipment.status}</td>
                <td class="equipment-staff-id-value">${equipment.staffId}</td>
                <td class="equipment-field-code-value">${equipment.fieldCode}</td>
            </tr>`;
        equipmentTableBody.append(row)
    })
}


//table listener
$("#equipment-tbl-tbody").on('click', 'tr', function () {
    let equipmentId = $(this).find(".equipment-id-value").text();
    let equipmentName = $(this).find(".equipment-name-value").text();
    let type = $(this).find(".equipment-type-value").text();
    let status = $(this).find(".equipment-status-value").text();
    let staffId = $(this).find(".equipment-staff-id-value").text();
    let fieldCode = $(this).find(".equipment-field-code-value").text();

    // Populate input fields with equipment details
    $('#equipment-id').val(equipmentId);
    $('#equipment-name').val(equipmentName);
    $('#equipment-type').val(type);
    $('#equipment-status').val(status);
    $('#equipmentStaffIdOption').val(staffId);
    $('#equipmentFieldCodeOption').val(fieldCode);

    //Find staff data corresponding to the staffId
    const selectedStaffDataWithTable = staffData.find(staff => staff.staffId === staffId);

    if (selectedStaffDataWithTable) {
        //populate staff details
        document.getElementById('set-equipment-section-staff-name').value =
            `${selectedStaffDataWithTable.firstName} ${selectedStaffDataWithTable.lastName}`;
        document.getElementById('set-equipment-section-staff-designation').value = selectedStaffDataWithTable.designation;
        document.getElementById('set-equipment-section-contact-number').value = selectedStaffDataWithTable.contactNumber;
    } else {
        //clear staff details if no match is found
        document.getElementById('set-equipment-section-staff-name').value = "";
        document.getElementById('set-equipment-section-staff-designation').value = "";
        document.getElementById('set-equipment-section-contact-number').value = "";
    }

    //Find field data corresponding to the staffId
    const  selectedFieldDataWithTable = fieldData.find(field => field.fieldCode === fieldCode);
    if (selectedFieldDataWithTable){
        //populate the field details
        document.getElementById('set-equipment-section-field-name').value = selectedFieldDataWithTable.fieldName;
        document.getElementById('set-equipment-section-field-location').value = selectedFieldDataWithTable.fieldLocation;
        document.getElementById('set-equipment-section-field-extent-size').value = selectedFieldDataWithTable.extentSize;
    }else {
        document.getElementById('set-equipment-section-field-name').value = "";
        document.getElementById('set-equipment-section-field-location').value = "";
        document.getElementById('set-equipment-section-field-extent-size').value = "";
    }

    // Show the modal
    $('#equipment-section-details-form').modal('show');
});


//load staff ID
function loadStaffIds(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/staff",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (data) {
            staffData = data;

            //Populate the select element with staff IDs
            staffData.forEach((staff) => {
                $("#equipmentStaffIdOption").append(new Option(staff.staffId, staff.staffId));
            });
            console.log("Successfully loaded staff Ids to Equipment section");
        },
        error: function (xhr, status, error) {
            console.error("Error loading Staff Ids: ", error);
            console.error("Response:", xhr.responseText);
        }
    });
}


document.getElementById('equipmentStaffIdOption').addEventListener('change', function () {
    const selectedStaffId = this.value; //get selected staff ID
    //Find the selected staff data
    const selectedStaff = staffData.find(staff => staff.staffId === selectedStaffId);

    if (selectedStaff) {
        //Populate staff name and designation fields
        document.getElementById('set-equipment-section-staff-name').value = `${selectedStaff.firstName} ${selectedStaff.lastName}`;
        document.getElementById('set-equipment-section-staff-designation').value = selectedStaff.designation;
        document.getElementById('set-equipment-section-contact-number').value = selectedStaff.contactNumber;
    } else {
        document.getElementById('set-equipment-section-staff-name').value = "";
        document.getElementById('set-equipment-section-staff-designation').value = "";
        document.getElementById('set-equipment-section-contact-number').value = "";
    }
});


//load field codes
function loadFieldCodes(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/fields",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (data) {
            fieldData = data; // Assign API response to the global staffData variable

            //Populate the select element with staff IDs
            fieldData.forEach((field) => {
                $("#equipmentFieldCodeOption").append(new Option(field.fieldCode, field.fieldCode));
            });
            console.log("Successfully loaded Field codes to Equipment section");
        },
        error: function (xhr, status, error) {
            console.error("Error loading Field codes: ", error);
            console.error("Response:", xhr.responseText);
        }
    });
}

document.getElementById('equipmentFieldCodeOption').addEventListener('change', function () {
    const selectedFieldCode = this.value; // Get selected staff ID
    // Find the selected staff data
    const selectedField = fieldData.find(field => field.fieldCode === selectedFieldCode);

    if (selectedField) {
        // Populate staff name and designation fields
        document.getElementById('set-equipment-section-field-name').value = selectedField.fieldName;
        document.getElementById('set-equipment-section-field-location').value = selectedField.fieldLocation;
        document.getElementById('set-equipment-section-field-extent-size').value = selectedField.extentSize;
    } else {
        document.getElementById('set-equipment-section-field-name').value = "";
        document.getElementById('set-equipment-section-field-location').value = "";
        document.getElementById('set-equipment-section-field-extent-size').value = "";
    }
});


//equipment save
$("#equipment-save").on("click", function (e) {
    e.preventDefault();

    //get Vehicle details from the form
    const equipmentData = {
        equipmentId: $('#equipment-id').val(),
        equipmentName: $('#equipment-name').val(),
        type: $('#equipment-type').val(),
        status: $('#equipment-status').val(),
        staffId: $('#equipmentStaffIdOption').val(),
        fieldCode: $('#equipmentFieldCodeOption').val(),
    };

    console.log("Equipment Data:", equipmentData);

    console.log("auth token: ",authToken);

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/equipments`,
        type: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`,
        },

        data: JSON.stringify(equipmentData),
        success: function (response) {
            Swal.fire(
                "Success",
                "Equipment saved successfully!",
                "success").then(() => {
            });
            fetchEquipmentData();
            equipmentClearFields();
            fetchEquipmentId();
        },
        error: function (xhr) {
            Swal.fire(
                "Error",
                xhr.responseJSON.message || "Failed to save Equipment. Please try again.",
                "error"
            );
        },
    });
});


//equipment delete
$("#equipment-delete").on("click", function (e) {
    e.preventDefault();

    const equipmentDeleteId = $('#equipment-id').val();

    if (!equipmentDeleteId) {
        Swal.fire("Error", "Equipment ID is required to delete equipment details.", "error");
        return;
    }

    if (typeof authToken === "undefined" || !authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/equipments/${equipmentDeleteId}`,
        type: "DELETE",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (response) {
            console.log("Delete Response:", response);
            const successMessage = response?.message || "Equipment deleted successfully!";

            Swal.fire("Success", successMessage, "success").then(() => {
                $('#equipment-section-details-form').modal('hide');
                fetchEquipmentData();
                equipmentClearFields();
                fetchEquipmentId();
            });
        },
        error: function (xhr) {
            console.error("Delete request failed:", xhr);

            let errorMessage = "Failed to delete equipment details. Please try again.";
            Swal.fire(
                "Error",
                errorMessage,
                "error"
            );
        }
    });
});


//equipment update
$("#equipment-update").on("click", function (e) {
    e.preventDefault();

    const equipmentId = $('#equipment-id').val();

    if (!equipmentId){
        Swal.fire("Error", "Equipment ID is required to update equipment details.", "error");
        return;
    }

    //Get equipment details from the form
    const equipmentData = {
        equipmentId: equipmentId,
        equipmentName: $('#equipment-name').val(),
        type: $('#equipment-type').val(),
        status: $('#equipment-status').val(),
        staffId: $('#equipmentStaffIdOption').val(),
        fieldCode: $('#equipmentFieldCodeOption').val()
    };

    console.log("equipment Data: ", equipmentData);
    console.log("Auth Token: ",authToken)

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/equipments/${equipmentId}`,
        type: "PUT",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add the token to the Authorization header
        },
        data: JSON.stringify(equipmentData),

        success: function (response) {
            Swal.fire(
                "Success",
                "Equipment updated successfully!",
                "success").then(() => {
                $('#equipment-section-details-form').modal('hide');
            });
            fetchEquipmentData();
            equipmentClearFields();
            fetchEquipmentId();
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.message || "Failed to update Equipment details. Please try again.";
            Swal.fire("Error", errorMessage, "error");
        },
    });
});


//equipment search
$("#equipment-search").on("click", function (e) {
    let equipmentSearchCode = $("#equipment-search-by-equipment-id").val();

    if (!equipmentSearchCode) {
        Swal.fire(
            'Input Required',
            'Please enter a correct equipment Id to search.',
            'warning'
        );
        return;
    }

    console.log("Searching for equipment ID: ", equipmentSearchCode);

    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/equipments/${equipmentSearchCode}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add the token to the Authorization header
        },
        success: function (response) {
            // Check if the response contains valid vehicle data
            if (!response || !response.equipmentId) {
                Swal.fire(
                    "Equipment Not Found!",
                    `No Equipment found with code ${equipmentSearchCode}. Please check and try again.`,
                    "error"
                );
                return;
            }

            const equipment = response;

            $('#equipment-code').val(equipment.equipmentId);
            $('#equipment-name').val(equipment.equipmentName);
            $('#equipment-type').val(equipment.type);
            $('#equipment-status').val(equipment.status);
            $('#equipmentStaffIdOption').val(equipment.staffId);
            $('#equipmentFieldCodeOption').val(equipment.fieldCode);


            const selectedStaffData = staffData.find(staff => staff.staffId === equipment.staffId);

            if (selectedStaffData) {
                //populate the staff details
                document.getElementById('set-equipment-section-staff-name').value = `${selectedStaffData.firstName} ${selectedStaffData.lastName}`;
                document.getElementById('set-equipment-section-staff-designation').value = selectedStaffData.designation;
                document.getElementById('set-equipment-section-contact-number').value = selectedStaffData.contactNumber;
            } else {
                document.getElementById('set-equipment-section-staff-name').value = "";
                document.getElementById('set-equipment-section-staff-designation').value = "";
                document.getElementById('set-equipment-section-contact-number').value = "";
            }

            const selectedFieldData = fieldData.find(field => field.fieldCode === equipment.fieldCode);

            if (selectedFieldData){
                //populate the field details
                document.getElementById('set-equipment-section-field-name').value = selectedFieldData.fieldName;
                document.getElementById('set-equipment-section-field-location').value = selectedFieldData.fieldLocation;
                document.getElementById('set-equipment-section-field-extent-size').value = selectedFieldData.extentSize;
            }else {
                document.getElementById('set-equipment-section-field-name').value = "";
                document.getElementById('set-equipment-section-field-location').value = "";
                document.getElementById('set-equipment-section-field-extent-size').value = "";
            }

            $('#equipment-section-details-form').modal('show');

            Swal.fire(
                'Equipment Found!',
                'Equipment details retrieved successfully.',
                'success'
            );
        },
        error: function (xhr) {
            if (xhr.status === 404) {
                Swal.fire(
                    "Equipment Not Found!",
                    `No Equipment found with code ${equipmentSearchCode}. Please check and try again.`,
                    "error"
                );
            } else {
                Swal.fire(
                    "Error",
                    xhr.responseJSON?.message || "Failed to search Equipment. Please try again.",
                    "error"
                );
            }
        },
    });
});

//clear Equipment fields
function equipmentClearFields(){
    $('#equipment-id').val("");
    $('#equipment-name').val("");
    $('#equipment-type').val("");
    $('#equipment-status').val("");
    $('#equipmentStaffIdOption').val("");
    $('#equipmentFieldCodeOption').val("");

    //clear additional fields related to staff
    $('#set-equipment-section-staff-name').val("");
    $('#set-equipment-section-staff-designation').val("");
    $('#set-equipment-section-contact-number').val("");

    //clear additional fields related to field
    $('#set-equipment-section-field-name').val("");
    $('#set-equipment-section-field-location').val("");
    $('#set-equipment-section-field-extent-size').val("");

    console.log("All fields have been cleared.");
}