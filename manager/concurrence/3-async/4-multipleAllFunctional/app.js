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
    return Promise.all(country.borders.map(code => getCountryInfo(code)));
}

async function main() {
    try {
        /*
         La función llamada puede elevar una exception (cuando no se puede obtener el país).
         La promesa obtenida (Promise.all(...)) también puede elevar una excepción (si alguna no fullfill);     
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
