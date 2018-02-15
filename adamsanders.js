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
var inputByteSize = fs.readSync(readFd, inputBuf, 0, inputBuf.length, 0);
var readChar = '', activeNum = '';


// Find frequent 1-itemsets, C1
for (i = 0; i < inputByteSize; i++) {
	readChar = String.fromCharCode(inputBuf.readUInt8(i));
	
	if (readChar == ' ' || readChar == '\n') {
		processTransaction(frequentItemsets.length - 1, activeNum);
		activeNum = '';
	}
	
	else
		activeNum += readChar;
}

pruneItemset(frequentItemsets.length - 1);


var singleItemsetArray = Object.entries(frequentItemsets[0]);
while (true) {
	let frequentArray = Object.entries(frequentItemsets[frequentItemsets.length - 1]), candidates = {};
	frequentItemsets.push({});
	
	for (i = 0; i < frequentArray.length; i++) {
		for (j = i + 1; j < singleItemsetArray.length; j++)
			candidates[`${frequentArray[i][0]} ${singleItemsetArray[j][0]}`] = 0;
	}
	
	// Find frequent k-itemsets, Ck
	for (set in candidates) {
		
		let activeLine = '', setArray = set.split(' ');
		for (i = 0; i < inputByteSize; i++) {
			readChar = String.fromCharCode(inputBuf.readUInt8(i));
			
			if (readChar == '\n') {
				if (setArray.every(cur => activeLine.indexOf(cur) >= 0))
					processTransaction(frequentItemsets.length - 1, set);
				
				activeLine = '';
			}
			
			else
				activeLine += readChar;
		}
	}
	
	pruneItemset(frequentItemsets.length - 1);
	
	if (Object.keys(frequentItemsets[frequentItemsets.length - 1]).length <= 1 || frequentItemsets.length > 5)
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