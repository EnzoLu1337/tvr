export class InfoPanel {
  constructor(picking, { elementId = "info" } = {}) {
    this.element = document.getElementById(elementId);
    this._render(null);
    picking.onSelectionChange((entity) => this._render(entity));
  }

  update() {}

  _render(entity) {
    if (!this.element) return;
    if (!entity) {
      this.element.textContent = "Выбранный объект: нет";
      return;
    }
    this.element.textContent =
      `Имя: ${entity.userData.name}\n` +
      `Тип: ${entity.userData.type}`;
  }
}
