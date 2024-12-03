const images = [
  { description: "", link: "https://i.imgur.com/hrvl2Nf.gif" },
  { description: "", link: "https://i.imgur.com/NFwoXLW.gif" },
  { description: "", link: "https://i.imgur.com/Hg7E55k.gif" },
];

// Generate a random index
const randomIndex = Math.floor(Math.random() * images.length);

// Retrieve the randomly chosen item
export const randomDoseImg = images[randomIndex].link;
