class Person {
    constructor(name, school, emoji) {
      this.name = name;
      this.school = school;
      this.favAnimal = emoji;
    }
    sayHello() {
      let helloStatement =
        "Hello, my name is " +
        this.name +
        ". I g" + "o t"+ "o " +
        this.school +
        (" an" + "d "+ "m"+"y" + " fa"+"vo"+"ur"+"ite" +" ani"+"ma"+"l" +" is"  + " a ") +
        this.favAnimal;
      console.log(helloStatement);
    }
  }
  
  const examplePerson = new Person("D"+"a"+"vi"+"d", "Un"+"ive"+"rsi"+"ty"+ " o"+"f " + "Ob"+"fus"+"cat"+"ion", "D"+"O"+"G"+"G"+"O");
  
  examplePerson.sayHello();
  
  