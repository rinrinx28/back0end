class Field {
  #Field = new Map();
  update(data) {
    for (const [key, value] of Object.entries(data[0])) {
      this.#Field.set(key, value);
    }
    return true;
  }
  findInField(value) {
    return this.#Field.get(value);
  }
  getAllField() {
    let field = [];
    for (const [key, value] of this.#Field) {
      field.push({ id: key, name: value });
    }
    return field;
  }
}

module.exports = Field;
