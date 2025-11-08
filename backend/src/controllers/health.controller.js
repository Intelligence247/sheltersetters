const healthCheck = (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
}

module.exports = {
  healthCheck,
}

