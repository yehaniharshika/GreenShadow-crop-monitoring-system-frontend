const authToken = localStorage.getItem("authToken");
let staffData=[];
let fieldData=[];

window.addEventListener('load', () => {
    fetchEquipmentId();
    //fetchVehicleData();
    //loadStaffIds();
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
