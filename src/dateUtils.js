const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calendarDaysUntil = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  const target = Date.UTC(year, month - 1, day);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
};

export const createBlankContract = () => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  endDate.setDate(endDate.getDate() - 1);
  const renewalDate = new Date(endDate);
  renewalDate.setDate(renewalDate.getDate() - 60);

  return {
    name: "",
    counterparty: "",
    type: "Software subscription",
    owner: "Olivia Chen",
    value: "",
    startDate: toDateInputValue(startDate),
    endDate: toDateInputValue(endDate),
    renewalDate: toDateInputValue(renewalDate),
    clause: "",
    documentName: "",
  };
};
