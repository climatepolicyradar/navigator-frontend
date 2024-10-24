export const getSumUSD = (values: string[]) => {
  const sum = values.reduce((acc, curr) => acc + Number(curr), 0);
  const formattedSum = `$${sum.toLocaleString("en-US")}`;

  return formattedSum;
};
