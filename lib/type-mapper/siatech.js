/*
Copyright (C) 2017 BikBikBikBikBik

This file is part of blocke.

blocke is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

blocke is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with blocke.  If not, see <http://www.gnu.org/licenses/>.
*/
const { Block, Network, Transaction } = require('./models');
const resources = require('./resources');
const _ = require('underscore');

const oneSiacoin = 1000000000000000000000000;

function createTransactionEntry(inputOrOutput) {
	const amount = parseFloat(inputOrOutput.value);
	
	return {
		address: inputOrOutput.unlockhash,
		amount: formatAmountForDisplay(amount)
	};
}

const formatAmountForDisplay = (amount) => amount >= oneSiacoin ? amount / oneSiacoin : 'dust';

class SiaTechTypeMapper {
	mapAccount() {
		throw new Error(resources.operationNotSupportedMessage);
	}
	
	mapBlock(block) {
		return new Block(parseFloat(block.difficulty), block.blockid, block.height, new Date(block.maturitytimestamp * 1000), block.transactions.length);
	}
	
	mapNetworkInfo(network) {
		return new Network(parseFloat(network.difficulty), parseFloat(network.estimatedhashrate), network.height, new Date(network.maturitytimestamp * 1000));
	}
	
	mapTransaction(transaction) {
		const tx = transaction.transaction;
		
		return new Transaction(formatAmountForDisplay(_.reduce(tx.siacoininputoutputs, (total, input) => total + parseFloat(input.value), 0)), tx.parent, tx.id,
			_.map(tx.rawtransaction.siacoinoutputs, createTransactionEntry), _.map(tx.siacoininputoutputs, createTransactionEntry));
	}
}

module.exports = new SiaTechTypeMapper();