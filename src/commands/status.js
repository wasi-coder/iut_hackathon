const api = require("../services/api");

function formatCount(count, label) {
	return `${count} ${label}${count === 1 ? "" : "s"} ON`;
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

	if (segments.length === 0) {
		return `${room.name}: all off.`;
	}

	return `${room.name}: ${segments.join(", ")}.`;
}

async function getStatusMessage() {
	const dashboard = await api.getDashboard();
	const rooms = Array.isArray(dashboard?.rooms) ? dashboard.rooms : [];

	if (rooms.length === 0) {
		return "No rooms were returned by the backend.";
	}

	return rooms.map(summarizeRoom).join("\n");
}

module.exports = {
	getStatusMessage
};
