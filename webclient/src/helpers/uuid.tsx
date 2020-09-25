export type UUID = string;

export default (): UUID =>
  String([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11 ).replace(/[018]/g, (c) =>
    (
      (c as any) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> ((c as any) / 4)))
    ).toString(16)
  );
