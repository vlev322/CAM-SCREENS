function valueTotalRatio(value, min, max) {
  return ((value - min) / (max - min)).toFixed(2);
}
function isAN(value) {
  if (value instanceof Number) value = value.valueOf();
  return isFinite(value) && value === parseInt(value, 10);
}

const normalizerValue = (value, minVal, maxVal) => {
  const enteredVal = parseInt(value);
  if (enteredVal >= minVal && enteredVal <= maxVal) {
    return enteredVal;
  }
  if (enteredVal <= minVal) {
    return minVal;
  }
  if (enteredVal >= maxVal) {
    return maxVal;
  }
};

function getLinearGradientCSS(ratio, leftColor, rightColor) {
  return [
    "-webkit-gradient(",
    "linear, ",
    "left top, ",
    "right top, ",
    "color-stop(" + ratio + ", " + leftColor + "), ",
    "color-stop(" + ratio + ", " + rightColor + ")",
    ")",
  ].join("");
}

function updateRangeEl(rangeEl) {
  var ratio = valueTotalRatio(rangeEl.value, rangeEl.min, rangeEl.max);
  rangeEl.style.backgroundImage = getLinearGradientCSS(ratio, "#7899fc", "#c5c5c5");
}

function initRangeEl() {
  const rangeEl = document.getElementsByClassName("input_range");
  for (const input of rangeEl) {
    let inputRangeHandler = input.nextElementSibling;
    if (inputRangeHandler.nodeName.toLowerCase() !== "input") {
      inputRangeHandler = inputRangeHandler.nextElementSibling;
    }

    updateRangeEl(input);
    input.addEventListener("input", (e) => {
      updateRangeEl(e.target);
      inputRangeHandler.value = e.target.value;
    });
    const minVal = +input.min;
    const maxVal = +input.max;

    inputRangeHandler.addEventListener("input", (e) => {
      if (e.target.value) {
        const actualVal = normalizerValue(e.target.value, minVal, maxVal);
        input.value = actualVal;

        const ratio = valueTotalRatio(actualVal, minVal, maxVal);
        input.style.backgroundImage = getLinearGradientCSS(ratio, "#7899fc", "#c5c5c5");
      } else {
        e.target.value = minVal;
      }
    });
    inputRangeHandler.addEventListener("focusout", (e) => {
      if (isAN(+e.target.value)) {
        e.target.value = normalizerValue(e.target.value, minVal, maxVal);
        const ratio = valueTotalRatio(e.target.value, minVal, maxVal);
        input.style.backgroundImage = getLinearGradientCSS(ratio, "#7899fc", "#c5c5c5");
      } else {
        e.target.value = minVal;
        const ratio = valueTotalRatio(e.target.value, minVal, maxVal);
        input.style.backgroundImage = getLinearGradientCSS(ratio, "#7899fc", "#c5c5c5");
      }
    });
  }
}

initRangeEl();
