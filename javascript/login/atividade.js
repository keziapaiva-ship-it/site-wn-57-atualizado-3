

const lista =
document.getElementById("lista-corridas");

const corridas =
JSON.parse(localStorage.getItem("corridas")) || [];

/* inverter ordem */
corridas.reverse();

/* mostrar corridas */
corridas.forEach(corrida => {

    lista.innerHTML += `

    `;

});

