const numberToSomaliWords = (num) => {
  if (num === 0) return "eber";

  const units = [
    "",
    "kow",
    "laba",
    "saddex",
    "afar",
    "shan",
    "lix",
    "todobo",
    "sideed",
    "sagaal",
  ];

  const tens = [
    "",
    "toban",
    "labaatan",
    "soddon",
    "afartan",
    "konton",
    "lixdan",
    "todobaatan",
    "sideetan",
    "sagaashan",
  ];

  if (num < 10) return units[num];

  if (num < 100) {
    const t = Math.floor(num / 10);
    const u = num % 10;
    return `${tens[t]}${u ? " iyo " + units[u] : ""}`;
  }

  if (num < 1000) {
    const h = Math.floor(num / 100);
    const rest = num % 100;
    return `${units[h]} boqol${rest ? " iyo " + numberToSomaliWords(rest) : ""}`;
  }

  if (num < 1_000_000) {
    const th = Math.floor(num / 1000);
    const rest = num % 1000;
    return `${numberToSomaliWords(th)} kun${
      rest ? " iyo " + numberToSomaliWords(rest) : ""
    }`;
  }

  if (num === 1_000_000) return "hal milyan";

  return num.toString();
};

export default numberToSomaliWords;
