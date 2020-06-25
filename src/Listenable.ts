/**
 * A listener that accepts an optional argument
 */
type ChangeListener<T> = (value: T) => void;

export interface Listenable<T> {
   value: T;

   /** Get the value again */
   fetch(): void;

   addChangeListener(listener: ChangeListener<T>): void;
}

/**
 * This is the callback that `make` provides.
 * It should be called when the listened value changes.
 * If you pass in a new value, it will be used instead of the provided `fetch`
 * function.
 */
type ExternalV<T> = (newval: T) => void;

type External = () => void;

/**
 * The executor is similar to a Promise executor.
 * It is code that is immediately called.
 * The first parameter is the `external` callback which should be hooked up to
 * any event listeners or providers that accept a function.
 */
type Executor<T> = (external: External, externalV: ExternalV<T>) => void;

type Fetch<T> = () => T;

/**
 * Equality test between two type `T`s
 */
type Eq<T> = (a: T, b: T) => boolean;

export function make<T>(executor: Executor<T>, fetch: Fetch<T>, eq: Eq<T> = () => false): Listenable<T> {
   const listeners: ChangeListener<T>[] = [];

   const obj: Listenable<T> = {
      value: fetch(),
      fetch,
      addChangeListener(listener: ChangeListener<T>): void {
         listeners.push(listener);
      },
   };

   function external(newval: T = fetch()) {
      if (!eq(obj.value, newval)) {
         obj.value = newval;
         listeners.forEach(listener => listener(newval))
      }
   }

   executor(external, external);

   return obj;
}

export function map<T, U>(from: Listenable<T>, fn: (value: T) => U, eq: Eq<U> = () => false): Listenable<U> {
   const listeners: ChangeListener<U>[] = [];

   const to: Listenable<U> = {
      value: fn(from.value),
      fetch() {
         this.value = fn(from.value);
      },

      addChangeListener(listener: ChangeListener<U>): void {
         listeners.push(listener);
      },
   };

   from.addChangeListener(input => {
      const newval = fn(input);
      if (!eq(to.value, newval)) {
         to.value = newval;
         listeners.forEach(listener => listener(newval))
      }
   });

   return to;
};
