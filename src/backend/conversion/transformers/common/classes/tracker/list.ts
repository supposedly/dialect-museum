export interface ListNode<T> {
  next: T | null
  append(node: T): void
}

type ListNodeOf<T> = ListNode<ListNodeOf<T>> & T;

export class List<T extends ListNode<T>> {
  head: T | null = null;
  tail: T | null = null;

  static fromArray<R>(arr: R[]): List<ListNodeOf<R>> {
    return arr.reduce(
      (list, node) => {
        list.append({
          ...node,
          next: null,
          append(head) {
            let tail = head;
            while (tail.next !== null) {
              tail = tail.next;
            }
            tail.next = this.next;
            this.next = head;
          },
        });
        return list;
      },
      new List<ListNodeOf<R>>(),
    );
  }

  toArray() {
    const arr = [];
    let node = this.head;
    while (node !== null) {
      arr.push(node);
      node = node.next;
    }
    return arr;
  }

  map<R extends ListNode<R>>(f: (node: T) => R): List<R> {
    const list = new List<R>();
    let node = this.head;
    while (node !== null) {
      list.append(f(node));
      node = node.next;
    }
    return list;
  }

  mapToArray<R>(f: (node: T) => R): R[] {
    const arr = [];
    let node = this.head;
    while (node !== null) {
      arr.push(f(node));
      node = node.next;
    }
    return arr;
  }

  mapToList<R>(f: (node: T) => R): List<ListNodeOf<R>> {
    const list = new List<ListNodeOf<R>>();
    let node = this.head;
    while (node !== null) {
      list.append({
        ...f(node),
        next: null,
        append(head) {
          let tail = head;
          while (tail.next !== null) {
            tail = tail.next;
          }
          tail.next = this.next;
          this.next = head;
        },
      });
      node = node.next;
    }
    return list;
  }

  forEach(f: (node: T) => void) {
    let node = this.head;
    while (node !== null) {
      f(node);
      node = node.next;
    }
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
