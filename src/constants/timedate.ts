export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const minYear = 1947;
export const currentYear = (): number => {
  const now = new Date();
  return now.getFullYear();
};
