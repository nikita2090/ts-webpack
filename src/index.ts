import './css/styles.scss';
import json from './assets/a.json';

interface User {
    name: string,
    age: number,
    getPass(): void,
}

const user: User = {
    name: 'Nick',
    age: 29,
    getPass() {
        alert(`${this.name}${this.age}`);
    },
};

async function start() {
    const a = await Promise.resolve('async is working');
    return a;
}

start().then(console.log);

class Util {
    static date = Date.now();
}

console.log(json);
console.log(35435);
console.log(Util.date);
user.getPass();
