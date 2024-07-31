export const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp)); // parseInt to ensure the milliseconds are in integer format
  const options = { day: "2-digit", month: "short", year: "numeric" };

  return date.toLocaleDateString("en-US", options);
};
