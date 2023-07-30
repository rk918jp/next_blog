import {formatDateTime} from "./date";

describe("formatDateTime", () => {
  test("デフォルトのフォーマットで変換", () => {
    expect(formatDateTime("2023-01-02T03:45.678Z")).toBe("2023/01/02 12:45")
  });

  test("入力のフォーマットを指定", () => {
    expect(formatDateTime(
      "20230102_0345_678",
      {
        inputFormat: "YYYYMMDD_HHmm_SSS",
      }
      )).toBe("2023/01/02 03:45")
  });

  test("出力のフォーマットを指定", () => {
    expect(formatDateTime(
      "2023-01-02T03:45.678Z",
      {
        outputFormat: "YYYYMMDD_HHmm_SSS",
      }
    )).toBe("20230102_1245_678")
  });
})