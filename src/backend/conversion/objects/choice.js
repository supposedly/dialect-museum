class Choice {
  constructor(choices) {
    this.choices = choices;
  }

  init(initializers) {
    this.choices = this.choices.map(obj => obj.init(initializers));
  }

  ctx(item) {
    this.choices.forEach(obj => obj.ctx(item));
  }
}

function choice(...objs) {
  if (objs.length === 1 && Array.isArray(objs[0])) {
    return new Choice(objs[0]);
  }
  return new Choice(objs);
}

module.exports = {
  choice
};
