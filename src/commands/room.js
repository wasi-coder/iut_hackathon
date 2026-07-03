const api = require("../services/api");

function formatCount(count, label) {
	return `${count} ${label}${count === 1 ? "" : "s"} ON`;
}

function formatNumber(value) {
	const numericValue = Number(value || 0);
	return Number.isInteger(numericValue)
		? String(numericValue)
		: numericValue.toFixed(2).replace(/\.0+$/, "").replace(/(\.[0-9]*?)0+$/, "$1");
}

function summarizeRoom(room) {
	const activeDevices = Array.isArray(room.devices) ? room.devices.filter(device => device.status) : [];
	const counts = activeDevices.reduce((accumulator, device) => {
		const type = String(device.type || "device").toLowerCase();
		accumulator[type] = (accumulator[type] || 0) + 1;
		return accumulator;
	}, {});

	const segments = [];
	const preferredOrder = ["fan", "light"];

	for (const type of preferredOrder) {
		if (counts[type]) {
			segments.push(formatCount(counts[type], type));
			delete counts[type];
		}
	}

	for (const [type, count] of Object.entries(counts)) {
		segments.push(formatCount(count, type));
	}

	const deviceSummary = segments.length > 0 ? segments.join(", ") : "all off";
	const currentPower = Array.isArray(room.devices)
		? room.devices.reduce((total, device) => total + Number(device.currentPower || 0), 0)
		: 0;

	return `${room.name}: ${deviceSummary}. Current power: ${formatNumber(currentPower)}W.`;
}

async function getRoomMessage(roomName) {
	const query = String(roomName || "").trim();

	if (!query) {
		return "Usage: !room <name>";
	}

	const dashboard = await api.getDashboard();
	const rooms = Array.isArray(dashboard?.rooms) ? dashboard.rooms : [];
	const room = api.findRoomByQuery(rooms, query);

	if (!room) {
		return `Room not found for "${query}".`;
	}

	return summarizeRoom(room);
}

module.exports = {
	getRoomMessage
};
