export const unitGrammar = (number) => {
  let result;

  if (number === 0) {
    result = "لا حاجة إلى جرعة إنسولين";
  } else if (number === 1) {
    result = "وحدة واحدة";
  } else if (number === 2) {
    result = "وحدتين";
  } else if (number <= 10) {
    result = `${number} وحدات`;
  } else {
    result = `${number} وحدة`;
  }

  return result;
};
