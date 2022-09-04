export interface ListNode<T> {
  next: T | null
  append(node: T): void
}

export class List<T extends ListNode<T>> {
  head: T | null = null;
  tail: T | null = null;

  forEach(f: (node: T) => void) {
    let node = this.head;
    while (node !== null) {
      f(node);
      node = node.next;
    }
  }

  map<R>(f: (node: T) => R): R[] {
    const arr = [];
    let node = this.head;
    while (node !== null) {
      arr.push(f(node));
      node = node.next;
    }
    return arr;
  }

  append(node: T) {
    if (this.tail === null) {
      this.head = node;
    } else {
      this.tail.append(node);
    }
    this.tail = node;
  }

  prepend(node: T) {
    if (this.head === null) {
      this.tail = node;
    } else {
      node.append(this.head);
    }
    this.head = node;
  }
}
