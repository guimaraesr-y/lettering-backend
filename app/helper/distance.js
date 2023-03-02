export function getDistanceBetweenPoints(geolocation1, geolocation2, unit='kilometers') {
    // formata coordenadas
    const [latitude1, longitude1] =  geolocation1.split(" ").map(n => parseFloat(n));
    const [latitude2, longitude2] =  geolocation2.split(" ").map(n => parseFloat(n));

    let theta = longitude1 - longitude2;
    let distance = 60 * 1.1515 * (180/Math.PI) * Math.acos(
        Math.sin(latitude1 * (Math.PI/180)) * Math.sin(latitude2 * (Math.PI/180)) + 
        Math.cos(latitude1 * (Math.PI/180)) * Math.cos(latitude2 * (Math.PI/180)) * Math.cos(theta * (Math.PI/180))
    );
    if (unit == 'miles') {
        return Math.round(distance, 2);
    } else if (unit == 'kilometers') {
        return Math.round(distance * 1.609344, 2);
    }
}

// timeToArrime: retorna o tempo em minutos
export function calcTimeToArrive(distance) {
    // (número de vezes que passou pela distancia de 125km) * (15 minutos)
    let timesMultiply = (Math.floor(distance / 125)+1) * 15;
    return { timeToArrive: timesMultiply, timestamp: new Date().setMinutes(new Date().getMinutes()+timesMultiply) }
}

export function varyCoordinates(coord) {
    return coord.split(" ").map(n => {
        if(Math.random()>.5) return n + getRandomArbitrary(0.01, 0.055);
        else return n - getRandomArbitrary(0.01, 0.055);
    }).join(" ")
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}