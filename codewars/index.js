function bmi(weight, height) {

    let bmi = weight / height ** 2;

    if (bmi <= 18.5) {
        return 'Underweight'
    } else if (bmi <= 25.0) {
        return 'Normal'
    } else if (bmi <= 30.0) {
        return 'Overweight'
    } else {
        return "Obese"
    }
}

function century(year) {
    const result = year % 100;
    let century = Math.floor(year / 100);

    if (result > 0) {
        return century + 1;
    } else {
        return century;
    }
}

function smash(words) {
    return words.join(' ').trim();
};

function lovefunc(flower1, flower2) {

    const timmy = flower1 % 2;
    const sarah = flower2 % 2;

    if (timmy === 0 && sarah === 0) {
        return false
    } else if (timmy === 1 && sarah === 1) {
        return false
    } else { return true }
}

function fakeBin(x) {
    let result = '';

    for (let i = 0; i < x.length; i++) {
        const element = x[i];

        if (element < 5) {
            result += '0'
        } else {
            result += '1'
        }
    }
    return result;
}

function boolToWord(bool) {
    return bool ? "Yes" : "No"
}

function summation(num) {
    let result = 0;

    for (let i = 1; i <= num; i++) {
        result += i;
    }
    return result;
}

function findAverage(array) {

    if (array.length == 0) {
        return 0;
    }

    let sum = 0;

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        sum += element;
    }

    return sum / array.length;
}

function litres(time) {
    return Math.floor(time * 0.5);
}

Object.defineProperty(
    String.prototype,
    'toJadenCase',
    {
        value:
            function toJadenCase() {
                return this;
            }
    }
);

String.prototype.toJadenCase = function () {
    const words = this.split(' ');

    const capitalized = words.map(word => {
        return word[0].toUpperCase() + word.slice(1);
    });

    return capitalized.join(' ');
};

function betterThanAverage(classPoints, yourPoints) {
    let sum = 0;

    for (let i = 0; i < classPoints.length; i++) {
        sum += classPoints[i];
    }

    sum += yourPoints;

    const average = sum / (classPoints.length + 1);

    return yourPoints > average;
}

const rps = (p1, p2) => {
};

function rps(p1, p2) {

    if (p1 === p2) {
        return "Draw!";
    }

    if ((p1 === "rock" && p2 === 'scissors') ||
        (p1 === "scissors" && p2 === 'paper') ||
        (p1 === "paper" && p2 === "rock")) {
        return "Player 1 won!";
    }

    return "Player 2 won!";
}