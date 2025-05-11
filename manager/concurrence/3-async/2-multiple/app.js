import * as https from 'https';

function getCountryInfo(code) {
  return new Promise((resolve, reject) => {
    const url = `https://restcountries.com/v3.1/alpha/${code}`;
    https.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        if (resp.statusCode !== 404) {
                    const country = JSON.parse(data)[0];
                    resolve(country);
                } else {
                    reject(new Error(`País con código ${code} no encontrado`));
                }
      });

    }).on("error", (err) => {
      reject(err);
    });
  });
}

function showCountry(country) {
  for (let key in country) {
      console.log(`${key}: ${country[key]}`);
    }
    console.log(`\n`);
}

async function getBordersInfo(code) {    
  let country = await getCountryInfo(code);
  let borders = [];
  for (let code of country.borders) {
    // Bloquejar esperant la resposta de cada veí -> CACA
    let countryBorder = await getCountryInfo(code);
    borders.push(countryBorder);
  }
  return borders;
  /*para estas promesas no hacen falta capturar el error, ya que 
    en caso de error elevan una excepción, que se captura por parte del cliente de esta función
  */
}

async function main() {
  try {
    /*
     Expresion (función) No devuelve una promesa -> ResolvedPromise. 
     La función llamada puede elevar una exception.
     Como la función és asíncrona 
        -> se ejecuta en un nuevo flujo de control de ejecución
        -> hay que esperar a que termine (si no se seguiría ejecutando el 'for' sin tener los países)
    */
    let countries = await getBordersInfo("ESP");  
    for (let country of countries) {
      showCountry(country);
    }
  } catch (err) {
    console.log("Error: " + err.message);
  };
}

main();
console.log("Peticion realizada");
