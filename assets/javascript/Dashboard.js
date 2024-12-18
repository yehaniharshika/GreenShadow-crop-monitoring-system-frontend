const authToken = localStorage.getItem("authToken");

$(document).ready(function () {
    setFieldCount();
    setStaffCount();
    setCropCount();
    setVehicleCount();
});

function setFieldCount(){
    const setFieldCount = $('#field-count');

    $.ajax({
        url: 'http://localhost:8080/GreenShadow/api/v1/fields/fieldCount',
        type: 'GET',
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (response) {
            console.log("Field count fetched successfully:", response);
            const formattedCount = response < 10 ? `0${response}` : response;

            //set the field count in the front end
            setFieldCount.text(formattedCount);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching field count:", error);
            setFieldCount.text('Error');
        }
    });
}

function setStaffCount(){
    const setStaffCount = $('#staff-count');

    $.ajax({
        url: 'http://localhost:8080/GreenShadow/api/v1/staff/staffCount',
        type: 'GET',
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (response) {
            console.log("Staff count fetched successfully:", response);
            const formattedStaffCount = response < 10 ? `0${response}` : response;

            //set the field count in the front end
            setStaffCount.text(formattedStaffCount);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching Staff count:", error);
            setStaffCount.text('Error');
        }
    });
}


//set crop count
function setCropCount(){
    const setCropCount = $('#crop-count');

    $.ajax({
        url: 'http://localhost:8080/GreenShadow/api/v1/crops/cropCount',
        type: 'GET',
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (response) {
            console.log("Crop count fetched successfully:", response);
            const formattedCropCount = response < 10 ? `0${response}` : response;

            //set the field count in the front end
            setCropCount.text(formattedCropCount);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching Crop count:", error);
            setCropCount.text('Error');
        }
    });
}


//set vehicle count
function setVehicleCount(){
    const setVehicleCount = $('#vehicle-count');

    $.ajax({
        url: 'http://localhost:8080/GreenShadow/api/v1/vehicles/vehicleCount',
        type: 'GET',
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (response) {
            console.log("Crop count fetched successfully:", response);
            const formattedVehicleCount = response < 10 ? `0${response}` : response;

            //set the vehicle count in the front end
            setVehicleCount.text(formattedVehicleCount);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching Crop count:", error);
            setVehicleCount.text('Error');
        }
    });
}

