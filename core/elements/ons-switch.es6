/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(() => {
  'use strict';

  var scheme = {
    '': 'switch--*',
    'switch__input': 'switch--*__input',
    'switch__toggle': 'switch--*__toggle'
  };
  var ModifierUtil = ons._internal.ModifierUtil;
  var templateSource = ons._util.createElement(`
    <div>
      <input type="checkbox" class="switch__input">
      <div class="switch__toggle"></div>
    </div>
  `);

  var ExtendableLabelElement;
  if (typeof HTMLLabelElement !== 'function') {
    // for Safari
    ExtendableLabelElement = () => {};
    ExtendableLabelElement.prototype = document.createElement('label');
  } else {
    ExtendableLabelElement = HTMLLabelElement;
  }

  var generateId = (() => {
    var i = 0;
    return () => 'ons-switch-id-' + (i++);
  })();

  class SwitchElement extends ExtendableLabelElement {

    get checked() {
      return this._getCheckbox().checked;
    }

    set checked(value) {
      this._getCheckbox().checked = value;
      if (this.checked) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
    }

    get disabled() {
      return this._getCheckbox().disabled;
    }

    set disabled(value) {
      this._getCheckbox().disabled = value;
      if (this.disabled) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    createdCallback() {
      this._compile();
      ModifierUtil.initModifier(this, scheme);

      this._updateForCheckedAttribute();
      this._updateForDisabledAttribute();
    }

    _updateForCheckedAttribute() {
      if (this.hasAttribute('checked')) {
        this._getCheckbox().checked = true;
      } else {
        this._getCheckbox().checked = false;
      }
    }

    _updateForDisabledAttribute() {
      if (this.hasAttribute('disabled')) {
        this._getCheckbox().setAttribute('disabled', '');
      } else {
        this._getCheckbox().removeAttribute('disabled');
      }
    }

    _compile() {
      this.classList.add('switch');
      var template = templateSource.cloneNode(true);
      while (template.children[0]) {
        this.appendChild(template.children[0]);
      }
      this._getCheckbox().setAttribute('name', generateId());
    }

    detachedCallback() {
      this._getCheckbox().removeEventListener('change', this._onChangeListener);
    }

    attachedCallback() {
      this._getCheckbox().addEventListener('change', this._onChangeListener);
    }

    _onChangeListener() {
      if (this.checked !== true) {
        this.parentNode.removeAttribute('checked');
      } else {
        this.parentNode.setAttribute('checked', '');
      }
    }

    /**
     * @return {Boolean}
     */
    _isChecked() {
      return this._getCheckbox().checked;
    }

    /**
     * @param {Boolean}
     */
    _setChecked(isChecked) {
      isChecked = !!isChecked;

      var checkbox = this._getCheckbox();

      if (checkbox.checked != isChecked) {
        checkbox.checked = isChecked;
      }
    }

    _getCheckbox() {
      return this.querySelector('input[type=checkbox]');
    }

    attributeChangedCallback(name, last, current) {
      if (name === 'modifier') {
        return ModifierUtil.onModifierChanged(last, current, this, scheme);
      } else if (name === 'checked') {
        this._updateForCheckedAttribute();
      } else if (name === 'disabled') {
        this._updateForDisabledAttribute();
      }
    }
  }

  if (!window.OnsSwitchElement) {
    window.OnsSwitchElement = document.registerElement('ons-switch', {
      prototype: SwitchElement.prototype
    });
  }
})();
