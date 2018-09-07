import { h } from 'hyperapp'

export const Demographics = ({user}) => (
<demographics appointmentid="" functioncode="" workstationname="">
  <demographic name="CandidateFirstName" value="" />
  <demographic name="CandidateLastName" value="" />
  <demographic name="email" value="{user.email}" />
</demographics>
)