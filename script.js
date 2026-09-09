function updateClock() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const now = new Date();
    
    timeElement.textContent = now.toLocaleTimeString(); 

    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    dateElement.textContent = now.toLocaleDateString(undefined, options);
}

updateClock();
setInterval(updateClock, 1000);