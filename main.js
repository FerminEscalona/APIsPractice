let resultado = document.getElementById("wrap-result");
let buscarbtn = document.getElementById("buscar-button");
let favbtn = document.getElementById("favoritos");
let Afavoritos = document.getElementById("Afavoritos");
let fav = document.getElementById("wrap-fav");
const menuFavoritos = document.querySelector('.menuFavoritos');
let url = "https://thecocktaildb.com/api/json/v1/1/search.php?s="
let tragosFavoritos = [];
let contadorClic = 0;
let contadorClicA = 0;

function showfav(tragosFavoritos) {
    if (contadorClic == 0) {
        favbtn.style.color = "yellow";
        contadorClic++;
        console.log("contadorClic: " + contadorClic);
    }else if (contadorClic == 1) {
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
    
tragosFavoritos.forEach((trago) => {
    fetch(url + trago)
        .then((response) => response.json())
        .then((data) => {
            let bebida = data.drinks[0];
            //Aqui pueden manejar como quieran la informacion de la bebida no pude ponerla por pantalla
            console.log("El nombre de la bebida es: " + bebida.strDrink);
            console.log("El id de la bebida es: " + bebida.idDrink);
            fav.innerHTML = `      
                <h2 id="nombreFav">${bebida.strDrink}</h2>
                <h3 id="idFav">ID: ${bebida.idDrink}</h3>
            `;
        })
        .catch(error => {
            console.log("error");
            fav.innerHTML = `
                <h2 id="nombreFav">Carrito vacio</h2>
            `;
        });
    });
}

function agregarFav(dato) {
    if (!tragosFavoritos.includes(dato)) {
        tragosFavoritos.push(dato);
        console.log("Se agrego el trago a favoritos");
        console.log("Los tragos favoritos son: " + tragosFavoritos);
    } else {
        console.log("Este trago ya esta en tus favoritos");
    }
}

let getInfo = () => {

    let input = document.getElementById("buscar").value;

    if (input != "") {
        fetch(url + input)
            .then((response) => response.json())
            .then((data) => {

                console.log(data);
                console.log(data.drinks[0]);

                let tragos = data.drinks[0];
                
                console.log(tragos.idDrink);
                console.log(tragos.strDrink);
                console.log(tragos.strCategory);
                console.log(tragos.strDrinkThumb);
                console.log(tragos.strInstructions);

                let contador = 1;
                let ingredientes = [];

                for (let i in tragos) {

                    let ingrediente = "";
                    let medida = "";

                    if (i.startsWith("strIngredient") && tragos[i])      {
                        ingrediente = tragos[i];
                        if (tragos["strMeasure" + contador]) {
                            medida = tragos["strMeasure" + contador];
                            contador++;
                        } else {
                            medida = "";
                        }
                        contador++;
                        ingredientes.push(`${medida} ${ingrediente}`);
                    }
                }

                console.log(ingredientes);

                console.log(tragos.strDrink);

                resultado.innerHTML = `
                <img src= ${tragos.strDrinkThumb}>
                <h2>${tragos.strDrink} 
                <button id="Afavoritos" onclick="agregarFav('${tragos.strDrink}')">
                    <span class="material-symbols-outlined">
                        star
                    </span>
                </button>
                </h2>
                <h3>ID: ${tragos.idDrink}</h3>
                <h3>Categoria: </h3>
                <p>${tragos.strCategory}</p>
                <h3>Ingredientes:</h3>
                <ul class = "ingredientes"></ul>
                <h3>Instrucciones:</h3>
                <p>${tragos.strInstructions}</p>
            `;
                let ingredientesUL = document.querySelector(".ingredientes");
                ingredientes.forEach((ingrediente) => {
                    let li = document.createElement("li");
                    li.innerHTML = ingrediente;
                    ingredientesUL.appendChild(li);
                });

            });
    }
};

window.addEventListener("load", () => {
    document.getElementById("buscar").value = "";
    getInfo();
});

buscarbtn.addEventListener("click", getInfo);

