document.addEventListener('DOMContentLoaded', function(){
    let messageElem = document.querySelector('.warningMessage');
    if (messageElem.innerHTML !== ''){
        setTimeout(function(){
            messageElem.innerHTML = '';
        }, 3000);
    }
    let warningMessageTown = document.querySelector('.warningMessageTown');
    if (warningMessageTown.innerHTML !== ''){
        setTimeout(function(){
            warningMessageTown.innerHTML = '';
        }, 3000);
    }
    

    if(document.querySelector('.infoMessage')){
        if (document.querySelector('.infoMessage').innerHTML !== ''){
            setTimeout(function(){
                document.querySelector('.infoMessage').innerHTML = '';
            }, 3000);
        }
    }
    
});
let town = document.getElementById("town")
town.addEventListener("change", function () {
    let selectedOption = this.options[this.selectedIndex];
    let dataName = selectedOption.getAttribute("data-name");
    document.getElementById("data-name").value= dataName;
});