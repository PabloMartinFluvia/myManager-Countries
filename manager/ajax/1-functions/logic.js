const httpRequest = new XMLHttpRequest();

function loadCountries() {
  request("all", onLoadCountries);
}

function request(params, onLoadContinuation) {    
    httpRequest.open("GET", encodeURI(`https://restcountries.com/v3.1/${params}`), true);
    httpRequest.responseType = "json";
    httpRequest.onload = onLoadContinuation;
    httpRequest.send();
}

function onLoadCountries() {
    if (httpRequest.status === 200) {
        showCountries(httpRequest.response
            .map(country => {
                return {
                    name: country.name.common,
                    flag: country.flags.svg
                };
            }));
    } else {
        alert("No hay conexión");
    }
}

function showCountries(countries) {
    const main = document.getElementById("countries");
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
        div.onclick = loadCountry;
        main.appendChild(div);
    }
}

function loadCountry(event) {    
    // current per a pillar la propietat name del div (qui té el handler del event)
    // no poso target pk akest podría ser algun dels descendents (h2 o img)
    request("name/" + event.currentTarget.name, onLoadCountry); 
}

function onLoadCountry() {
    if (httpRequest.status === 200) {
        showCountry(httpRequest.response[0]);
    } else {
        alert("No hay conexión");
    }
}

function showCountry(country) {
    const main = document.getElementById("countries");
    main.innerHTML = "";
    const ul = document.createElement("ul");
    main.appendChild(ul);
    ul.appendChild(generateItem("Nombre", country.name.common));
    ul.appendChild(generateItem("Región", country.region));
    ul.appendChild(generateItem("Subregión", country.subregion));
}

function generateItem(field, value) {
    const li = document.createElement("li");
    const text = document.createTextNode(`${field}: ${value}`);
    li.appendChild(text);
    return li;
}