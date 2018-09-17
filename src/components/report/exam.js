import { h } from 'hyperapp'
import { Categories } from './categories'
import { Sections } from './sections'
import { datestamp } from '../../lib/lib'
import  { total_duration } from './calc_item'
import  { count_correct,
          count_incorrect,
          count_skipped,
          percentage_correct } from './calc_score'

export const Exam = ({data, state}) => (
  <exam
    resourcefilename={state.user.email + '.xml'}
    resourceversion="1.0"
    name="MOC-HANDEXAM"
    examformname="HANDEXAM"
    driverversion="9.1.1 Build #0 (UTD 9.1 CORE (A))"
    startdatetime={datestamp(data[0])}
    enddatetime={datestamp(data[data.length - 1])}
    duration={total_duration(data)}
    restartcount="0"
    count="175"
    countcorrect={count_correct(data)}
    countincorrect={count_incorrect(data)}
    countskipped={count_skipped(data)}
    countmarked="0"
    functioncode=""
    workstationname=""
    >
    <score
      scorevalue={count_correct(data)}
      scoredisplay={percentage_correct(data)}
      passindicator="p"
      scoremin="0"
      scoremax="175"
      scorecut="0"
      />
    <Sections data={data} state={state} />
    <Categories data={data} state={state} />
  </exam>
)