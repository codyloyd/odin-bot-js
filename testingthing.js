var conditions = {
  one: {
    condition: "one",
    response: thisIsAFunction
  },
  two: {
    condition: /thr/,
    response: function(){
      console.log("condition two met")
    }
  },
  three: {
    condition: /three/,
    response: function(){
      var int = parseInt(Math.random() * 10)
      console.log(`here's a random number: ${int}`)
    }
  }
}

var input = "one"

for (var i in conditions) {
  if (input.match(conditions[i].condition)){
    conditions[i].response("hello")
  }
}

function thisIsAFunction(a) {
  console.log(a + a)
}
