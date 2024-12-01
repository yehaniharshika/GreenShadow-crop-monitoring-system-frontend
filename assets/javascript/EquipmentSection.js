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
$("#equipment-tbl-tbody").on('click', 'tr', function() {
    let equipmentId = $(this).find(".equipment-id-value").text();
    let equipmentName = $(this).find(".equipment-name-value").text();
    let type = $(this).find(".equipment-type-value").text();
    let status = $(this).find(".equipment-status-value").text();
    let staffId = $(this).find(".equipment-staff-id-value").text();
    let fieldCode = $(this).find(".equipment-field-code-value").text();

        $('#equipment-id').val(equipmentId),
        $('#equipment-name').val(equipmentName),
        $('#equipment-type').val(type),
        $('#equipment-status').val(status),
        $('#equipmentStaffIdOption').val(staffId),
        $('#equipmentFieldCodeOption').val(fieldCode)

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