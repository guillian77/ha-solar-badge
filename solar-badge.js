import {
  LitElement,
  html,
  css,
  property
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

class SolarBadge extends LitElement {
  ICON_IMPORT = "mdi:import";
  ICON_EXPORT = "mdi:export";
  ICON_AUTO = "mdi:refresh-auto";

  ICON_GRID = "mdi:transmission-tower-import";
  ICON_SOLAR = "mdi:solar-power";
  ICON_BATTERY = "mdi:battery";
  ICON_BATTERY_UP = "mdi:battery-arrow-up-outline";
  ICON_BATTERY_DOWN = "mdi:battery-arrow-down-outline";

  UPPER_THRESHOLD = 100;
  LOWER_THRESHOLD = 100;

  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  setConfig(config) {
    if (!config.global_power) { throw new Error("global_power is required"); }
    if (!config.solar_power) { throw new Error("solar_power is required"); }
    if (!config.battery_power) { throw new Error("battery_power is required"); }
    if (!config.battery_level) { throw new Error("battery_level is required"); }

    this.config = config;
  }

  /**
   * Loaded when the component is added to the DOM.
   */
  connectedCallback() {
    super.connectedCallback();

    const event = new CustomEvent('context-request', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    event.context = 'states';
    event.subscribe = true;
    event.callback = this._handleStateUpdate.bind(this);

    this.dispatchEvent(event);
  }

  /**
   * Loaded when the component is removed from the DOM.
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  }

  /**
   * Handles state updates from Home Assistant and updates the component's properties accordingly.
   *
   * @param {Object} states - The current states of all entities in Home Assistant.
   * @param {Function} unsubscribe - A function to call to unsubscribe from state updates when the component is disconnected.
   */
  _handleStateUpdate = (states, unsubscribe) => {
    this._unsubscribe = unsubscribe;

    this.global_power = Math.floor(states[this.config.global_power].state);
    this.solar_power = Math.floor(states[this.config.solar_power].state);
    this.battery_power = Math.floor(states[this.config.battery_power].state);
    this.battery_level = states[this.config.battery_level].state;

    this.grid_power = this.calculateGridPower();

    if (this.requestUpdate) this.requestUpdate();
  }

  /**
   * Calculates the grid power based on global power, solar power, and battery power.
   *
   * The calculation is as follows:
   * - Start with grid power as global power minus solar power.
   * - If battery power is positive (charging), add it to grid power.
   * - If battery power is negative (discharging), subtract its absolute value from grid power.
   *
   * This calculation assumes that:
   * - Positive battery power means energy is being drawn from the grid to charge the battery.
   * - Negative battery power means energy is being supplied to the grid from the battery.
    *
    * @returns {number} The calculated grid power in watts.
   */
  calculateGridPower() {
    let gridPower = this.global_power - this.solar_power;

    if (this.battery_power > 0) {
      return gridPower + this.battery_power;
    }

    return gridPower - Math.abs(this.battery_power);
  }

  /**
   * Determines the icon, source label, and color based on the grid power value.
   *
   * - If grid power is less than 0, it indicates surplus production (exporting to the grid).
   * - If grid power is greater than the upper threshold, it indicates importation from the grid.
   * - Otherwise, it defaults to auto mode (no grid usage).
    *
    * @returns {TemplateResult} An HTML template containing the source icon and label with appropriate styling.
   */
  stateIconTemplate() {
    // Default: No grid usage.
    let icon = this.ICON_AUTO;
    let source = "AUTO";
    let color = "green";

    if(this.grid_power < 0) { // SURPRODUCTION
      icon = this.ICON_EXPORT;
      source = "exp";
      color = "orange";
    }
    if(this.grid_power > this.UPPER_THRESHOLD) { // IMPORTATION
      icon = this.ICON_IMPORT;
      source = "grid";
      color = "red";
    }

    return html `
      <div class="source">
        <ha-state-icon class="source-icon" icon="${icon}"></ha-state-icon>
        <span class="source-name ${color}">${source}</span>
      </div>
    `;
  }

  /**
   * Displays the solar power with a solar icon.
   *
   * Only shown if solar power is greater than 0.
   */
  solarPowerTemplate() {
    if (this.solar_power == 0) return;

    return html`<span class="power">
      <ha-icon icon="${this.ICON_SOLAR}"></ha-icon>
      <span>${this.solar_power}W</span>
    </span>`;
  }

  /**
   * Displays the battery power with an up or down icon based on the sign of the power.
   *
   * Only shown if battery power is not equal to 0.
   */
  batteryPowerTemplate() {
    if (this.battery_power == 0) return;

    let icon = "";
    let color = "";

    if (this.battery_power > 0) { icon = this.ICON_BATTERY_UP; color = "#4caf50"; }
    if (this.battery_power < 0) { icon = this.ICON_BATTERY_DOWN; color = "#f44336"; }

    return html`<span class="power">
      <ha-icon icon="${icon}" style="color: ${color};"></ha-icon>
      <span>${this.battery_power}W</span>
    </span>`;
  }

  /**
   * Battery level template with color coding based on thresholds.
   *
    * - Red: Below 40%
    * - Orange: Between 40% and 80%
    * - Green: Above 80%
   */
  batteryLevelTemplate() {
    let color = "";

    if (this.battery_level < 40) { color = "#f44336"; }
    if (this.battery_level >= 40) { color = "#ff9800"; }
    if (this.battery_level >= 80) { color = "#4caf50"; }

    return html`
      <span class="power">
        <ha-icon icon="${this.ICON_BATTERY}" style="color: ${color};"></ha-icon>
        <span>${this.battery_level}%</span>
      </span>
    `;
  }

  /**
   * Render the HTML of the card.
   */
  render() {
    return html`
      <ha-badge class="badges">
        <div class="wrapper">
          ${this.stateIconTemplate()}
          <p>
            <span class="power"><ha-icon icon="${this.ICON_GRID}"></ha-icon> ${this.grid_power} W</span>
            ${this.solarPowerTemplate()}
            ${this.batteryPowerTemplate()}
            ${this.batteryLevelTemplate()}
          </p>
        </div>
      </ha-badge>
    `;
  }

  /***
   * CSS styles for the card.
   */
  static get styles() {
    return css`
      /**
       * ---------------------------------------------------------------------------------------------------------------
       * GENERAL
       * ---------------------------------------------------------------------------------------------------------------
       */
      ha-badge {
        display: flex;
        font-size: 1rem;
      }

      .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .source {
        display: flex;
        padding: 4px 8px;
        border-radius: 12px;
        line-height: 1;
        align-items: center;
        margin-right: 12px;
        background-color: rgba(255, 255, 255, 0.1);
      }
      .source-name {
        writing-mode: sideways-lr;
        font-size: 9px;
        text-transform: uppercase;
        margin-left: 4px;
      }
      .source-name.red { color: red; }
      .source-name.orange { color: orange; }
      .source-name.green { color: green; }

      .power { margin-right: 6px; }
    `;
  }
}

// Register component
if (!customElements.get("ha-solar-badge")) {
  customElements.define("ha-solar-badge", SolarBadge);
  console.info(
    `%c 🐲 guillian77/ha-solar-badge %c v1.0.0 `,
    'color: green; font-weight: bold;background: black;',
    'background: grey; font-weight: bold; color: #fff'
  )
}

// Register card itself
window.customCards = window.customCards || [];
window.customCards.push({
  type: "ha-solar-badge",
  name: "Content Card",
  preview: false, // Optional - defaults to false
  description: "A custom card made by me!", // Optional
  documentationURL:
    "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card", // Adds a help link in the frontend card editor
});
