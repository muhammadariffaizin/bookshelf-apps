function modal_toConsumableArray(arr) {
  return (
    modal_arrayWithoutHoles(arr) ||
    modal_iterableToArray(arr) ||
    modal_unsupportedIterableToArray(arr) ||
    modal_nonIterableSpread()
  );
}

function modal_nonIterableSpread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function modal_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return modal_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return modal_arrayLikeToArray(o, minLen);
}

function modal_iterableToArray(iter) {
  if (
    (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null) ||
    iter["@@iterator"] != null
  )
    return Array.from(iter);
}

function modal_arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return modal_arrayLikeToArray(arr);
}

function modal_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function modal_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly &&
      (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })),
      keys.push.apply(keys, symbols);
  }
  return keys;
}

function modal_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2
      ? modal_ownKeys(Object(source), !0).forEach(function (key) {
          modal_defineProperty(target, key, source[key]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source)
        )
      : modal_ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key)
          );
        });
  }
  return target;
}

function modal_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function modal_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function modal_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function modal_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) modal_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) modal_defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}

var modal_Default = {
  placement: "center",
  backdropClasses:
    "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
  onHide: function onHide() {},
  onShow: function onShow() {},
  onToggle: function onToggle() {},
};

var Modal = /*#__PURE__*/ (function () {
  function Modal() {
    var targetEl =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    modal_classCallCheck(this, Modal);

    this._targetEl = targetEl;
    this._options = modal_objectSpread(
      modal_objectSpread({}, modal_Default),
      options
    );
    this._isHidden = true;

    this._init();
  }

  modal_createClass(Modal, [
    {
      key: "_init",
      value: function _init() {
        var _this = this;

        this._getPlacementClasses().map(function (c) {
          _this._targetEl.classList.add(c);
        });
      },
    },
    {
      key: "_createBackdrop",
      value: function _createBackdrop() {
        if (this._isHidden) {
          var _backdropEl$classList;

          var backdropEl = document.createElement("div");
          backdropEl.setAttribute("modal-backdrop", "");

          (_backdropEl$classList = backdropEl.classList).add.apply(
            _backdropEl$classList,
            modal_toConsumableArray(this._options.backdropClasses.split(" "))
          );

          document.querySelector("body").append(backdropEl);
        }
      },
    },
    {
      key: "_destroyBackdropEl",
      value: function _destroyBackdropEl() {
        if (!this._isHidden) {
          document.querySelector("[modal-backdrop]").remove();
        }
      },
    },
    {
      key: "_getPlacementClasses",
      value: function _getPlacementClasses() {
        switch (this._options.placement) {
          // top
          case "top-left":
            return ["justify-start", "items-start"];

          case "top-center":
            return ["justify-center", "items-start"];

          case "top-right":
            return ["justify-end", "items-start"];
          // center

          case "center-left":
            return ["justify-start", "items-center"];

          case "center":
            return ["justify-center", "items-center"];

          case "center-right":
            return ["justify-end", "items-center"];
          // bottom

          case "bottom-left":
            return ["justify-start", "items-end"];

          case "bottom-center":
            return ["justify-center", "items-end"];

          case "bottom-right":
            return ["justify-end", "items-end"];

          default:
            return ["justify-center", "items-center"];
        }
      },
    },
    {
      key: "toggle",
      value: function toggle() {
        if (this._isHidden) {
          this.show();
        } else {
          this.hide();
        } // callback function

        this._options.onToggle(this);
      },
    },
    {
      key: "show",
      value: function show() {
        this._targetEl.classList.add("flex");

        this._targetEl.classList.remove("hidden");

        this._targetEl.setAttribute("aria-modal", "true");

        this._targetEl.setAttribute("role", "dialog");

        this._targetEl.removeAttribute("aria-hidden");

        this._createBackdrop();

        this._isHidden = false; // callback function

        this._options.onShow(this);
      },
    },
    {
      key: "hide",
      value: function hide() {
        this._targetEl.classList.add("hidden");

        this._targetEl.classList.remove("flex");

        this._targetEl.setAttribute("aria-hidden", "true");

        this._targetEl.removeAttribute("aria-modal");

        this._targetEl.removeAttribute("role");

        this._destroyBackdropEl();

        this._isHidden = true; // callback function

        this._options.onHide(this);
      },
    },
  ]);

  return Modal;
})();

window.Modal = Modal;

var getModalInstance = function getModalInstance(id, instances) {
  if (
    instances.some(function (modalInstance) {
      return modalInstance.id === id;
    })
  ) {
    return instances.find(function (modalInstance) {
      return modalInstance.id === id;
    });
  }

  return false;
};

function initModal() {
  var modalInstances = [];
  document.querySelectorAll("[data-modal-toggle]").forEach(function (el) {
    var modalId = el.getAttribute("data-modal-toggle");
    var modalEl = document.getElementById(modalId);
    var placement = modalEl.getAttribute("data-modal-placement");

    if (modalEl) {
      if (
        !modalEl.hasAttribute("aria-hidden") &&
        !modalEl.hasAttribute("aria-modal")
      ) {
        modalEl.setAttribute("aria-hidden", "true");
      }
    }

    var modal = null;

    if (getModalInstance(modalId, modalInstances)) {
      modal = getModalInstance(modalId, modalInstances);
      modal = modal.object;
    } else {
      modal = new Modal(modalEl, {
        placement: placement ? placement : modal_Default.placement,
      });
      modalInstances.push({
        id: modalId,
        object: modal,
      });
    }

    if (
      modalEl.hasAttribute("data-modal-show") &&
      modalEl.getAttribute("data-modal-show") === "true"
    ) {
      modal.show();
    }

    el.addEventListener("click", function () {
      modal.toggle();
    });
  });
}

export { Modal, initModal };
