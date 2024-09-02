const loadingElement = document.getElementById('loading');
let resultado = document.getElementById("wrap-result");
let buscarbtn = document.getElementById("buscar-button");
let favbtn = document.getElementById("favoritos");
let Afavoritos = document.getElementById("Afavoritos");
let fav = document.getElementById("wrap-fav");
const menuFavoritos = document.querySelector('.menuFavoritos');
let url = "https://thecocktaildb.com/api/json/v1/1/search.php?s=";
let randombtn = document.getElementById("random-button");
let randomUrl = "https://thecocktaildb.com/api/json/v1/1/random.php";
let tragosFavoritos = [];
let contadorClic = 0;
let contadorClicA = 0;
loadingElement.classList.add("oculto");
const idsBebidasAgregadas = new Set();

function showfav(tragosFavoritos) {
    if (contadorClic == 0) {
        favbtn.style.color = "yellow";
        contadorClic++;
        console.log("contadorClic: " + contadorClic);
    } else if (contadorClic == 1) {
        favbtn.style.color = "white";
        contadorClic--;
        console.log("contadorClic: " + contadorClic);
        console.log("Se cerro tragos favoritos");
    }

    if (menuFavoritos.hasAttribute('hidden')) {
        menuFavoritos.removeAttribute('hidden');
    } else {
        menuFavoritos.setAttribute('hidden', '');
    }

    console.log("Se abrio tragos favoritos");
}

function agregarFav(dato) {
    if (!tragosFavoritos.includes(dato)) {
        tragosFavoritos.push(dato);
        console.log("Se agrego el trago a favoritos");
        console.log("Los tragos favoritos son: " + tragosFavoritos);
    } else {
        console.log("Este trago ya esta en tus favoritos");
    }

    tragosFavoritos.forEach((trago) => {
        fetch(url + trago)
            .then((response) => response.json())
            .then((data) => {
                let bebida = data.drinks[0];
                console.log(bebida);

                if (!idsBebidasAgregadas.has(bebida.idDrink)) {
                    // Escapar las comillas para que el objeto JSON se pase como cadena de texto
                    fav.innerHTML += `
                        <button id="${bebida.idDrink}" class="mostrarFav" onclick='displayDrinks(${JSON.stringify(bebida)})'>
                            <h2 id="nombreFav">${bebida.strDrink}</h2>
                            <h3 id="idFav">ID: ${bebida.idDrink}</h3>
                        </button>
                    `;

                    idsBebidasAgregadas.add(bebida.idDrink);

                    console.log("El nombre de la bebida es: " + bebida.strDrink);
                    console.log("El id de la bebida es: " + bebida.idDrink);
                } else {
                    console.log("La bebida ya fue añadida previamente: " + bebida.strDrink);
                }
            })
            .catch(error => {
                console.log("error");
                fav.innerHTML = `
                    <h2 id="nombreFav">Carrito vacio</h2>
                `;
            });
    });
}

let getInfo = () => {
    loadingElement.classList.remove("oculto");
    let input = document.getElementById("buscar").value;
    fetch(url + input)
        .then((response) => response.json())
        .then((data) => {
            displayDrinks(data.drinks[0]); // Pasa directamente el objeto de bebida
        })
        .catch((error) => {
            console.log("Error al buscar el trago: ", error);
            resultado.innerHTML = "No se encontró el trago. Intenta con otro nombre.";
        });
};

let getRandom = () => {
    loadingElement.classList.remove("oculto");
    fetch(randomUrl)
        .then((response) => response.json())
        .then((data) => {
            displayDrinks(data.drinks[0]); // Pasa directamente el objeto de bebida
            document.getElementById("buscar").value = "";
        })
        .catch((error) => {
            console.log("Error al obtener trago aleatorio: ", error);
            resultado.innerHTML = "Error al obtener un trago aleatorio.";
        });
            const image = new Image();
            image.src = data.drinks[0].strDrinkThumb;
            image.onload = () => {
                displayDrinks(data.drinks[0]);
                document.getElementById("buscar").value = "";
                loadingElement.classList.add("oculto");
        };
};
let displayDrinks = (tragos, input = "") => {
    // Verifica si el argumento es un objeto ya convertido o una cadena JSON
    let bebida = typeof tragos === "string" ? JSON.parse(tragos) : tragos;

    if (bebida) {
        loadingElement.classList.add("oculto");
        let contador = 1;
        let ingredientes = [];

        for (let i in bebida) {
            let ingrediente = "";
            let medida = "";

            if (i.startsWith("strIngredient") && bebida[i]) {
                ingrediente = bebida[i];
                if (bebida["strMeasure" + contador]) {
                    medida = bebida["strMeasure" + contador];
                    contador++;
                } else {
                    medida = "";
                }
                contador++;
                ingredientes.push(`${medida} ${ingrediente}`);
            }
        }

        console.log(ingredientes);
        console.log(bebida.strDrink);

        resultado.innerHTML = `
        <img src=${bebida.strDrinkThumb}>
        <h2>${bebida.strDrink} 
        <button id="Afavoritos" onclick="agregarFav('${bebida.strDrink}')">
            <span class="material-symbols-outlined">star</span>
        </button>
        </h2>
        <h3>ID: ${bebida.idDrink}</h3>
        <h3>Categoria: </h3>
        <p>${bebida.strCategory}</p>
        <h3>Ingredientes:</h3>
        <ul class="ingredientes"></ul>
        <h3>Instrucciones:</h3>
        <p>${bebida.strInstructions}</p>
        `;
        
        let ingredientesUL = document.querySelector(".ingredientes");
        ingredientes.forEach((ingrediente) => {
            let li = document.createElement("li");
            li.innerHTML = ingrediente;
            ingredientesUL.appendChild(li);
        });
    } else {
        resultado.innerHTML = "Indique una bebida para buscar...";
    }
};

window.addEventListener("load", () => {
    document.getElementById("buscar").value = "";
});

buscarbtn.addEventListener("click", getInfo);
randombtn.addEventListener("click", getRandom);
