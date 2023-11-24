var row_idx = 0; // Global variable for counting the rows
var row_ids_list = []
var result = []

function onRateChange() {
    rate_ele = document.getElementById('rate')
    // Checking for rate lower than 0 or higher than 0
    if(parseFloat(rate_ele.value) > 100)
        rate_ele.value = 100
    else if (parseFloat(rate_ele.value) < 0)
        rate_ele.value = 0

    rate =  parseFloat(rate_ele.value)
    for(let i of row_ids_list) {
        hr_worked = parseInt(document.getElementById('hr_worked_' + i).value)
        document.getElementById('calc_hours_' + i).value = (hr_worked * rate).toFixed(2)
    }
}

function onHrChange(i) {
    // Checking for rate lower than 0 or higher than 0
    hr_ele = document.getElementById('hr_worked_' + i);
    if (parseInt(hr_ele.value) < 0)
        hr_ele.value = 0;
    hr_worked = parseInt(hr_ele.value);
    rate = parseFloat(document.getElementById('rate').value);
    document.getElementById('calc_hours_' + i).value = (hr_worked * rate).toFixed(2);
}

function validFields() {
    for(let i of row_ids_list) {
        sin = document.getElementById('sin_' + i).value;
        firstname = document.getElementById('firstname_' + i).value;
        lastname = document.getElementById('lastname_' + i).value;
        hr_worked = parseInt(document.getElementById('hr_worked_' + i).value);
        calc_hours = parseInt(document.getElementById('calc_hours_' + i).value);

        if(
            sin.length < 9 ||
            firstname <= 0 ||
            lastname <= 0 ||
            hr_worked == NaN ||
            calc_hours == NaN
        ) {
            return false;
        }
        return true;
    }
}

function displayMessage(alert, msg) {
    var alert = `
    <div class='alert ${alert} d-flex flex-row justify-content-between align-items-center' id="alert" role="alert">
        <div>${msg}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    document.getElementById('alert-container').insertAdjacentHTML('beforeend', alert);
}

function onFormSubmit(e) {
    e.preventDefault();
    if(!validFields()) {
        displayMessage('alert-danger', "*Required field is missing", 2000);
        return;
    }
    const formData = new FormData(e.currentTarget);
    result = [];
    for(let i of row_ids_list) {
        const data = {
            "sin":formData.get('sin_' + i),
            "firstname":formData.get('firstname_' + i),
            "lastname":formData.get('lastname_' + i),
            "hr_worked": parseInt(formData.get('hr_worked_' + i)),
            "calc_hours": parseInt(formData.get('calc_hours_' + i)),
        };
        result.push(data);
    }
    displayMessage('alert-success', "Submit successfully!", 2000);
    displayMessage('alert-success', JSON.stringify(result));
}

function removeRow(i) {
    document.getElementById('tr_' + i).remove()
    row_ids_list = row_ids_list.filter((id) => id != i) 
}

function getRowFields() {
    return `
            <td>
                <input type="text" id="sin_${row_idx}" name="sin_${row_idx}" required placeholder="012345678" pattern="[0-9]{9}" maxlength='9'/>
            </td>
            <td>
                <input type="text" id="firstname_${row_idx}" name="firstname_${row_idx}" required/>
            </td>
            <td>
                <input type="text" id="lastname_${row_idx}" name="lastname_${row_idx}" required />
            </td>
            <td>
                <input type="number" id="hr_worked_${row_idx}" name="hr_worked_${row_idx}" onchange="onHrChange(${row_idx})" value="0" min="0"/>
            </td>
            <td>
                <input type="number" id="calc_hours_${row_idx}" name="calc_hours_${row_idx}" value="0.00" readonly="readonly"/>
            </td>
            <td>
                <buttom type="button" class="btn btn-danger btn-sm" onclick="removeRow(${row_idx})">Delete</button>
            </td>
            `;
}

function addNewRow() {
    var t = document.getElementById('staff-content');
    var tr = document.createElement('tr');
    tr.id = 'tr_' + row_idx;
    tr.innerHTML = getRowFields();
    t.appendChild(tr);
    row_ids_list.push(row_idx);
    row_idx++;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('timesheet_form');
    form.addEventListener('submit', onFormSubmit);
    addNewRow();
});