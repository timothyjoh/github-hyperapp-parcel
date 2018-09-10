import  { h } from 'hyperapp'
import  { count_correct,
          count_incorrect,
          count_skipped } from './calc_score'

export const Categories = ({data}) => (
  <categories>
    <category name="hand_surgery"
      count="175"
      countcorrect={count_correct(data)}
      countincorrect={count_incorrect(data)}
      countskipped={count_skipped(data)}
      countmarked="0"
    >
    </category>
  </categories>
)