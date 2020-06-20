type Runnable = () => void;

type ChangeCallback<T> = Runnable & ((newValue: T) => void);

class Listenable<T> {
   #value: T;
   get value() { return this.#value }

   constructor (executor: (change: ChangeCallback<T>) => void, private getter: () => T) {
      executor(this.change.bind(this));
      this.#value = getter();
   }

   /** Runs `Listenable#getter` and calls listeners */
   private change(): void;

   /** Sets `Listenable##value` to the passed `newValue` and calls listeners */
   private change(newValue: T): void;

   /**
    * `Listenable#change` implementation
    */
   private change(newValue?: T): void {
      this.#value = newValue === undefined ? this.getter() : newValue;
      this.dispatch();
   }

   /** Runs `Listenable#getter` and calls listeners */
   public update() { this.change() }

   private readonly listeners: Runnable[] = [];
   addChangeListener(listener: Runnable): void {
      this.listeners.push(listener);
   }

   /** Calls listeners */
   private dispatch() {
      this.listeners.forEach(listener => listener());
   }

   map<U>(fn: (value: T) => U): Listenable<U> {
      return new Listenable(
         (change) => {
            this.addChangeListener(change);
         },
         () => fn(this.#value)
      );
   };
}
