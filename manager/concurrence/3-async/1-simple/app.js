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

async function main() {
    try {
        let country = await getCountryInfo("XXX");
        for (let key in country) {
            console.log(`${key}: ${country[key]}`);
        }
    } catch (err) {
        console.log("Error: " + err.message);
    };
}

main();
console.log("Petición realizada");