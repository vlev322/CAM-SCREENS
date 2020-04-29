// CUSTOM SELECTS AND MENU START

for (const dropdown of document.querySelectorAll(".custom-select-wrapper")) {
  dropdown.addEventListener("click", function () {
    this.querySelector(".custom-select").classList.toggle("open");
  });
}
// Toggle menu item
for (const menuItem of document.querySelectorAll(".forclick")) {
  menuItem.addEventListener("click", function () {
    if (menuItem.parentNode.classList.contains("open-menu-item")) {
      menuItem.parentNode.classList.toggle("open-menu-item");
    } else {
      for (const item of document.querySelectorAll(".forclick")) {
        if (item.parentNode.classList.contains("open-menu-item")) {
          item.parentNode.classList.remove("open-menu-item");
        }
      }
      menuItem.parentNode.classList.toggle("open-menu-item");
    }
  });
}

for (const option of document.querySelectorAll(".custom-option")) {
  option.addEventListener("click", function () {
    if (!this.classList.contains("selected")) {
      this.parentNode.querySelector(".custom-option.selected").classList.remove("selected");
      this.classList.add("selected");
      this.closest(".custom-select").querySelector(".custom-select__trigger span").textContent = this.textContent;
    }
  });
}

window.addEventListener("click", function (e) {
  for (const select of document.querySelectorAll(".custom-select")) {
    if (!select.contains(e.target)) {
      select.classList.remove("open");
    }
  }
});

//get siblings
const getSiblings = (sibling) =>
  Array.prototype.filter.call(sibling.parentNode.children, function (child) {
    return child !== sibling;
  });

//Opening dialogs

const main_wrapper = document.getElementById("main");

const dlg_success = document.getElementById("dlg_success");
const dlg_restore = document.getElementById("dlg_restore");

const open_dlg_restore = document.getElementById("open_dlg_restore");
const open_dlg_success = document.getElementById("open_dlg_success");

const dlgs = [dlg_success, dlg_restore];

for (const cls_dlg of document.querySelectorAll(".close_dlg")) {
  cls_dlg.addEventListener("click", function () {
    for (const dlg of dlgs) {
      dlg.classList.add("state_dlg");
      main_wrapper.classList.remove("blur");
    }
  });
}
open_dlg_restore.addEventListener("click", function (e) {
  dlg_restore.classList.toggle("state_dlg");
  main_wrapper.classList.toggle("blur");
});

open_dlg_success.addEventListener("click", function (e) {
  dlg_success.classList.toggle("state_dlg");
  main_wrapper.classList.toggle("blur");
});

// CUSTOM MULTYRANGE

function getCoords(elem) {
  /*Получаем координаты относительно окна браузера*/
  let coords = elem.getBoundingClientRect();
  /*Высчитываем значения координат относительно документа, вычисляя прокрутку документа*/
  return {
    top: coords.top + window.pageYOffset,
    left: coords.left + window.pageXOffset,
    leftX: coords.left,
    rigth: coords.left + window.pageXOffset + coords.width,
    bottom: coords.top + window.pageYOffset + coords.height,
    width: coords.width,
  };
}

function moveRange(elem) {
  /*Находим нужный элемент по классу или id*/
  var coords = getCoords(elem);

  /*Определяем зону окрашывания*/
  var colorRange = elem.parentElement.children[1];
  var f; //устанавливаем флаг для определения мин или макс элемента
  var value; //значение фильтра

  /*Определяем второй ползунок и родителя*/
  var parent = {};
  parent.element = elem.parentElement;
  parent.coords = getCoords(parent.element);

  var block2 = {};
  if (elem.classList.contains("block-min")) {
    block2.element = elem.parentElement.children[2];
    block2.coords = getCoords(block2.element);
    f = 0;
  } else {
    block2.element = elem.parentElement.children[0];
    block2.coords = getCoords(block2.element);
    f = 1;
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("touchmove", onMouseMove);
  document.addEventListener("touchend", onMouseUp);

  /*выключаем браузерное событие DaD*/
  elem.ondragstart = function () {
    return false;
  };

  function onMouseMove(e) {
    /*Определяем смещение влево*/
    e.preventDefault(); //предотвратить запуск выделения элементов
    /*Определяем положение мыши в зависимости от устройства*/
    /*На мобильных устройствах может фиксироваться несколько точек касания, поэтому используется массив targetTouches*/
    /*Мы будем брать только первое зафиксированое касание по экрану targetTouches[0]*/
    if (e.touches === undefined) {
      var pos = e.clientX;
    } else {
      var pos = e.targetTouches[0].clientX;
    }

    /*Устанавливаем границы движения ползунка*/
    let newLeft = pos - parent.coords.leftX;

    let rigthEdge = parent.coords.width - (coords.width + 1);

    if (newLeft < 0) {
      newLeft = 0;
    } else if (newLeft > rigthEdge) {
      newLeft = rigthEdge;
    }
    if (f == 0 && pos > block2.coords.left - block2.coords.width) {
      newLeft = block2.coords.left - block2.coords.width - parent.coords.leftX;
    } else if (f == 1 && pos < block2.coords.rigth + 5) {
      newLeft = block2.coords.rigth - block2.coords.left;
    }
    /*устанавливаем отступ нашему элементу*/
    elem.style.left = newLeft + "px";

    //Определяем значение фильтра
    let rangeMin = 0;
    let rangeMax = 121.8;

    const elemSiblings = getSiblings(elem.parentNode);
    let handleInputMin = elemSiblings[0].querySelector("input");
    let handleInputMax = elemSiblings[1].querySelector("input");

    handleInputMin.addEventListener("change", () => {
      console.log("we are typing", handleInputMin.value);
    });

    if (f == 0) {
      value = (newLeft / (parent.coords.width / (rangeMax - rangeMin)) + rangeMin).toFixed(0);
      handleInputMin.value = value;
    } else {
      value = (newLeft / (parent.coords.width / (rangeMax - rangeMin)) + 0.3 + rangeMin).toFixed(0);
      handleInputMax.value = value;
    }
    if (value > rangeMin && value < rangeMax) {
      rangeMin.value = value;
    }

    /*Делаем цветную плашечку диапазона выбора*/
    if (f == 0) {
      colorRange.style.left = newLeft + coords.width + "px";
      colorRange.style.width = block2.coords.left - getCoords(elem).left - coords.width + "px";
    } else {
      colorRange.style.left = block2.coords.left - parent.coords.leftX + "px";
      colorRange.style.width = getCoords(elem).left - block2.coords.left + "px";
    }
  }

  function onMouseUp() {
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("touchend", onMouseUp);
    document.removeEventListener("touchmove", onMouseMove);
  }
}
