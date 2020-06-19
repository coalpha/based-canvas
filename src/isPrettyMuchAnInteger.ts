const TOLERANCE = 0.001;

export default function isPrettyMuchAnInteger(n: number): boolean {
   return Math.abs(n - (n|0)) < TOLERANCE;
}
