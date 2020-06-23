type Runnable = () => void;

export default abstract class Listenable<T> {
   abstract value: T;

   protected external(...args: any): void {
      this.fetch();
      this.callListeners();
   };

   /** @override this if you need to */
   protected abstract fetch(): void;

   private readonly listeners: Runnable[] = [];
   addChangeListener(listener: Runnable): void {
      this.listeners.push(listener);
   };

   protected callListeners() {
      this.listeners.forEach(listener => listener());
   };
}
