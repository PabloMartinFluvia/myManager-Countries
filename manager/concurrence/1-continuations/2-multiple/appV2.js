import * as https from 'https';

getBordersInfo('FRA', showCountriesDensityOrError);

function getBordersInfo(code, continuation) {

    getCountryInfo(code, evalCountryOrError);

    function evalCountryOrError(country, error) {
        if (!error) {
            const bordersCodes = country.borders;
            requestBorders(bordersCodes);
        } else {
            continuation(undefined, error);
        }
    }

    function requestBorders(bordersCodes) {
        let bordersCountries = [];
        let ok = true;
        for (let code of bordersCodes) {
            getCountryInfo(code, evalBorderCountryOrError);
        }

        function evalBorderCountryOrError(borderCountry, error) {
            if (ok) {
                if (!error) {
                    bordersCountries.push(borderCountry);
                    if (bordersCountries.length === bordersCodes.length) {
                        continuation(bordersCountries);
                    }
                } else {
                    ok = false;
                    continuation(undefined, error);
                }
            }
        }
    }
}

function getCountryInfo(code, continuation) {
    const url = `https://restcountries.com/v3.1/alpha/${code}`;
    https
        .get(url, evalResponse)
        .on('error', evalError);

    function evalResponse(resp) {
        let data = '';
        resp
            .on('data', evalChunk)
            .on('end', finish);

        function evalChunk(chunk) {
            data += chunk;
        }

        function finish() {
            if (resp.statusCode !== 404) {
                const country = JSON.parse(data)[0];
                continuation(country);
            } else {
                continuation(undefined, new Error(`País con código ${code} no encontrado`));
            }
        }

    }

    function evalError(error) {
        continuation(undefined, error);
    }
}

function showCountriesDensityOrError(countries, error) {
    if (!error) {
        console.log(`Païses fronterizos:`)
        for (let i = 0; i < countries.length; i++) {
            const country = countries[i];
            console.log(`${i + 1}) ${country.name.common}:`);
            showDensity(country);
        }
    } else {
        console.log(`Error: ${error.message}\n`);
    }
}

function showDensity(country) {
    const population = country.population;
    console.log(`\tPoblación: ${population} hab`);
    const area = country.area;
    console.log(`\tTamaño: ${area} km2`);
    console.log(`\tDensidad: ${(population / area).toFixed(2)} hab/km2\n`);
}