import { httpRequest } from './RequestService.mjs';



class CountryManager {

    #worldView;
    #countryView;


    constructor() {
        this.#worldView = new WorldView(this.#onClickCountry.bind(this));
        this.#countryView = new CountryView(this.#onStart.bind(this));
        this.#onStart();
    }

    #onClickCountry(countryName) {
        this.#countryView.show(countryName);
    }

    #onStart() {
        this.#worldView.show();
    }
}

class WorldView {

    #onClickCountry;
    #container

    constructor(onClickCountry) {
        this.#onClickCountry = onClickCountry;
        this.#container = document.getElementById("countries");
    }

    show() {
        httpRequest.get("all", this.#onGetCountries.bind(this));
    }

    #onGetCountries(countries) {
        this.#showCountries(countries
            .map(country => {
                return {
                    name: country.name.common,
                    flag: country.flags.svg
                };
            }));
    }

    #showCountries(countries) {
        //this.#main.innerHTML = "";        
        while (this.#container.lastElementChild !== null) {
            this.#container.removeChild(this.#container.lastElementChild);
        }
        
        for (let country of countries) {
            const div = document.createElement("div");
            div.name = country.name;
            const h2 = document.createElement("h2");
            div.appendChild(h2);
            const text = document.createTextNode(country.name);
            h2.appendChild(text);
            const img = document.createElement("img");
            div.appendChild(img);
            img.alt = country.name;
            img.src = country.flag;
            div.onclick = event => { this.#onClickCountry(event.currentTarget.name); };
            this.#container.appendChild(div);
        }
    }
}

class CountryView {

    #container;
    #backButton;

    constructor(onBack) {
        this.#container = document.getElementById("countries");
        this.#backButton = document.createElement('button');
        this.#backButton.appendChild(document.createTextNode('ATRAS'));
        this.#backButton.className = "button"
        this.#backButton.addEventListener('click', onBack)
    }

    show(name) {
        httpRequest.get("name/" + name, this.#showCountry.bind(this));
    }

    #showCountry(country) {
        const ul = document.createElement("ul");
        
        //this.#main.innerHTML = "";        
        while (this.#container.lastElementChild !== null) {
            this.#container.removeChild(this.#container.lastElementChild);
        }
        
        this.#container.appendChild(ul);
        ul.appendChild(this.#generateItem("Nombre", country.name.common));
        ul.appendChild(this.#generateItem("Región", country.region));
        ul.appendChild(this.#generateItem("Subregión", country.subregion));
        this.#container.appendChild(this.#backButton);
    }

    #generateItem(field, value) {
        const li = document.createElement("li");
        const text = document.createTextNode(`${field}: ${value}`);
        li.appendChild(text);
        return li;
    }
}

const countryManager = new CountryManager();





