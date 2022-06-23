#!/usr/bin/env node
const gls = require("glstools");
const files = gls.files;

let lastnames;
let firstnames;
let streets;
let cities;
let states;
let zipcodes;
let words;

function allToCapital(s) {
    let words = s.split(" ");
    return words.map(word => toCapital(word)).join(" ");
}
function toCapital(word) {
    let arr = word.split("")
    if (arr.length === 0) return "";
    return arr[0].toUpperCase() + arr.slice(1).join("").toLowerCase();
}
function head(list, n = 10) {
    for (let l of list.slice(0, n)) {
        console.log(l);
    }
    // console.log(list.length);
    // console.log("");
}

function strip(list, key) {
    return list.filter(i => i[key]).map(i => i[key]);
}
function strip2(list, key, other) {
    return list.filter(i => i[key]).map(i => (i[key] + "," + i[other]));
}

function sortUnique(list) {
    return [...new Set(list)].sort()
}

function rnd(list) {
    let n = gls.maths.random(0, list.length-1);
    let s = list[n] || "";
    return gls.strings.replaceAll(s, ",", " ").trim();
}

function rndNumber(lo, hi) {
    let n = gls.maths.random(lo, hi);
    return n.toString();
}
function rndPhone() {
    let area = rndNumber(1,9)+rndNumber(0,9)+rndNumber(0,9);
    let exch = rndNumber(1,9)+rndNumber(0,9)+rndNumber(0,9);
    let numb = rndNumber(1,9)+rndNumber(0,9)+rndNumber(0,9)+rndNumber(0,9);
    return `${area}-${exch}-${numb}`;
}
function randomAddress() {
    let fname = rnd(firstnames);
    let lname = rnd(lastnames);
    let street = rnd(streets);
    let city = rnd(cities);
    let state = rnd(states);
    let zip = rnd(zipcodes);
    let phone = rndPhone();
    let email=fname+"."+lname+"@gmail.com";
    let nickname = fname+"."+lname;
    let title = rnd(["Developer", "Writer", "Workshop Leader", "Friend", "Mother", "Father"]);
    return [fname, lname, nickname, email, title, phone, street, city, state, zip].join(",");
}

function main() {
    // console.log(process.argv)
    let n = process.argv[2] || 10;

    lastnames = files.readCSV("./data/Names_2010Census_Top1000.csv");
    let allnames = files.readCSV("./data/firstnames.csv");
    zipcodes = files.readCSV("./data/ZIP_Locale_Detail.csv");
    words = sortUnique(files.readList("./data/scrabble_dictionary.txt").map(i => i.toLowerCase()));

    lastnames = sortUnique(strip(lastnames, "SURNAME")).map(name => toCapital(name));
    let malenames = strip(allnames, "Male-Name");
    let femalenames = strip(allnames, "Female-Name");
    firstnames = sortUnique(malenames.concat(femalenames)).map(name => toCapital(name));

    cities = sortUnique(strip(zipcodes, "PHYSICAL CITY")).map(name => allToCapital(name));
    states = sortUnique(strip(zipcodes, "PHYSICAL STATE")).map(name => name.toUpperCase());
    streets = sortUnique(strip(zipcodes, "PHYSICAL DELV ADDR")).map(name => allToCapital(name));
    zipcodes = sortUnique(strip(zipcodes, "PHYSICAL ZIP"));

    // head(lastnames);
    // head(firstnames);
    // head(streets);
    // head(cities);
    // head(states);
    // head(zipcodes);
    // head(words);

    console.log("fname, lname, nickname, email, title, phone, street, city, state, zip".split(", ").join(","));
    for (i = 0; i < n; i++) {
        console.log(randomAddress());
    }
}

main();
