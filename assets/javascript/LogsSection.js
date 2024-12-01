const authToken = localStorage.getItem("authToken");
let staffData=[];
let cropData=[];
let fieldData=[];

window.addEventListener('load', () => {
    fetchLogCode();
    setLogDate();
});

function  fetchLogCode(){
    $.ajax({
        url: "http://localhost:8080/GreenShadow/api/v1/logs/generate-next-log-code", // API URL
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": `Bearer ${authToken}` // Add Bearer token to headers
        },
        success: function (data) {
            //populate vehicle code field
            $("#log-code").val(data.logCode);
            console.log(data.logCode);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching Log code:", error);
            console.error("Response:", xhr.responseText);
        }
    });
}

function setLogDate() {
    // Get the current date
    const today = new Date();

    // Format the date as YYYY-MM-DD
    const formattedDate = today.toISOString().split('T')[0];

    const logDateInput = document.getElementById("log-date");
    if (logDateInput) {
        logDateInput.value = formattedDate;
    }
}