import { performance } from 'node:perf_hooks';
import { setTimeout } from 'node:timers/promises';

export const MAX_HEIGHT = 127;
export const MIN_HEIGHT = 62;
const DELAY = 100;

const targetReached = (currentCm, targetCm) => Math.abs(currentCm - targetCm) <= 1;
export default class Desk {
  constructor(position, control) {
    this.position = position;
    this.control = control;
  }

  async moveUp() {
    await this.control.writeAsync(Buffer.from('4700', 'hex'), false);
  }

  async moveDown() {
    await this.control.writeAsync(Buffer.from('4600', 'hex'), false);
  }

  async stopMoving() {
    await this.control.writeAsync(Buffer.from('FF00', 'hex'), false);
  }

  async getCurrentHeightCm() {
    const heightInBytes = await this.position.readAsync();
    const relativeHeightCm = heightInBytes.readInt16LE() / 100;
    return MIN_HEIGHT + relativeHeightCm;
  }

  async moveTo(targetCm) {
    const currentCm = await this.getCurrentHeightCm();
    return currentCm > targetCm
      ? this._moveTo(targetCm, () => this.moveDown())
      : this._moveTo(targetCm, () => this.moveUp());
  }

  async _moveTo(targetCm, moveFn) {
    await this.stopMoving();

    let currentCm = await this.getCurrentHeightCm();

    let lastCommandNow = performance.now();

    while (!targetReached(currentCm, targetCm)) {
      currentCm = await this.getCurrentHeightCm();
      if (targetReached(currentCm, targetCm)) {
        break;
      }
      if (performance.now() - lastCommandNow <= 300) {
        continue;
      }

      await moveFn();
      lastCommandNow = performance.now();

      await setTimeout(DELAY);
      currentCm = await this.getCurrentHeightCm();
    }

    await this.stopMoving();

    currentCm = await this.getCurrentHeightCm();
    return currentCm;
  }
}
