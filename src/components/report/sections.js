import { h } from 'hyperapp'
import { Items } from './items'

const Section = ({state}) => (
  <section name="scnPSCOS1"
    count="50"
    countcorrect="49"
    countincorrect="1"
    countskipped="0"
    countmarked="0"
    startdatetime="2017-04-21T12:00:31"
    enddatetime="2017-04-21T12:14:32"
    duration="802"
    >
    <score
      scorevalue="50"
      scoredisplay="50.00"
      passindicator="p"
      scoremin="0"
      scoremax="50"
      scorecut="0"
      />
    <Items records={state.displaydata} />
  </section>
)

export const Sections = ({state}) => (
  <sections>
    <Section state={state} />
  </sections>
)