let resultado = document.getElementById("wrap-result");
let buscarbtn = document.getElementById("buscar-button");
let favbtn = document.getElementById("favoritos-butto");
let url = "https://thecocktaildb.com/api/json/v1/1/search.php?s="

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

                    if (i.startsWith("strIngredient") && tragos[i]) {
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

                resultado.innerHTML = `
                <img src= ${tragos.strDrinkThumb}>
                <h2>${tragos.strDrink}</h2>
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

