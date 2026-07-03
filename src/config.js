module.exports = {
	backendUrl: process.env.BACKEND_URL || "http://localhost:5000/api/v1",
	backendEmail: process.env.BACKEND_EMAIL || "admin@example.com",
	backendPassword: process.env.BACKEND_PASSWORD || "secret123",
	discordToken: process.env.TOKEN || process.env.DISCORD_TOKEN
};
