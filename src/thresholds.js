const thresholds = {
  medium: 50,
  small: 20,
  tiny: 5
};

const thresholdLookup = Object.keys(thresholds).reduce((result, key) => {
  result[thresholds[key]] = key;
  return result;
}, {});

function numericSort (a, b) {
  return a - b;
}

export function getThresholdClasses (cellSize) {
  const highestThreshold = Object.values(thresholds)
    .sort(numericSort)
    .find(threshold => cellSize <= threshold);

  let thresholdClass = '';
  if (highestThreshold) {
    thresholdClass = `${thresholdLookup[highestThreshold]}-cells`;
  }

  return thresholdClass;
}
