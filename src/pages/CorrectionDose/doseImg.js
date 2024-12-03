const images = [
  { description: "", link: "https://i.imgur.com/onlH7y4.gif" },
  { description: "", link: "https://i.imgur.com/rLOGAqU.gif" },
  { description: "", link: "https://i.imgur.com/74zBkTX.gif" },
  { description: "", link: "https://i.imgur.com/iUgtVhL.gif" },
];

// Generate a random index
const randomIndex = Math.floor(Math.random() * images.length);

// Retrieve the randomly chosen item
export const randomCorrectionDoseImg = images[randomIndex].link;
