import { h } from 'hyperapp'
import { Categories } from './categories'
import { Sections } from './sections'

export const Exam = ({state}) => (
  <exam
    resourcefilename="70084.cer"
    resourceversion="1.0"
    name="MOC-PSCOS"
    examformname="PSCOS"
    driverversion="9.1.1 Build #0 (UTD 9.1 CORE (A))"
    startdatetime="{state.*}"
    enddatetime="{state.*}"
    duration="{state.*}"
    restartcount="{state.*}"
    count="{state.*}"
    countcorrect="{state.*}"
    countincorrect="{state.*}"
    countskipped="0"
    countmarked="0"
    functioncode=""
    workstationname="{state.ipaddress}"
    >
    <score
      scorevalue="197.727272727273"
      scoredisplay="197.73"
      passindicator="p"
      scoremin="0"
      scoremax="200"
      scorecut="0"
      />
    <Sections state={state} />
    <Categories state={state} />
  </exam>
)