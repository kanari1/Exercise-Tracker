let url = 'http://flip1.engr.oregonstate.edu:1963/'

document.addEventListener('DOMContentLoaded', bindSubmitButton);
document.addEventListener('DOMContentLoaded', bindEditButton);


// 1) POST Function:  Give submit form button functionality and to post a row into the table 
function bindSubmitButton() {
    document.getElementById('addExerciseButton').addEventListener('click', function(event) {
        var req = new XMLHttpRequest(); 
        var payload = {}

        // To get the value from the form -> create key-value pairs for object 
        payload.name = document.getElementById('name').value; 
        payload.reps = document.getElementById('reps').value; 
        payload.weight = document.getElementById('weight').value; 
        if (document.getElementById('lbs').checked == true) {
            payload.unit = "1";
        } else {
            payload.unit = "0";
        }
        payload.date = document.getElementById('date').value; 
        

        req.open("POST", url, true); 
        req.setRequestHeader('Content-Type', 'application/json'); 
        req.addEventListener('load', function() {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText); 
                var data = response.results
                //console.log("Here's print data number 1: ")
                //console.log(data)
                
                // Write a function to create a table and call that function here
                createTable(data); 

            } else {
                console.log("Error in network request: " + req.statusText); 
            }
        }); 
        req.send(JSON.stringify(payload));
        event.preventDefault();
    });
}

// Write function to create the table and rows with data in it 

function createTable(data) {
    var table = document.getElementById("table")
    
    //table.querySelector("tbody").innerHTML = ""
        
    
    // Empty contents of table
    table.innerHTML = ""

    // ----------- Create header rows -------------- 
    var headerRow = document.createElement("tr");

    var nameHeader = document.createElement("th"); 
    nameHeader.innerText = "Name"
    headerRow.appendChild(nameHeader);

    var repsHeader = document.createElement("th"); 
    repsHeader.innerText = "Reps"
    headerRow.appendChild(repsHeader);

    var weightHeader = document.createElement("th"); 
    weightHeader.innerText = "Weight"
    headerRow.appendChild(weightHeader);

    var unitHeader = document.createElement("th"); 
    unitHeader.innerText = "Unit"
    headerRow.appendChild(unitHeader);

    var dateHeader = document.createElement("th"); 
    dateHeader.innerText = "Date"
    headerRow.appendChild(dateHeader);

    var editHeader = document.createElement("th"); 
    editHeader.innerText = "Edit"
    headerRow.appendChild(editHeader);

    var deleteHeader = document.createElement("th"); 
    deleteHeader.innerText = "Delete"
    headerRow.appendChild(deleteHeader);

    table.appendChild(headerRow)
    
    
    
    // ------------------------ Create rows --------------------
    // For each exercise in the array, create a row for the exercise (Create all the rows in the database)
    data.forEach(function(row, index){
        var newRow = document.createElement("tr"); 

        var nameCell = document.createElement('td');
        nameCell.innerText = row.name; 
        newRow.appendChild(nameCell);


        var repsCell = document.createElement('td');
        repsCell.innerText = row.reps;
        newRow.appendChild(repsCell);

        var weightCell = document.createElement('td');
        weightCell.innerText = row.weight; 
        newRow.appendChild(weightCell); 


        var unitCell = document.createElement('td'); 
        if (row.unit == 1) {
            unitCell.innerText = "lbs";
        } else if (row.unit == 0) {
            unitCell.innerText = "kg";
        }
        newRow.appendChild(unitCell)

        var dateCell = document.createElement('td');
        dateCell.innerText = row.date; 
        newRow.appendChild(dateCell); 


        var id = row["id"]

        // 1) Creating the cell for the edit button 
        var editButtonCell = document.createElement('td'); 
        var editButton = document.createElement('input');
        editButton.setAttribute('type', 'button');      // set attributes for the edit button
        editButton.setAttribute('value', 'edit');
        editButton.setAttribute('name', 'edit'); 
        editButton.onclick = function wrapper() { editRow(id); }

        editButtonCell.appendChild(editButton); 
        newRow.appendChild(editButtonCell);

        // Creating the cell for the delete button 
        var deleteButtonCell = document.createElement('td'); 
        var deleteButton = document.createElement('input');
        deleteButton.setAttribute('type', 'button');      // set attributes for the edit button
        deleteButton.setAttribute('value', 'delete');
        deleteButton.setAttribute('name', 'delete'); 


        // Create a hidden attribute for the delete button for the id 
        var deleteId = document.createElement('input'); 
        deleteId.setAttribute('type', 'hidden')
        deleteId.setAttribute('id', id)
        
        // Give functionality to the delete button 
        deleteButton.onclick = function wrapper() { deleteARow(index); }
        deleteButtonCell.appendChild(deleteId); 
        deleteButtonCell.appendChild(deleteButton); 

        newRow.appendChild(deleteButtonCell);

        table.appendChild(newRow)                           // Append new row to the table 
    });

}



// Need to fix (does not delete last row); does not delete corresponding row correctl; deleting row does not persist after 
// refreshing


function deleteARow(id) {
    var req = new XMLHttpRequest(); 
    var payload = {}
    payload.id = id 

    var table = document.getElementById("table")
    rowNumber = table.rows.length;

    //table.deleteRow(id)

    //row_to_delete = table.getElementById(id)
    //table.deleteRow(row_to_delete)

    req.open('DELETE', url, true); 
    req.setRequestHeader("Content-type", "application/json"); 
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText); 

            table.deleteRow(id)
            //response.id = id

            //var data = response.results
                //console.log("Here's print data number 1: ")
                //console.log(data)
                
                // Write a function to create a table and call that function here
            //createTable(data); 

        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(payload));
    event.preventDefault()
}



// To reveal the form to edit the exercise for that row 
function editRow(id) {
    document.getElementById("editForm").style.display = "block";
    
}

// Bind the edit button to send over data when form is submitted, and hide form when done 
function bindEditButton() {
    document.getElementById('editSubmitButton').addEventListener('click', function(event) {
        var req = new XMLHttpRequest(); 
        var payload = {}

        // To get the value from the form -> create key-value pairs for object 
        payload.name = document.getElementById('editName').value; 
        payload.reps = document.getElementById('editReps').value; 
        payload.weight = document.getElementById('editWeight').value; 
        if (document.getElementById('editlbs').checked == true) {
            payload.unit = "1";
        } else {
            payload.unit = "0";
        }
        payload.date = document.getElementById('editDate').value; 
        

        req.open("PUT", url, true); 
        req.setRequestHeader('Content-Type', 'application/json'); 
        req.addEventListener('load', function() {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText); 
                var data = response.results
                
                // Write a function to create a table and call that function here
                createTable(data); 

            } else {
                console.log("Error in network request: " + req.statusText); 
            }
        }); 
        req.send(JSON.stringify(payload));
        event.preventDefault();

        // Hide edit form again 
        document.getElementById("editForm").style.display = "none";

    });
}
