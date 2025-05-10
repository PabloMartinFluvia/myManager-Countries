import * as https from 'https';

getCountryInfo("ESP", showErrorOrCountry);
console.log("Petición 1 realizada");
console.log("---");
getCountryInfo("XXX", showErrorOrCountry);
console.log("Petición 2 realizada");
console.log("---");

getCountryInfo("FRA", showDensityCountryOrError);
console.log("Petición 3 realizada");
console.log("---");
getCountryInfo("YYY", showDensityCountryOrError);
console.log("Petición 4 realizada");
console.log("---");

function getCountryInfo(code, continuation) {
  const url = `https://restcountries.com/v3.1/alpha/${code}`;
  https
    .get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        if (resp.statusCode === 404){
          continuation(new Error("País no encontrado"));
        } else {
          let country = JSON.parse(data)[0];
          continuation(undefined, country);
        }
      });
    })
    .on("error", (err) => {
      continuation(err);
    });
}

function showErrorOrCountry(err, country) {
  if (err !== undefined) {
    console.log("Error: " + err.message);
  } else {
    for (let property in country) {
      console.log(`${property}: ${country[property]}`);
    }    
  }
  console.log(`\n`);
}

function showDensityCountryOrError(error, country) {
  if(!error) {
    const population = country.population;
    const area = country.area;
    console.log(`Población: ${population}`);
    console.log(`Tamaño: ${area}`);    
    console.log(`Densidad: ${(population/area).toFixed(2)} hab/km2`);
  } else {
    console.log(`Error: ${error.message}`);
  }
  console.log(`\n`);
}
