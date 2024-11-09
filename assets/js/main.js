/*import {loadAllCustomerId} from '../controller/orderController.js';
import {loadAllItemCodes} from '../controller/orderController.js';*/

$('#dashboard-section').css({display: 'block'});
$('#field-section').css({display: 'none'});
$('#staff-section').css({display: 'none'});
$('#crops-section').css({display: 'none'});
$('#logs-section').css({display: 'none'});
$('#vehicle-section').css({display: 'none'});
$('#equipment-section').css({display: 'none'});


// dashboard nav management
$('#nav-dashboard').on('click', () => {
    $('#dashboard-section').css({display: 'block'});
    $('#field-section').css({display: 'none'});
    $('#staff-section').css({display: 'none'});
    $('#crops-section').css({display: 'none'});
    $('#logs-section').css({display: 'none'});
    $('#vehicle-section').css({display: 'none'});
    $('#equipment-section').css({display: 'none'});
});

//customer nav management
$('#nav-field').on('click', () => {
    $('#dashboard-section').css({display: 'none'});
    $('#field-section').css({display: 'block'});
    $('#staff-section').css({display: 'none'});
    $('#crops-section').css({display: 'none'});
    $('#logs-section').css({display: 'none'});
    $('#vehicle-section').css({display: 'none'});
    $('#equipment-section').css({display: 'none'});
});

//item nav management
$('#nav-staff').on('click', () => {
    $('#dashboard-section').css({display: 'none'});
    $('#field-section').css({display: 'none'});
    $('#staff-section').css({display: 'block'});
    $('#crops-section').css({display: 'none'});
    $('#logs-section').css({display: 'none'});
    $('#vehicle-section').css({display: 'none'});
    $('#equipment-section').css({display: 'none'});
});

//order nav management
$('#nav-crop').on('click', () => {
    $('#dashboard-section').css({display: 'none'});
    $('#field-section').css({display: 'none'});
    $('#staff-section').css({display: 'none'});
    $('#crops-section').css({display: 'block'});
    $('#logs-section').css({display: 'none'});
    $('#vehicle-section').css({display: 'none'});
    $('#equipment-section').css({display: 'none'});
});

$('#nav-logs').on('click', () => {
    $('#dashboard-section').css({display: 'none'});
    $('#field-section').css({display: 'none'});
    $('#staff-section').css({display: 'none'});
    $('#crops-section').css({display: 'none'});
    $('#logs-section').css({display: 'block'});
    $('#vehicle-section').css({display: 'none'});
    $('#equipment-section').css({display: 'none'});
});

$('#nav-vehicle').on('click', () => {
    $('#dashboard-section').css({display: 'none'});
    $('#field-section').css({display: 'none'});
    $('#staff-section').css({display: 'none'});
    $('#crops-section').css({display: 'none'});
    $('#logs-section').css({display: 'none'});
    $('#vehicle-section').css({display: 'block'});
    $('#equipment-section').css({display: 'none'});
});

$('#nav-equipment').on('click', () => {
    $('#dashboard-section').css({display: 'none'});
    $('#field-section').css({display: 'none'});
    $('#staff-section').css({display: 'none'});
    $('#crops-section').css({display: 'none'});
    $('#logs-section').css({display: 'none'});
    $('#vehicle-section').css({display: 'none'});
    $('#equipment-section').css({display: 'block'});
});


