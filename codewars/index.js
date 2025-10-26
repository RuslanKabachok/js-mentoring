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

function countPositivesSumNegatives(input) {

    let minor = 0;
    let major = 0;

    if (!input || input.length === 0) {
        return []
    }

    for (let i = 0; i < input.length; i++) {
        const element = input[i];

        if (element > 0) {
            major += 1;
        } else if (element < 0) {
            minor += element;
        }

    }
    return [major, minor];
}

function countBy(x, n) {
    let z = [];

    for (let i = 1; i <= n; i++) {
        z.push(i * x)
    }

    return z;
}

function doubleChar(str) {
    return str.split('').map(char => char += char).join('');
}

function opposite(number) {
    if (number > 0) {
        return number * -1;
    } else {
        return -number;
    }
}

function validatePIN(pin) {
    const result = pin.split('').every(char => char >= '0' && char <= '9');

    return (pin.length === 4 || pin.length === 6) && result;
}

const makeUpperCase = str => str.toUpperCase();

const invert = (arr) => {
    return arr.map(num => -num);
}

const feast = (beast, dish) => {
    return beast.charAt(0) === dish.charAt(0) && beast.charAt(beast.length - 1) === dish.charAt(dish.length - 1);
};

const reverseWords = (str) => {
    return str.split(' ').map(word => word === '' ? word : word.split('').reverse().join('')).join(' ');
}

const descendingOrder = (number) => {
    return Number(number.toString().split('').sort((a, b) => b - a).join(''));
}

const sumTwoSmallestNumbers = (numbers) => {
    const sorted = numbers.sort((a, b) => a - b);
    return sorted[0] + sorted[1];
}

const findShort = (str) => {
    const result = str.split(' ').map(w => w.length);
    return Math.min(...result);
}

const hero = (bullets, dragons) => {
    return bullets >= dragons * 2;
}

const makeNegative = (num) => {
    return num > 0 ? -num : num;
}

const correct = (str) => {
    return str.replaceAll('5', 'S').replaceAll('0', 'O').replaceAll('1', 'I');
}

const isPalindrome = (str) => {
    const normalized = str.toLowerCase();
    const reversed = normalized.split('').reverse().join('');
    return normalized === reversed;
};

const otherAngle = (a, b) => 180 - (a + b);
const getGrade = (s1, s2, s3) => {

    const average = (s1 + s2 + s3) / 3;

    if (average <= 100 && average >= 90) {
        return 'A'
    } else if (average < 90 && average >= 80) {
        return 'B'
    } else if (average < 80 && average >= 70) {
        return 'C'
    } else if (average < 70 && average >= 60) {
        return 'D'
    } else {
        return 'F'
    }
}

const strCount = (str, letter) => {
    let alreadySeen = 0;

    for (let i = 0; i < str.length; i++) {
        const element = str[i];

        if (element === letter) {
            alreadySeen += 1;
        }
    }

    return alreadySeen;
}

const isValidWalk = (walk) => {
    if (walk.length !== 10) return false;

    let x = 0, y = 0;

    walk.forEach(dir => {
        if (dir === 'n') y++;
        if (dir === 's') y--;
        if (dir === 'e') x++;
        if (dir === 'w') x--;
    });

    return x === 0 && y === 0;
}

const towerBuilder = (nFloors) => {
    const tower = [];

    for (let i = 1; i <= nFloors; i++) {

        const spaces = nFloors - i;

        const stars = 2 * i - 1;

        const floor = ' '.repeat(spaces) + '*'.repeat(stars) + ' '.repeat(spaces);

        tower.push(floor);
    }

    return tower;
}