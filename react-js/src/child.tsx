export default function Child({
  cname,
  doChange,
}: {
  cname: string;
  doChange: (newName: string) => void;
}) {
  return (
    <>
      <input type="text" value={cname} onChange={(e) => doChange(e.target.value)} />
    </>
  );
}