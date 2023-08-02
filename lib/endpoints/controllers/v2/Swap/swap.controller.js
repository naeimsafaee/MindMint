const { postgres } = require("../../../../databases");
const { fee } = require("../../../../services/swap.service");

exports.index = async (req, res) => {
    //I need userId here

    // const cardTypeSwap = await postgres.CardType.findAll({
    //     where: {name: {[postgres.Op.ne]: "Ghost"}},
    //     include: [{
    //         model: postgres.Card,
    //         required: true,
    //         include: [{
    //             model: postgres.AssignedCard,
    //             where: {userId: req.userEntity.id},
    //             required: true
    //         }]
    //     }],
    // });

    const cardTypeSwap = await postgres.Card.findAll({
        include: [
            {
                model: postgres.CardType,
                where: { name: { [postgres.Op.ne]: "Ghost" } },
                required: true
            },
            {
                model: postgres.AssignedCard,
                where: { userId: req.userEntity.id },
                required: true
            }
        ]
    });

    let amount = 0;

    for (let i = 0; i < cardTypeSwap.length; i++) {
        const cardTypee = await postgres.CardType.findOne({ where: { id: cardTypeSwap[i].cardTypeId } });

        const userCameraLevel = await postgres.UserAttribute.findOne({
            where: {
                userId: req.userEntity.id,
                cardId: cardTypeSwap[i].id
            },
            include: [{
                model: postgres.Attribute,
                where: {name: "LEVEL"},
                required: true
            }]
        });

        amount += parseFloat(cardTypee.swapLimit);
        if(userCameraLevel){
            const level = Math.floor(userCameraLevel.amount);
            amount += level * 100;
        }

    }

    const swaps = await postgres.Settings.findAll({
        where: {
            type: "SWAP"
        }
    });

    const result = [];
    for (let i = 0; i < swaps.length; i++) {
        const swap = swaps[i];

        const pairs = swap.key.split("->");

        const from_token = await postgres.Asset.findOne({
            where: {
                coin: pairs[0]
            },
            attributes: ["id", "coin", "name", "icon"]
        });

        const to_token = await postgres.Asset.findOne({
            where: {
                coin: pairs[1]
            },
            attributes: ["id", "coin", "name", "icon"]
        });

        if (!from_token || !to_token) continue;

        const feeAmount = await fee({ fromTokenId: from_token.id, toTokenId: to_token.id }, req.userEntity.id);

        const configs = swap.value.split("-");

        let config = [];
        for (let j = 0; j < configs.length; j++) {
            let temp = configs[j].split("=");
            if (temp[0] === "max" && from_token.coin === "STL") {
                config.push({
                    action: temp[0],
                    value: amount
                });
            } else {
                config.push({
                    action: temp[0],
                    value: temp[1]
                });
            }
        }

        result.push({
            from_token: from_token,
            to_token: to_token,
            fee: parseFloat(feeAmount),
            config: config
        });
    }

    if (req.userEntity.id == 828 || req.userEntity.id == 1756) {
        const from_token = await postgres.Asset.findOne({
            where: {
                coin: "BUSD"
            },
            attributes: ["id", "coin", "name", "icon"]
        });

        const to_token = await postgres.Asset.findOne({
            where: {
                coin: "STL"
            },
            attributes: ["id", "coin", "name", "icon"]
        });

        result.push({
            from_token: from_token,
            to_token: to_token,
            fee: 0,
            config: [
                {
                    action: "min",
                    value: "1"
                },
                {
                    action: "max",
                    value: "10000000000"
                },
                {
                    action: "fee",
                    value: "0"
                },
                {
                    action: "chainId",
                    value: "56"
                }
            ]
        });
    }

    return res.send({
        data: result
    });
};
