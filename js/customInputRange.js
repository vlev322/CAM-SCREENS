function valueTotalRatio(value, min, max) {
  return ((value - min) / (max - min)).toFixed(2);
}

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
  var rangeEl = document.getElementsByClassName("input_range");
  for (const input of rangeEl) {
    updateRangeEl(input);
    input.addEventListener("input", (e) => {
      updateRangeEl(e.target);
      input.nextElementSibling.value = e.target.value;
    });
  }
}

initRangeEl();
