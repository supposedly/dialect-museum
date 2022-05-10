/* eslint-disable max-classes-per-file */

import {Function as Func} from "ts-toolbelt";

export class TrackerHistory {

}

export class Tracker {
  private prev: Tracker | null = null;
  private next: Tracker | null = null;
}

export class TrackerList<T> {
  private head: Tracker;

  constructor(private readonly text: Func.Narrow<T>) {
    this.head = new Tracker();
  }
}
