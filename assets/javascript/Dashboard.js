const authToken = localStorage.getItem("authToken");

$(document).ready(function () {
    setFieldCount();
    setStaffCount();
    setCropCount();
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




