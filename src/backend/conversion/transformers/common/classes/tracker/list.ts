export interface ListNode<T> {
  next: T | undefined
  append(node: T): void
}

type ListNodeOf<T> = ListNode<ListNodeOf<T>> & T;

export class List<T extends ListNode<T>> {
  head: T | undefined = undefined;
  tail: T | undefined = undefined;

  static fromArray<R>(arr: R[]): List<ListNodeOf<R>> {
    return arr.reduce(
      (list, node) => {
        list.append({
          ...node,
          next: undefined,
          append(head) {
            if (this.next !== undefined) {
              let tail = head;
              while (tail.next !== undefined) {
                tail = tail.next;
              }
              tail.next = this.next;
            }
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
    while (node !== undefined) {
      arr.push(node);
      node = node.next;
    }
    return arr;
  }

  map<R extends ListNode<R>>(f: (node: T) => R): List<R> {
    const list = new List<R>();
    let node = this.head;
    while (node !== undefined) {
      list.append(f(node));
      node = node.next;
    }
    return list;
  }

  mapToArray<R>(f: (node: T) => R): R[] {
    const arr = [];
    let node = this.head;
    while (node !== undefined) {
      arr.push(f(node));
      node = node.next;
    }
    return arr;
  }

  mapToList<R>(f: (node: T) => R): List<ListNodeOf<R>> {
    const list = new List<ListNodeOf<R>>();
    let node = this.head;
    while (node !== undefined) {
      list.append({
        ...f(node),
        next: undefined,
        append(head) {
          if (this.next !== undefined) {
            let tail = head;
            while (tail.next !== undefined) {
              tail = tail.next;
            }
            tail.next = this.next;
          }
          this.next = head;
        },
      });
      node = node.next;
    }
    return list;
  }

  forEach(f: (node: T) => void) {
    let node = this.head;
    while (node !== undefined) {
      f(node);
      node = node.next;
    }
  }

  append(node: T) {
    if (this.tail === undefined) {
      this.head = node;
    } else {
      this.tail.append(node);
    }
    this.tail = node;
  }

  prepend(node: T) {
    if (this.head === undefined) {
      this.tail = node;
    } else {
      node.append(this.head);
    }
    this.head = node;
  }
}
