import  { h } from 'hyperapp'
import  { Items } from './items'
import  { datestamp } from '../../lib/lib'
import  { total_duration } from './calc_item'
import  { count_correct,
          count_incorrect,
          count_skipped,
          percentage_correct } from './calc_score'


const Section = ({data}) => (
  <section name="hand_exam"
    count="175"
    countcorrect={count_correct(data)}
    countincorrect={count_incorrect(data)}
    countskipped={count_skipped(data)}
    countmarked="0"
    startdatetime={datestamp(data[0])}
    enddatetime={datestamp(data[data.length - 1])}
    duration={total_duration(data)}
    >
    <score
      scorevalue={count_correct(data)}
      scoredisplay={percentage_correct(data)}
      passindicator="p"
      scoremin="0"
      scoremax="175"
      scorecut="0"
      />
    <Items records={data} />
  </section>
)

export const Sections = ({data}) => (
  <sections>
    <Section data={data} />
  </sections>
)