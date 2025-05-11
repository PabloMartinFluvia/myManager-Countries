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

async function getBordersInfo(code) {
  let country = await getCountryInfo(code);
  let bordersPromises = [];
  for (let code of country.borders) {
    bordersPromises.push(getCountryInfo(code));
  }
  return Promise.all(bordersPromises);
}


async function main() {
  try {
    let countries = await getBordersInfo("ESP");
    console.log(`Païses fronterizos:`)
    let accu = 0;
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      country.density = Number.parseFloat((country.population / country.area).toFixed(2));
      accu += country.density;
      showResume(country);
    }
    console.log(`La densidad media es de ${(accu / countries.length).toFixed(2)}  hab/km2\n`);
  } catch (err) {
    console.log("Error: " + err.message);
  };
}

function showResume(country, i) {
  console.log(`${i + 1}) ${country.name.common}:`);
  console.log(`\tPoblación: ${country.population} hab`);
  console.log(`\tTamaño: ${country.area} km2`);
  console.log(`\tDensidad: ${country.density} hab/km2\n`);
}

main();
console.log("Peticion realizada");
