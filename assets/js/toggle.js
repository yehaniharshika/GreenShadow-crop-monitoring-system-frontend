const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const menuToggleField = document.getElementById("menu-toggle1");
const menuToggleStaff = document.getElementById("menu-toggle2");
const menuToggleCrop = document.getElementById("menu-toggle3");
const menuToggleLogs = document.getElementById("menu-toggle4");
const menuToggleVehicle = document.getElementById("menu-toggle5");
const menuToggleEquipment = document.getElementById("menu-toggle6");
const closeSidebar = document.getElementById("close-sidebar");

menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
});

menuToggleField.addEventListener("click", () =>{
    sidebar.classList.add("active");
});

menuToggleStaff.addEventListener("click", () =>{
    sidebar.classList.add("active");
});

menuToggleCrop.addEventListener("click", () =>{
    sidebar.classList.add("active");
});

menuToggleLogs.addEventListener("click", () =>{
    sidebar.classList.add("active");
});

menuToggleVehicle.addEventListener("click", () =>{
    sidebar.classList.add("active");
});

menuToggleEquipment.addEventListener("click", () =>{
    sidebar.classList.add("active");
});
closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("active");
});