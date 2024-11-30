const authToken = localStorage.getItem("authToken");
let staffData=[];
let fieldData=[];

window.addEventListener('load', () => {
    fetchEquipmentId();
    //fetchVehicleData();
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
            // Populate the select element with staff IDs
            staffData.forEach((staff) => {
                $("#equipmentStaffIdOption").append(new Option(staff.staffId, staff.staffId));
            });
            console.log("Successfully loaded staff Ids to vehicle section");
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
