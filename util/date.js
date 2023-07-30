import moment from "moment";
import {DATETIME_FORMAT} from "../definitions/date";

/**
 * 日時文字列を別フォーマットに変換する関数
 *
 * @param {string} date - フォーマットする日付文字列
 * @param {Object} [config] - フォーマットの設定
 * @param {string} [config.inputFormat=YYYY-MM-DDTHH:mm.SSSZ] - 第一引数の文字列フォーマット
 * @param {string} [config.outputFormat=YYYY/MM/DD HH:mm] - 返り値の文字列フォーマット
 */
export const formatDateTime = (date, config) => {
  const {inputFormat, outputFormat} = Object.assign({
    inputFormat: DATETIME_FORMAT.ISO8601,
    outputFormat: DATETIME_FORMAT.Default,
  }, config);
  return moment(date, inputFormat).format(outputFormat);
}