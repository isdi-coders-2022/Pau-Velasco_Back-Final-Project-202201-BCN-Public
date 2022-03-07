const notFoundError = (req, res) => {
  res
    .status(404)
    .json({ error: true, message: "Error 404. Endpoint not found" });
};

module.exports = notFoundError;
