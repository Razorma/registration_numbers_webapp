// Initialize an empty object to store registration numbers
let regNumbers = {};

// Initialize an empty array to store town-specific registration numbers
let townNumbers = [];

// Initialize a variable to track the currently set registration number
let currentReg = "";

// Initialize an array to store registration numbers based on chosen town
let townChosen = [];

// Initialize a counter for registration numbers
let registrationCounter = 0;

// Initialize a variable to track the number of repeated registrations
let trackRegistrations = 0;

// Export a function named displayRegNumbers
export default function displayRegNumbers() {
    let message = "";

    // Regular expression to validate registration numbers
    const allowed = /^C[FKLAYJ](\s\d{1,6}|\s\d{1,3}-\d{1,3})*$/;

    // Function to set a registration number
    function setRegNumber(reg) {
        message = "";

        if (allowed.test(reg.toUpperCase())) {
            message = "";
            trackRegistrations = 0;
            const regs = reg.replace(/[\s-]/g, '');

            if (regNumbers[regs.toUpperCase()] === undefined) {
                registrationCounter++;
                regNumbers[regs.toUpperCase()] = regs.toUpperCase().replace(/(.{2})/, '$1 ');
                currentReg = regs.toUpperCase().replace(/(.{2})/, '$1 ');
            } else {
                trackRegistrations++;
                regNumbers[regs.toUpperCase()] = regs.toUpperCase().replace(/(.{2})/, '$1 ');
            }
        } else if (!allowed.test(reg.toUpperCase())) {
            message = "Enter only registrations from Paarl, Bellville, Stellenbosch, Malmesbury, Cape-Town, and Kuilsriver (See the select town Dropdown menu for formats)";
        }
    }

    // Function to retrieve all registration numbers
    function getRegNumbers() {
        return regNumbers;
    }

    // Function to retrieve the registration number counter
    function regNumberCounter() {
        return registrationCounter;
    }

    // Function to set the town and retrieve town-specific registration numbers
    function setTown(townPrefix) {
        townChosen = [];
        for (let regs in regNumbers) {
            if (regNumbers[regs].startsWith(townPrefix)) {
                townChosen.push(regNumbers[regs]);
            }
        }
    }

    // Function to retrieve all town-specific registration numbers
    function getAllTown() {
        return townChosen;
    }

    // Function to determine the town associated with the current registration number
    function checkTown() {
        if (currentReg.startsWith("CA")) {
            return "CapeTown";
        } else if (currentReg.startsWith("CJ")) {
            return "paarl";
        } else if (currentReg.startsWith("CY")) {
            return "Bellville";
        } else if (currentReg.startsWith("CL")) {
            return "Stellenbosch";
        } else if (currentReg.startsWith("CK")) {
            return "Malmesbury";
        } else if (currentReg.startsWith("CF")) {
            return "Kuilsriver";
        }
    }

    // Function to retrieve the currently set registration number
    function getCurrentReg() {
        return currentReg;
    }

    // Function to retrieve town-specific registration numbers
    function getTown() {
        return townChosen;
    }

    // Function to retrieve error message
    function getError() {
        return message;
    }

    // Function to track repeated registration numbers
    function trackReg() {
        return trackRegistrations++;
    }

    // Return an object with the defined functions
    return {
        setRegNumber,
        getRegNumbers,
        setTown,
        getAllTown,
        regNumberCounter,
        getTown,
        getError,
        trackReg,
        checkTown,
        getCurrentReg
    };
}
