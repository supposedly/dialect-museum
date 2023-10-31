export default function sharedOdds() {
  const id = {};
  return (value: number) => ({value, id});
}
