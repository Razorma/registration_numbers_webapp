let regNumbers = {}
let townNumbers = []



let townChosen = []
var registrationCounter = 0;

var trackRegistrations = 0;
export default function displayRegNumbers() {
    let message = ""
    const allowed = /^C[FKLAYJ](\s\d{1,6}|\s\d{1,3}-\d{1,3})*$/;
    function setRegNumber(reg) {

        if (allowed.test(reg.toUpperCase())) {
            trackRegistrations = 0
            const regs = reg.replace(/[\s-]/g, '')
            if (regNumbers[regs.toUpperCase()] === undefined) {
                registrationCounter++

                regNumbers[regs.toUpperCase()] = regs.toUpperCase().replace(/(.{2})/, '$1 ')
            } else {
                trackRegistrations++
                regNumbers[regs.toUpperCase()] = regs.toUpperCase().replace(/(.{2})/, '$1 ')
            }
        } else if(!allowed.test(reg.toUpperCase())){
            message = "Enter only registrations from Paarl, Bellville, Stellenbosch, Malmesbury, Cape-Town, and Kuilsriver (See the select town Dropdown menu for formats)"
        }
    }


    function getRegNumbers() {
        return regNumbers
    }
    function regNumberCounter() {
        return registrationCounter
    }

    function setTown(townPrefix) {

        townChosen = [];
        for (let regs in regNumbers) {

            if (regNumbers[regs].startsWith(townPrefix)) {
                townChosen.push(regNumbers[regs])
            }
        }
    }

    function getAllTown() {
        return townChosen
    }

    function getTown() {
        return townChosen
    }
    function getError() {
        return message
    }
    function trackReg() {
        return trackRegistrations++
    }
    return {
        setRegNumber,
        getRegNumbers,
        setTown,
        getAllTown,
        regNumberCounter,
        getTown,
        getError,
        trackReg,
    }
}


