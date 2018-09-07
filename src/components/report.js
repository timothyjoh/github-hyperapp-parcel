import { h } from 'hyperapp'
import { Demographics } from './report/demographics'

export const Report = ({data}) => (
// <?xml version="1.0" encoding="UTF-8"?>
<simpleXMLResult xmlns="http://sdk.prometric.com/schemas/SimpleXMLResults1_3" version="1.3">
  <Demographics user={data.user} />
   <exam resourcefilename="70084.cer" resourceversion="1.0" name="MOC-PSCOS" examformname="PSCOS" driverversion="9.1.1 Build #0 (UTD 9.1 CORE (A))" startdatetime="{data.*}" enddatetime="{data.*}" duration="{data.*}" restartcount="{data.*}" count="{data.*}" countcorrect="{data.*}" countincorrect="{data.*}" countskipped="0" countmarked="0" functioncode="" workstationname="{data.ipaddress}">
      <score scorevalue="197.727272727273" scoredisplay="197.73" passindicator="p" scoremin="0" scoremax="200" scorecut="0" />
      <sections>
        <section name="scnPSCOS1" count="50" countcorrect="49" countincorrect="1" countskipped="0" countmarked="0" startdatetime="2017-04-21T12:00:31" enddatetime="2017-04-21T12:14:32" duration="802">
            <score scorevalue="50" scoredisplay="50.00" passindicator="p" scoremin="0" scoremax="50" scorecut="0" />
            <itemgroup name="28214" scored="1" duration="27.503" progid="UTDP.MultiChoiceItem.1" weight="1" presented="1" visited="1">
              <item response="E" correctresponse="E" score="1" scoremin="0" scoremax="1" scorenom="0" complete="1" skipped="0" marked="0" />
            </itemgroup>
        </section>
        <section name="scnNotice" count="0" countcorrect="0" countincorrect="0" countskipped="0" countmarked="0" startdatetime="2017-04-21T12:59:54" enddatetime="2017-04-21T13:00:07" duration="12" />
        <section name="scnConclude" count="0" countcorrect="0" countincorrect="0" countskipped="0" countmarked="0" startdatetime="2017-04-21T13:00:07" enddatetime="2017-04-21T13:00:11" duration="3" />
      </sections>
      <categories>
        <category name="catNDA" count="0" countcorrect="0" countincorrect="0" countskipped="0" countmarked="0">
            <itemref name="NDA_1" />
        </category>
        <category name="catSurvey" count="0" countcorrect="0" countincorrect="0" countskipped="0" countmarked="0" />
        <category name="CATEGORYNAME" count="0" countcorrect="0" countincorrect="0" countskipped="0" countmarked="0" />
      </categories>
  </exam>
</simpleXMLResult>
)