const response = <T>(data: T) => ({
  status: "ok",
  timestamp: new Date().toISOString(),
  data,
});

export { response };
