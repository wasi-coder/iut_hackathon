const api = require("../services/api");

function formatNumber(value) {
	const numericValue = Number(value || 0);
	return Number.isInteger(numericValue)
		? String(numericValue)
		: numericValue.toFixed(2).replace(/\.0+$/, "").replace(/(\.[0-9]*?)0+$/, "$1");
}

async function getUsageMessage() {
	const [powerSnapshot, usageToday] = await Promise.all([
		api.getPowerSnapshot(),
		api.getTodayUsage()
	]);

	return `Total power right now: ${formatNumber(powerSnapshot?.totalPower)}W. Today's estimated usage: ${formatNumber(usageToday?.totalKwh)} kWh.`;
}

module.exports = {
	getUsageMessage
};
