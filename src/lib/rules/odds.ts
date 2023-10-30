export default function sharedOdds() {
  const id = {};
  return (odds: number) => ({odds, id});
}
