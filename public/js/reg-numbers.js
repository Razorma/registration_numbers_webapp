// Execute the following code when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Find the element with class "warningMessage"
    let messageElem = document.querySelector('.warningMessage');

    // If the innerHTML of the element is not empty
    if (messageElem.innerHTML !== '') {
        // Set a timeout to clear the message after 3 seconds
        setTimeout(function () {
            messageElem.innerHTML = '';
        }, 3000);
    }

    // Find the element with class "warningMessageTown"
    let warningMessageTown = document.querySelector('.warningMessageTown');

    // If the innerHTML of the element is not empty
    if (warningMessageTown.innerHTML !== '') {
        // Set a timeout to clear the message after 3 seconds
        setTimeout(function () {
            warningMessageTown.innerHTML = '';
        }, 3000);
    }

    // If there is an element with class "infoMessage"
    if (document.querySelector('.infoMessage')) {
        // If the innerHTML of the element is not empty
        if (document.querySelector('.infoMessage').innerHTML !== '') {
            // Set a timeout to clear the message after 3 seconds
            setTimeout(function () {
                document.querySelector('.infoMessage').innerHTML = '';
            }, 3000);
        }
    }
});

// Find the element with the id "town"
let town = document.getElementById("town");

// Add an event listener for the "change" event on the "town" element
town.addEventListener("change", function () {
    // Get the selected option
    let selectedOption = this.options[this.selectedIndex];

    // Get the value of the "data-name" attribute from the selected option
    let dataName = selectedOption.getAttribute("data-name");

    // Set the value of the input with id "data-name" to the retrieved dataName
    document.getElementById("data-name").value = dataName;
});
const submitReset = document.querySelector(".clearButtonTwo")
submitReset.addEventListener("click", (event) => {
    if (!confirm("Are you sure you want to delete all registration Numbers from storage?")) {
        event.preventDefault();
    }
});