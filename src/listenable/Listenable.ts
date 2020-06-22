type Runnable = () => void;

export default abstract class Listenable<T> {
   abstract value: T;

   /**
    * This function should be called by something external when state changes.
    * Make sure to make it private.
    */
   protected abstract external(...args: any): void;

   /**
    * Refetches the value.
    * Does not run listeners
    */
   protected abstract fetch(): void;

   private readonly listeners: Runnable[] = [];
   addChangeListener(listener: Runnable): void {
      this.listeners.push(listener);
   }

   /** Calls listeners */
   protected callListeners() {
      this.listeners.forEach(listener => listener());
   }
}
