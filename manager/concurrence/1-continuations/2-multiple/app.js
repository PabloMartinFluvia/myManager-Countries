import * as https from 'https';

getBordersInfo("ESP", showErrorOrCountries)
console.log("Peticion realizada");
console.log("---");

function getBordersInfo(code, callback) {
  getCountryInfo(code, function (err, country) {
    if (err) {
      callback(err);
    } else {
      let globalErr = false;
      let borders = [];
      for (let code of country.borders) {
        getCountryInfo(code, function (err2, countryBorder) {
          if (err2) {
            callback(err2);
            globalErr = true;
          } else {
            if (!globalErr) {
              borders.push(countryBorder);
              if (borders.length === country.borders.length) {
                callback(undefined, borders);
              }
            }
          }
        });
      }
    }
  });
}

function getCountryInfo(code, callback) {
  const url = `https://restcountries.com/v3.1/alpha/${code}`;
  console.log(url);
  https
    .get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        if (resp.statusCode === 404){
          continuation(new Error("País no encontrado"));
        } else {
          let country = JSON.parse(data)[0];
          continuation(undefined, country);
        }
      });

    })
    .on("error", (err) => {
      callback(err);
    });
}


function showErrorOrCountries(err, countries) {
  if (!err) {
    for (let country of countries) {
      showErrorOrCountry(null, country);
    }
  } else {
    console.log("Error: " + err.message);
  }
}

function showErrorOrCountry(err, country) {
  if (err) {
    console.log("Error: " + err.message);
  } else {
    for (let key in country) {
      console.log(`${key}: ${country[key]}`);
    }
    console.log(`\n`);
  }
}

