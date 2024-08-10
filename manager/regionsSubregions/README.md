# RegionsSubregions

A partir de la tabla de [regiones](../data/regions.js) y de [subregiones](../data/subregions.js) mostrar las regiones con sus subregiones sin duplicar ningún dato.

~~~
Americas:
        South America
        Caribbean
        North America
        Central America
Africa:
        Western Africa
        Eastern Africa
        Northern Africa
        Southern Africa
        Middle Africa
Oceania:
        Micronesia
        Polynesia
        Melanesia
        Australia and New Zealand
Asia:
        Western Asia
        South-Eastern Asia
        Eastern Asia
        Southern Asia
        Central Asia
Antarctic:
Europe:
        Central Europe
        Northern Europe
        Eastern Europe
        Southern Europe
        Southeast Europe
        Western Europe
~~~

- [v0.arrays.vME.v0 ](./v0.arrays/vME/v0/app.js) Problemas: 
  - quizás a alguien le cueste entender la estructura de los datos 
    * conjunto de objetos región, con 2 propiedades: nombre y conjunto de los nombres de las subregiones ->
    * RESULT = [ [region1, [subregion11, subregion12, etc...]] , [region2, [subregion21, subregion22, etc...]], etc... ];
  - en la línia 511-512 se saca partido de que && es 'lazy' (si no el programa se rompe), y quizás alguien lo toque sin darse cuenta ...
- [v0.arrays.vME.v1  ](./v0.arrays/vME/v1/app.js) Discusión: 
  - alguien podría considerar que los ifs (513 y 523) son poco claros:
    - se ejecutan las instrucciones cuando proceso iterativo previo no ha encontrado el valor, pero condición escrita al estilo 'indice fuera del array donde buscar'
    - se asigna el valor en la última posición, pero no es obvio leyendo el indice empleado
  - el while para obtener el indice con el que indexar los 2 nuevos arrays (necesario en linia 518) es discutible.
- [v0.arrays.vME.v2  ](./v0.arrays/vME/v2/app.js) Discusión: 
  - alguien muy purista podría considerar que emplear en fors condiciones con breaks encubiertos, como alternativa a whiles, es una chapuza (511 y 525).
  - las variables booleanas, empleadas como breaks encubiertos, para saber si se ha encontrado o no, augmentan mucho la legibilidad de las condiciones de los ifs (517 y 527). Pero su uso en la búsqueda de las regiones es bastante discutible:
    - Contras: su uso en la primera búsqueda implica redundancia en la información calculada, ya que la información de si se ha encontrado o no se podría deducir según el estado del índice (y su presencia es imprescindible para indexar el array de subregiones). Y el uso de ambos obliga a assignar valores al índice de una manera un poco 'rara'.
    - Pros: mayor simplicidad al tener 2 estrcturas de instrucciones similares (mismo criterio) en las 2 búsquedas. Y eliminar el uso de los booleanos, manteniendo los fors, implicaría duplicar código (en la condición de !encontrado del for y en la condificón de !encontrado del if).

- Conclusión: 
  - tanto en v1 como en v2 hay homogeneidad de criterio y no hay código duplicado.
  - El v1 es más simple: menos variables a recordar, menos niveles de anidación, menos sentencias a ejecutar, menos linias de código.
  - El v2 es más legible: las condiciones se leen com mayor facilidad y los bucles són más 'típicos'.
  - Ambos me parecen acceptables, y no veo un claro favorito. Pero personalmente prefiero el v1 (quiero trabajar con un indice compartido entre 2 arrays && quiero homogeneidad de criterio -> los for no lo ponen fácil, mejor un while -> poner las condiciones de los ifs lo más legibles posibles SIN duplicar código). 

  - [v0.arrays.vME.v3  ](./v0.arrays/vME/v3/app.js). Todo con fors + primera iteración sin redundancia de información ni ducplicación de código + misma homogeneidad de criterio. Precio: la comprensión de las condiciones de los ifs no es obvia (aunque se puede entender facilmente.)
    