import * as https from 'https';

getBordersInfo("ESP")
    .then(borderCountries => {
        for (let country of borderCountries) {
            showCountry(country);
        }
    })
    .catch(err => {
        console.log("Error: " + err.message);
    });
console.log("Peticion realizada");

function getBordersInfo(code) {
    return new Promise((resolve, reject) => {
        getCountryInfo(code)
            .then(country => {
                let globalErr = false;
                let borders = [];
                for (let code of country.borders) {
                    getCountryInfo(code)
                        .then(countryBorder => {
                            if (!globalErr) {
                                borders.push(countryBorder);
                                if (borders.length === country.borders.length) {
                                    resolve(borders);
                                }
                            }
                        })
                        .catch(err => {
                            if (!globalErr) {
                                globalErr = true;
                                reject(err);
                            }
                        });
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getCountryInfo(code) {
    return new Promise((resolve, reject) => {
        const url = `https://restcountries.com/v3.1/alpha/${code}`;        
        https.get(url, (resp) => {
            let data = '';
            resp
                .on('data', (chunk) => {
                    data += chunk;
                })
                .on('end', () => {
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
