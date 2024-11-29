const authToken = localStorage.getItem("authToken");
let staffData=[];
window.addEventListener('load', () => {
    fetchVehicleCode();
    //fetchVehicleData();
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
/*
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

            fetchVehicleCode();
        },
        error: function (xhr) {
            Swal.fire("Error", xhr.responseJSON.message || "Failed to save Vehicle. Please try again.", "error");
        },
    });
});*/
