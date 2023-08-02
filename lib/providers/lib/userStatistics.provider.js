/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Sun Mar 27 2022
| Time   : 4:54:02 PM
 */

const hooks = require("../../hooks");
const { statisticService } = require("../../services");
const { events } = require("../../data/constans");

 hooks.register(events.wizard.add, "after", statisticService.wizardAddCardsCount, 2);

 hooks.register(events.referral.add, "after", statisticService.referralAddCards, 2);

 hooks.register(events.referral.addReferralCount, "after", statisticService.referralAddCount, 2);

