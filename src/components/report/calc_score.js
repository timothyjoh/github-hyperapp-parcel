import { iscorrect } from "./calc_item";
import { sortAndGroupRecords } from './counts'

const ITEMS = 175

export const count_correct = rs => (
  sortAndGroupRecords(rs).reduce((tot, i) => (tot + iscorrect(i)), 0)
)
export const count_incorrect = rs => (
  sortAndGroupRecords(rs).reduce((tot, i) => (tot + (iscorrect(i) ? 0 : 1)), 0)
)
export const count_skipped = rs => ITEMS - count_correct(rs) - count_incorrect(rs)
export const percentage_correct = rs => (count_correct(rs) * 100 / ITEMS).toFixed(2)