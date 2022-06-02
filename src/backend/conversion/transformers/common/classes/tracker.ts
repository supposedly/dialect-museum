/* eslint-disable max-classes-per-file */

import {Narrow} from "../../../utils/typetools";

export class TrackerHistory {

}

export class Tracker {
  private prev: Tracker | null = null;
  private next: Tracker | null = null;
}

export class TrackerList<T> {
  private head: Tracker;

  constructor(private readonly text: Narrow<T>) {
    this.head = new Tracker();
  }
}
