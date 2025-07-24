// This is the string array lookup table.
var _0xcd45 = [
    "name",
    "school",
    "favAnimal",
    "Hello, my name is ",
    ". I go to ",
    " and my favourite animal is a ",
    "log",
    "David",
    "University of Obfuscation",
    "Penguin",
    "sayHello",
  ], _0xcd46 = [
    "name",
    "school",
    "favAnimal",
    "Hello, my name is ",
    ". I go to ",
    " and my favourite animal is a ",
    "log",
    "David",
    "University of Obfuscation",
    "Penguin",
    "sayHello",
  ];;
  class Person {
    constructor(name, school, animal) {
      // Member expression properties obfuscated using this technique
      this[_0xcd45[0]] = name;
      this[_0xcd45[1]] = school;
      this[_0xcd45[2]] = animal;
    }
    sayHello() {
      let helloStatement =
        _0xcd45[3] +
        this[_0xcd45[0]] +
        _0xcd45[4] +
        this[_0xcd45[1]] +
        _0xcd45[5] +
        this[_0xcd45[2]];
      console[_0xcd45[6]](helloStatement);
    }
  }
  const examplePerson = new Person(_0xcd46[7], _0xcd46[8], _0xcd46[9]);// Obfuscation of string arguments using this technique
  examplePerson[_0xcd46[10]](); // Member expression property obfuscated using this technique
  
  