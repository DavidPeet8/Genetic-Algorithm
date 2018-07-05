//author: David Peet
//github: davidpeet8
//Title: Genetic algorithm test

var maxPop = 700;
var mutationRate = 0.01;
var target = "mom says hi"
var bestPhrase = "";
var bestFit = 0;
var genNum = 1;

var totPopulation = [maxPop];
var bDone = false;

var population = new Population(maxPop, target, mutationRate);
var interval = setInterval(refresh, 100);

for(var i = 0; i < maxPop; i++){
	totPopulation[i] = new DNA();
}

//-------------------MAIN STEPTHROUGH------------------------
population.CreateInitPopulation();


//----------------HOME BREW FUCNTIONS-------------------------
//refresh onscreen values
function refresh(){
	update();
	document.getElementById("TargetPhrase").innerHTML = "Target Phrase: " + target;
	document.getElementById("GenNum").innerHTML = "Generation: " + genNum;
	document.getElementById("MutationRate").innerHTML = "Mutation Rate: " + mutationRate;

	document.getElementById("CurrentBest").innerText = "Current Best Fit: ".concat(bestPhrase);
	document.getElementById("CurrentPopulation").innerText = prettyPrint(totPopulation); 
	//no idea why, use inner text not inner HTML, prob a tag mistakenly appeared
}

function update(){
	DNA.cross(totPopulation, DNA.newFitnessPop(totPopulation));//cross form new population
	DNA.mutate(totPopulation);//mutate population
	if(bDone == true){//fitness check
		clearInterval(interval);
	}
	genNum++;
}

//population class
function Population(maxPop, target, mutationRate){
	this.maxPop = maxPop;
	this.target = target;
	this.mutationRate = mutationRate;

	this.CreateInitPopulation = function(){
		//create random strings of length target.length
		//use ASCII tabel decimal, 32-126
		for (var o = 0; o < maxPop; o++){
			for(var i = 0; i < target.length; i++){
				totPopulation[o].genes[i] = String.fromCharCode(Math.floor(Math.random() * 94) + 32);
			}
		}
	}
}

function DNA(){
	this.genes = [];
	this.getString = function(){
		return this.genes.join("");
	}

	this.fitness = function(target){
		var Fit = 0;
		for(var i = 0; i < target.length; i++){
			if(this.genes[i] == target.charAt(i)){
				Fit++;
			}
		}
		if(Fit > bestFit){
			bestFit = Fit;
			bestPhrase = this.getString();
		}
		if(Fit == target.length){
			bDone = true;
		}
		//console.log(Math.floor(Fit/target.length*100));
		return Math.floor(Fit/target.length*100);
	}
}

DNA.newFitnessPop = function(Population){
	var newPop;
	newPop = [];
	//find fitness, then enter into newPop array fitness floored # of times 

	for(var i = 0; i < Population.length; i++){
		for (var e = 0; e < Population[i].fitness(target); e++){
			newPop.push(Population[i]);
		}
	}
	return newPop;
}

DNA.cross = function(Population, newPop){
	var index, newGenes, midpoint;
	midpoint = Math.floor(Math.random() * target.length);	

	for (var i = 0; i < Population.length; i++){
		index1 = Math.floor(Math.random() * newPop.length);
		index2 = Math.floor(Math.random() * newPop.length);

		newGenes = newPop[index1].genes.slice(0, midpoint).concat(
			newPop[index2].genes.slice(midpoint, newPop[index2].genes.length));
		totPopulation[i].genes = newGenes;
	}
}	

DNA.mutate = function(Population){
	for(var i = 0; i < Population.length; i++){
		for (var e = 0; e < Population[i].genes.length; e++){
			if(Math.random() <= mutationRate){
				Population[i].genes[e] = String.fromCharCode(Math.floor(Math.random() * 94) + 32);
			}
		}
	}
}


//fomat array to one entery per line
function prettyPrint(arDNA){
	var prettyString = "";
	for (var i = 0; i < arDNA.length; i++){
		prettyString = prettyString.concat("\n", arDNA[i].getString());
	}

	return prettyString;
}

