const authToken = localStorage.getItem("authToken");
let staffData=[];
window.addEventListener('load', () => {
    fetchVehicleCode();
    fetchVehicleData();
    loadStaffIds();
});

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
            // Populate the select element with staff IDs
            staffData.forEach((staff) => {
                $("#vehicleStaffIdOption").append(new Option(staff.staffId, staff.staffId));
            });
            console.log("Successfully loaded staff Ids to vehicle section");
        },
        error: function (xhr, status, error) {
            console.error("Error loading Staff Ids: ", error);
            console.error("Response:", xhr.responseText);
        }
    });
}

document.getElementById('vehicleStaffIdOption').addEventListener('change', function () {
    const selectedStaffId = this.value; //get selected staff ID
    //Find the selected staff data
    const selectedStaff = staffData.find(staff => staff.staffId === selectedStaffId);

    if (selectedStaff) {
        //Populate staff name and designation fields
        document.getElementById('set-vehicle-staff-name').value = `${selectedStaff.firstName} ${selectedStaff.lastName}`;
        document.getElementById('set-vehicle-designation').value = selectedStaff.designation;
        document.getElementById('set-vehicle-staff-contact-number').value = selectedStaff.contactNumber;
    } else {
        document.getElementById('set-vehicle-staff-name').value = "";
        document.getElementById('set-vehicle-designation').value = "";
        document.getElementById('set-vehicle-staff-contact-number').value = "";
    }
});

//fetchVehicleData
function fetchVehicleData(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/vehicles",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (response){
            loadVehicleTable(response);
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch staff data:", xhr.responseText || error);
        }
    });
}

//load vehicle data to table
function loadVehicleTable(data){
    const vehicleTableBody = $("#vehicle-tbl-tbody");
    vehicleTableBody.empty();

    data.forEach(vehicle =>{
        const row = `
            <tr>
                <td class="vehicle-code-value">${vehicle.vehicleCode}</td>
                <td class="license-plate-number-value">${vehicle.licensePlateNumber}</td>
                <td class="vehicle-category-value">${vehicle.category}</td>
                <td class="vehicle-fuel-type-value">${vehicle.fuelType}</td>
                <td class="vehicle-status-value">${vehicle.status}</td>
                <td class="vehicle-remarks-value">${vehicle.remarks}</td>
                <td class="vehicle-staff-id-value">${vehicle.staffId}</td>
            </tr>`;
        vehicleTableBody.append(row)
    })
}

$("#vehicle-tbl-tbody").on('click', 'tr', function() {
    let vehicleCode = $(this).find(".vehicle-code-value").text();
    let licensePlateNumber = $(this).find(".license-plate-number-value").text();
    let vehicleCategory = $(this).find(".vehicle-category-value").text();
    let fuelType = $(this).find(".vehicle-fuel-type-value").text();
    let status = $(this).find(".vehicle-status-value").text();
    let remarks = $(this).find(".vehicle-remarks-value").text();
    let staffId = $(this).find(".vehicle-staff-id-value").text();

        $('#vehicle-code').val(vehicleCode),
        $('#license-plate-number').val(licensePlateNumber),
        $('#vehicle-category').val(vehicleCategory),
        $('#fuel-type').val(fuelType),
        $('#vehicle-status').val(status),
        $('#vehicle-remark').val(remarks),
        $('#vehicleStaffIdOption').val(staffId)

    /*$('#staff-section-details-form').modal('show');*/
});

//get formatted vehicle code
function  fetchVehicleCode(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/vehicles/generate-next-vehicle-code", // API URL
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (data) {
            //populate vehicle code field
            $("#vehicle-code").val(data.vehicleCode);
            console.log(data.vehicleCode);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching Vehicle code:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}

//vehicle save
$("#vehicle-save").on("click", function (e) {
    e.preventDefault();

    //get Vehicle details from the form
    const vehicleData = {
        vehicleCode: $('#vehicle-code').val(),
        licensePlateNumber: $('#license-plate-number').val(),
        category: $('#vehicle-category').val(),
        fuelType: $('#fuel-type').val(),
        status: $('#vehicle-status').val(),
        remarks: $('#vehicle-remark').val(),
        staffId: $('#vehicleStaffIdOption').val()
    };

    console.log("Vehicle Data:", vehicleData);

    console.log(authToken)

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/vehicles`,
        type: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`,
        },
        data: JSON.stringify(vehicleData),
        success: function (response) {
            Swal.fire(
                "Success",
                "Vehicle saved successfully!",
                "success").then(() => {
            });
            fetchVehicleData();
            vehicleClearFields();
            fetchVehicleCode();
        },
        error: function (xhr) {
            Swal.fire("Error", xhr.responseJSON.message || "Failed to save Vehicle. Please try again.", "error");
        },
    });
});


//vehicle delete
$("#vehicle-delete").on("click", function (e) {
    e.preventDefault();

    //Retrieve the vehicle code from the input field
    const vehicleDeleteCode = $('#vehicle-code').val();

    if (!vehicleDeleteCode) {
        Swal.fire("Error", "Vehicle Code is required to delete vehicle details.", "error");
        return;
    }

    console.log("Vehicle code to delete:", vehicleDeleteCode);
    console.log("Auth token:", authToken);

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    //send the DELETE request
    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/vehicles/${vehicleDeleteCode}`,
        type: "DELETE",
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        success: function (response) {
            console.log("Delete response:", response);

            let successMessage = "Vehicle deleted successfully!";
            if (response && response.message) {
                successMessage = response.message;
            }

            Swal.fire("Success", successMessage, "success").then(() => {
                //Refresh vehicle data after successful deletion
                fetchVehicleData();
                vehicleClearFields();
                fetchVehicleCode();
            });
        },
        error: function (xhr) {
            console.error("Delete request failed:", xhr);
            let errorMessage = "Failed to delete vehicle details. Please try again.";
            Swal.fire("Error", errorMessage, "error");
        }
    });
});

//vehicle update
$("#vehicle-update").on("click", function (e) {
    e.preventDefault();

    const vehicleCode = $('#vehicle-code').val();

    if (!vehicleCode){
        Swal.fire("Error", "Staff ID is required to update staff details.", "error");
        return;
    }

    //Get staff details from the form
    const vehicleData = {
        vehicleCode: vehicleCode,
        licensePlateNumber: $('#license-plate-number').val(),
        category: $('#vehicle-category').val(),
        fuelType: $('#fuel-type').val(),
        status: $('#vehicle-status').val(),
        remarks: $('#vehicle-remark').val(),
        staffId: $('#vehicleStaffIdOption').val()
    };

    console.log("vehicle Data: ", vehicleData);
    console.log("auth Token: ",authToken)

    if (!authToken) {
        Swal.fire("Error", "No authentication token found. Please log in again.", "error");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/GreenShadow/api/v1/vehicles/${vehicleCode}`,
        type: "PUT",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}`, // Add the token to the Authorization header
        },
        data: JSON.stringify(vehicleData),
        success: function (response) {
            Swal.fire(
                "Success",
                "Vehicle updated successfully!",
                "success").then(() => {
                //$('#staff-section-details-form').modal('hide');
            });
            fetchVehicleData();
            vehicleClearFields();
            fetchVehicleCode();
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.message || "Failed to update vehicle details. Please try again.";
            Swal.fire("Error", errorMessage, "error");
        },
    });
});


//All vehicle fields clear
function vehicleClearFields(){
    $('#vehicle-code').val("");
    $('#license-plate-number').val("");
    $('#vehicle-category').val("");
    $('#fuel-type').val("");
    $('#vehicle-status').val("");
    $('#vehicle-remark').val("");
    $('#vehicleStaffIdOption').val("");
}



