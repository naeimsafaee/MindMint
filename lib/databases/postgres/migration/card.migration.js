const { postgres } = require("../../index");
const cards = require("./card.js");

async function createCard() {
	let fResult;
	let fCards = [];
	console.log("================");

	for (const card of cards) {
		fCards.push({
			name: card.name,
			description: card.description,
			cardTypeId:
				card.category === "King"
					? 6
					: card.category === "Queen"
						? 5
						: card.category === "Bishop"
							? 4
							: card.category === "Knight"
								? 3
								: card.category === "Rook"
									? 2
									: card.category === "Pawn"
										? 1
										: null,
			image: [
				{
					key: `nfts/${card.edition}.png`,
					name: `${card.edition}.png`,
					location: `https://d2m7xaw3sumv0s.cloudfront.net/nfts/${card.edition}.png`,
				},
			],
			ipfsImage: card.image,
			tokenId: card.edition,
			attributes: card.attributes,
			leftAmount: 20,
			totalAmount: 20,
		});
	}

	try {
		fResult = await postgres.Card.bulkCreate(fCards);
	} catch (error) {
		console.log(error);
	}

	console.log("================ ", { cards: fResult.length });
}

module.exports = () => {
	createCard();
};
