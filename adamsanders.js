//THIS CODE IS MY OWN WORK, IT WAS WRITTEN WITHOUT CONSULTING A TUTOR OR CODE WRITTEN BY OTHER STUDENTS - Adam Sanders

var fs = require('fs');

if (process.argv.length < 5) {
	console.log("\nPlease input three parameters: 1) name of dataset, 2) threshold minimum, and 3) name of the output file\n\n");
	return;
}

// Helper functions
const processTransaction = (index, item) => {
	if (item)
		frequentItemsets[index][item] = frequentItemsets[index][item]+1 || 1;
}

const pruneItemset = i => {
	for (itemset in frequentItemsets[i]) {
		if (frequentItemsets[i][itemset] < process.argv[3])
			delete frequentItemsets[i][itemset];
	}
}

const startTime = new Date();
var frequentItemsets = [{}];

const readFd = fs.openSync(process.argv[2], 'r');
const writeFd = fs.openSync(process.argv[4], 'w');

const statResult = fs.fstatSync(readFd);

var inputBuf = Buffer.alloc(statResult.size);
var bytesRead = fs.readSync(readFd, inputBuf, 0, inputBuf.length, 0);
var readChar = '', activeNum = '';


// Find frequent 1-itemsets, C1
for (i = 0; i < bytesRead; i++) {
	readChar = String.fromCharCode(inputBuf.readUInt8(i));
	
	if (readChar == ' ' || readChar == '\n') {
		processTransaction(frequentItemsets.length - 1, activeNum);
		activeNum = '';
	}
	
	else
		activeNum += readChar;
}

pruneItemset(frequentItemsets.length - 1);


while (false) {
	let frequentArray = Object.entries(frequentItemsets[frequentItemsets.length - 1]);
	for (i = 0; i < frequentArray.length; i++) {
		for (j = i+1; j < frequentArray.length; j++) {
			processTransaction(`${frequentArray[i][0]} ${frequentArray[j][0]}`);
		}
	}
	
	//pruneItemset();
	break;
}


// Write frequent itemsets to output file
var formattedString;
frequentItemsets.forEach(set => {
	
	for (itemset in set) {
		
		formattedString = itemset + ' (' + set[itemset] + ')\n';
		fs.writeSync(writeFd, formattedString);
	}
});

var endTime = new Date();
console.log('Apriori completed in', endTime - startTime, 'milliseconds');
fs.closeSync(readFd);
fs.closeSync(writeFd);