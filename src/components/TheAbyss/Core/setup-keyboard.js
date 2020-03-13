export default function (core) {
  const pressed = new Set();

  core.listen('keydown', (code) => {
    pressed.add(code);
    core.dispatch(`keydown-${code}`);
  });

  core.listen('keyup', (code) => {
    pressed.delete(code);
    core.dispatch(`keyup-${code}`);
  });

  core.listen('controls-released', () => {
    pressed.forEach((code) => {
      core.dispatch(`keyup-${code}`);
    });
    pressed.clear();
  });

  return {
    isPressed: (code) => pressed.has(code),
  };
}
